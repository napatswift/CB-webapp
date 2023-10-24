'use client';

import { SERVER_BASE_URL } from "@/constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface SongAPIResponse {
  results: {
    song: string,
    score: number
  }[]
}

const FFT_SIZE = 2048;
const BUFFER_LENGTH = 1024;

function AudioRecorder() {
  const [songs, setSongs] = useState<string[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const doubleDataArray = useMemo(() => new Uint8Array(FFT_SIZE * 2), []);

  const draw = useCallback(() => {
    if (canvasRef.current === null) return;
    if (analyserRef.current === null) return;
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    const dataArray = new Uint8Array(BUFFER_LENGTH);

    const ctx = canvas.getContext('2d');
    if (ctx === null) return;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const drawVisual = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(0, 0, 0)';

    ctx.beginPath();

    const sliceWidth = WIDTH * 1.0 / BUFFER_LENGTH;
    let x = 0;

    for(let i = 0; i < BUFFER_LENGTH; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * HEIGHT/2;

      if(i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();

    return () => {
      cancelAnimationFrame(drawVisual);
    }
  }, []);

  const startRecording = useCallback(() => {
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
            .then((data: SongAPIResponse) => {
              setSongs(data.results.map(result => `'${result.song}' of ${result.score}`))
            })
            .catch(err => console.log(err));
        }

        mediaRecorder.current.ondataavailable = (e) => {
          audioChunks[currentIdx].push(e.data);
        }

        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        const gainer = audioCtx.createGain();
        gainer.gain.value = 0;
        source.connect(analyser);
        analyser.connect(gainer);
        gainer.connect(audioCtx.destination);
        analyser.fftSize = 2048;

        analyserRef.current = analyser;

        draw();

        return stream;
      })
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current === null) return;
    if (mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }

    mediaRecorder.current.stream.getAudioTracks().forEach(track => track.stop());
    mediaRecorder.current = null;

    if (intervalRef.current) clearInterval(intervalRef.current!);
  }, []);

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
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
    </>
  );
}

export default AudioRecorder;