'use client';

import { SERVER_BASE_URL } from "@/constants";
import { useRef, useState } from "react";

interface SongAPIResponse {
  results: {
    song: string,
    score: number
  }[]
}

function AudioRecorder() {
  const [songs, setSongs] = useState<string[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    if (mediaRecorder.current !== null) {
      return;
    };

    const audioChunks0: Blob[] = [];
    const audioChunks1: Blob[] = [];
    const audioChunks = [audioChunks0, audioChunks1 ]
    let currentIdx = 0;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {

        mediaRecorder.current = new MediaRecorder(stream, {mimeType: 'audio/webm;codecs=opus'});
        mediaRecorder.current.start();

        intervalRef.current = setInterval(() => {
          if (mediaRecorder.current === null) return;
          mediaRecorder.current.stop();
          mediaRecorder.current.start();
          currentIdx = (currentIdx + 1) % 2;
        }, 4500);

        mediaRecorder.current.onstop = (e) => {
          const idx = currentIdx;
          const audioData = audioChunks[idx];

          const blob = new Blob(audioData, { 'type': 'audio/webm;codecs=opus' });
          while (audioChunks[idx].length > 0) {
            audioChunks[idx].pop();
          }
          const form = new FormData();

          form.append('audio', blob, 'audio.webm');
  
          fetch(SERVER_BASE_URL + '/api/fp/', {
            method: 'POST',
            body: form
            })
            .then(data => data.json())
            .then((data: SongAPIResponse) => setSongs(data.results.map(result => `'${result.song}' of ${result.score}`)))
            .catch(err => console.log(err));
        }

        mediaRecorder.current.ondataavailable = (e) => {
          audioChunks[currentIdx].push(e.data);
        }

        return stream;
      })
  };

  const stopRecording = () => {
    if (mediaRecorder.current === null) return;
    if (mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }

    mediaRecorder.current.stream.getAudioTracks().forEach(track => track.stop());
    mediaRecorder.current = null;

    if (intervalRef.current) clearInterval(intervalRef.current!);
  }

  return (
    <>
    <div className="audio-recorder">
      <button onClick={startRecording}>Record</button>
      <button onClick={stopRecording}>Stop</button>
    </div>
    <div>
      <ul>
        {songs.map((song, idx) => <li key={idx}>{song}</li>)}
      </ul>
    </div>
    </>
  );
}

export default AudioRecorder;