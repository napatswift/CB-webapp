import { useState } from "react";

interface SongOptionsProps {
  songs: {
    name: string;
    id: string;
    current_time: number;
  }[];
  selectingSongId?: string;
  setSongId: React.Dispatch<string | undefined>;
}

function SongOptions({
  songs,
  setSongId,
  selectingSongId: sid,
}: SongOptionsProps) {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div className="flex flex-nowrap w-full overflow-scroll gap-2 pb-4 shrink-0">
      {songs.length > 0 && (
        <button
          className="p-2 rounded bg-blue-50 hover:bg-blue-100 shrink-0"
          onClick={() => setIsHidden((prev) => !prev)}
        >
          {isHidden ? "show all" : "hide"}
        </button>
      )}
      {songs
        .filter((song) => !isHidden || song.id === sid)
        .map((song) => {
        const time = new Date(song.current_time);
        const timeString = `${time.getMinutes()}:${time.getSeconds()}`;
        return (
          <button
            key={song.id}
            className={"p-2 rounded bg-indigo-50 shrink-0 " + (song.id === sid ? "border-2 border-indigo-200" : "")}
            onClick={() => setSongId(song.id === sid ? undefined : song.id)}
          >
            {song.name} {timeString}
          </button>
        );
        })}
      {
        songs.length > 0 && isHidden && (
          <div className="p-2 text-center shrink-0">
            {songs.length - 1} total
          </div>
        )
      }
    </div>
  );
}

export default SongOptions;
