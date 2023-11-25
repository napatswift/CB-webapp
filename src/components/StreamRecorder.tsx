"use client";

import { SERVER_BASE_URL } from "@/constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface SongAPIResponse {
  results: {
    song: string;
    score: number;
  }[];
}

interface AudioFileCheckerResponse {
  data: {
    is_valid: boolean;
  };
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
  startAt: number = 0
): Promise<{
  data: {
    text: string;
    timestamp: string;
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

  return fetch(SERVER_BASE_URL + "/api/tr/", {
    method: "POST",
    body: form,
    credentials: "include",
  })
    .then((resp) => {
      if (!resp.ok) return { error: resp.statusText };

      return resp.json();
    })
    .catch((err) => ({ data: { text: "", timestamp: "" } }));
}

const FFT_SIZE = 2048;
const BUFFER_LENGTH = 1024;
const FILE_HEADER_SIZE = 44;

function StreamAudioRecorder() {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [lyrics, setLyrics] = useState<{ line: string; timestamp: string }[]>(
    []
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const startRecording = useCallback(() => {
    if (mediaRecorder.current !== null) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorder.current.start(
        2000 // 2 seconds
      );

      mediaRecorder.current.onstop = (e) => {
        audioHandler([...audioChunks.current]).then((resp) => {
          console.log("onstop::done", resp.data.is_valid);
        });
      };

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);

        /*
        audioHandler([...audioChunks.current])
          .then((resp) => {
            console.log("ondataavailable::whole: done", resp.data.is_valid);
          })
          .catch((err) => {
            setErrorMessage(err.message);
          });

        /*
        speechToTextHandler([headerChunk.current, ...audioChunks.current]).then(
          (resp) => {
            console.log("ondataavailable::whole: done", resp.data);
          }
        );*/

        if (audioChunks.current.length < 4) return;
        speechToTextHandler(
          [
            audioChunks.current[0],
            ...audioChunks.current.slice(audioChunks.current.length - 3),
          ],
          2
        ).then((resp) => {
          if (resp.error) {
            setErrorMessage((prev) => resp.error || "");
            return;
          }
          if (!resp.data.text) return;
          setLyrics((prev) =>
            [
              ...prev,
              { line: resp.data.text, timestamp: resp.data.timestamp },
            ].sort((a, b) => {
              if (a.timestamp < b.timestamp) return -1;
              if (a.timestamp > b.timestamp) return 1;
              return 0;
            })
          );
        });
      };
    });
  }, [setLyrics, setErrorMessage]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current === null) return;
    if (mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }

    mediaRecorder.current.stream
      .getAudioTracks()
      .forEach((track) => track.stop());
    mediaRecorder.current = null;
    audioChunks.current = [];
  }, []);

  return (
    <div className=" relative w-full">
      <button className=" absolute top-0 left-0" onClick={startRecording}>
        Start
      </button>
      <button className=" absolute top-0 right-0" onClick={stopRecording}>
        Stop
      </button>
      <div>
        {errorMessage && <div className=" text-red-500">{errorMessage}</div>}
      </div>
      <div>
        {lyrics.map((lyric, i) => (
          <div key={i}>
            {lyric.timestamp} - {lyric.line}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StreamAudioRecorder;
