"use client";

import { SERVER_BASE_URL } from "@/constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SongOptions from "./stream/SongOptions";

interface AudioFileCheckerResponse {
  data: {
    is_valid: boolean;
  };
}

interface LyricLine {
  line: string;
  timestamp: string;
}

async function audioHandler(
  audioChunks: Blob[]
): Promise<AudioFileCheckerResponse> {
  const blob = new Blob(audioChunks, {
    type: "audio/webm;codecs=opus",
  });

  const form = new FormData();

  form.append("audio", blob, "audio.webm");
  form.append("timestamp", new Date().toISOString());

  return fetch(SERVER_BASE_URL + "/api/check/audio_file/", {
    method: "POST",
    body: form,
    credentials: "include",
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
}

async function speechToTextHandler(
  audioChunks: Blob[],
  lyricLines: LyricLine[],
  startAt: number = 0,
  userSelectedSongId?: string
): Promise<{
  data: {
    text: string;
    timestamp: string;
    posibleSongs: {
      name: string;
      id: string;
    }[];
  };
  error?: string;
}> {
  const blob = new Blob(audioChunks, {
    type: "audio/webm;codecs=opus",
  });

  const form = new FormData();

  form.append("audio", blob, "audio.webm");
  form.append("start_at", startAt.toString());
  form.append("timestamp", new Date().toISOString());
  form.append("lyric_lines", JSON.stringify(lyricLines))
  form.append("song_id", userSelectedSongId || "");

  return fetch(SERVER_BASE_URL + "/api/tr/", {
    method: "POST",
    body: form,
    credentials: "include",
  })
    .then((resp) => {
      if (!resp.ok) return { error: resp.statusText };

      return resp.json();
    })
    .then((data) => {
      if (data.error) return { error: data.error };
      return data;
    })
    .then(({ data }) => {
      return {
        data: {
          text: data.text,
          timestamp: data.timestamp,
          posibleSongs: data.posible_songs,
        },
      };
    });
}

function StreamAudioRecorder() {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [possibleSongs, setPossibleSongs] = useState<{ name: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recordState, setRecordState] = useState<"inactive" | "active">(
    "inactive"
  );
  const [userSelectedSongId, setUserSelectedSongId] = useState<string | undefined>();
  const audioChunks = useRef<Blob[]>([]);
  const startRecording = useCallback(() => {
    if (mediaRecorder.current !== null) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setLyrics([]); // reset lyrics
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorder.current.start(
        2000 // 2 seconds
      );

      mediaRecorder.current.onstop = (e) => {
        mediaRecorder.current = null;
        audioChunks.current = [];
        setRecordState("inactive");
      };

      setRecordState("active");
    });
  }, [setRecordState]);

  useEffect(() => {
    if (mediaRecorder.current === null || recordState === "inactive") return;

    mediaRecorder.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);

      if (audioChunks.current.length < 4) return;
      const currChunk = audioChunks.current;
      speechToTextHandler(
        [currChunk[0], ...currChunk.slice(currChunk.length - 3)],
        lyrics.slice(Math.max(0, lyrics.length - 5)),
        2,
        userSelectedSongId
      ).then((resp) => {
        if (resp.error) {
          setErrorMessage(() => resp.error || "");
          return;
        }
        if (resp.data.text) {
          setLyrics((prev) => [
            ...prev,
            { line: resp.data.text, timestamp: resp.data.timestamp },
          ]);
        }
        if (resp.data.posibleSongs && resp.data.posibleSongs.length) {
          setPossibleSongs(resp.data.posibleSongs);
        }
      });
      audioChunks.current.splice(1, 2); // remove 2 items from index 1
    };
  }, [lyrics, recordState]);

  useEffect(() => {
    console.log("lyrics", lyrics);
  }, [lyrics]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current === null) return;
    if (mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }

    mediaRecorder.current.stream
      .getAudioTracks()
      .forEach((track) => track.stop());
  }, []);

  return (
    <div>
      <div>
        <button className=" absolute top-0 left-0" onClick={startRecording}>
          Start
        </button>
        <button className=" absolute top-0 right-0" onClick={stopRecording}>
          Stop
        </button>
        <div>
          {errorMessage && <div className=" text-red-500">{errorMessage}</div>}
        </div>
      </div>
      <SongOptions songs={possibleSongs} selectingSongId={userSelectedSongId} setSongId={(songId) => {setUserSelectedSongId(songId) }} />
      <div>
        {lyrics
          .sort((a, b) => {
            if (a.timestamp < b.timestamp) return 1;
            if (a.timestamp > b.timestamp) return -1;
            return 0;
          })
          .map((lyric) => (
            <div key={lyric.timestamp}>
              {lyric.timestamp} - {lyric.line}
            </div>
          ))}
      </div>
    </div>
  );
}

export default StreamAudioRecorder;
