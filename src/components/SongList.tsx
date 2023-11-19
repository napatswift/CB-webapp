import { useMemo } from "react";

interface Song {
  name: string;
  score: number;
}
function SongList({ songs }: { songs: Song[] }) {
  const preprocess = useMemo(() => {
    return songs.map((song) => ({
      score: song.score,
      name: song.name.replace(/.*\/\d+\s?[\.\-]?\s+([^\/]+)\.\w+/, "$1"),
    })).reduce((acc, cur) => {
      const idx = acc.findIndex((song) => song.name === cur.name);
      if (idx === -1) {
        return [...acc, cur];
      } else {
        const newAcc = [...acc];
        newAcc[idx].score = Math.min(newAcc[idx].score, cur.score) - 1;
        return newAcc;
      }
    }, [] as Song[]).sort((a, b) => a.score - b.score);
  }, [songs]);

  return (
    <ul>
      {preprocess.map((song, idx) => (
        <li key={idx} className="bg-indigo-100/50 my-2 mx-4 p-4 rounded">
          <p className=" font-bold">
          {song.name}
          </p>
          <hr className="mt-0 mb-2 border-t-indigo-950" />
          <p className=" text-sm">
            {(song.score).toFixed(2)}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default SongList;
