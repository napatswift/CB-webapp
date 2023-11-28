"use client";

import { SERVER_BASE_URL } from "@/constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SongOptions from "./stream/SongOptions";
import LyricPlayer from "./LyricPlayer";
import ASRLines from "./ASRLines";

interface AudioFileCheckerResponse {
  data: {
    is_valid: boolean;
  };
}

interface LyricLine {
  line: string;
  timestamp: string;
}

interface SongWithLyrics {
  id: string;
  name: string;
  current_time: number;
  time_stamp: string;
  lyric: {
    start_time_ms: number;
    words: string;
    spotify_uri: string;
  }[];
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
    posibleSongs: SongWithLyrics[];
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
  form.append("lyric_lines", JSON.stringify(lyricLines));
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
  const [possibleSongs, setPossibleSongs] = useState<SongWithLyrics[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recordState, setRecordState] = useState<"inactive" | "active">(
    "inactive"
  );
  const [userSelectedSongId, setUserSelectedSongId] = useState<
    string | undefined
  >();

  const isLyricLocked = useRef<string | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = useCallback(() => {
    if (mediaRecorder.current !== null) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setUserSelectedSongId(undefined);
      isLyricLocked.current = null;
      setPossibleSongs([]); // reset possible songs
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
      if (isLyricLocked.current === null) {
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
          if (
            resp.data.posibleSongs &&
            resp.data.posibleSongs.length &&
            mediaRecorder.current !== null &&
            isLyricLocked.current === null
          ) {
            setPossibleSongs(resp.data.posibleSongs);
          }
        });
      }
      audioChunks.current.splice(1, 2); // remove 2 items from index 1
    };
  }, [lyrics, recordState, userSelectedSongId]);

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

  const lyricPlayers = useMemo(() => {
    return possibleSongs.map((song) => ({
      songId: song.id,
      node: (
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <div>
            <p className="font-bold">
              {song.name + " "}
              <button
                className="text-sm text-blue-500 bg-blue-50 hover:bg-blue-100 p-1 rounded"
                onClick={() =>
                  (isLyricLocked.current =
                    isLyricLocked.current === song.id ? null : song.id)
                }
              >
                lock
              </button>
            </p>
          </div>
          <LyricPlayer
            key={song.id}
            startAt={song.time_stamp}
            startTimeMsAt={song.current_time}
            lyrics={song.lyric.sort(
              (a, b) => a.start_time_ms - b.start_time_ms
            )}
          />
        </div>
      ),
    }));
  }, [possibleSongs]);

  const filteredLyricPlayers = useMemo(() => {
    return lyricPlayers.filter(
      (lyricPlayer) =>
        !userSelectedSongId || lyricPlayer.songId === userSelectedSongId
    );
  }, [lyricPlayers, userSelectedSongId]);

  return (
    <div className="h-[100vh]  p-2 flex flex-col gap-2">
      <div className="">
        <button
          className="p-2 bg-red-500 text-white rounded-xl"
          onClick={startRecording}
        >
          Start
        </button>
        <button className="p-2" onClick={stopRecording}>
          Stop
        </button>
        <div>
          {errorMessage && <div className=" text-red-500">{errorMessage}</div>}
        </div>
      </div>
      {possibleSongs.length > 0 && (
        <SongOptions
          songs={possibleSongs}
          selectingSongId={userSelectedSongId}
          setSongId={(songId) => {
            setUserSelectedSongId(songId);
          }}
        />
      )}
      <div className="overflow-hidden">
        {filteredLyricPlayers.length > 0 && filteredLyricPlayers[0].node}
      </div>
      <div>
        <ASRLines lineList={lyrics} />
      </div>
    </div>
  );
}

export default StreamAudioRecorder;
