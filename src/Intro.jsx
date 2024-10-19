import { useEffect } from "react";

export default function Intro({ startIndex }) {
  return (
    <div
      className={`text-white press-start-2p-regular relative flex flex-col border-2 border-white w-[600px] h-[800px] text-center`}
    >
      <p className="text-5xl mt-[300px]">Insert coin</p>
      <p className="text-sm mt-4">
        {"(Press"}{" "}
        <span className="border-2 border-gray-600 bg-gray-800 text-white">
          Enter
        </span>{" "}
        {"to Start the Game)"}
      </p>
      <p className="mt-10">{"< 1 Player or 2 Player >"}</p>
      <p className="mt-2 text-[#00FF00]">*1 Player</p>
      <p className="mt-2">*2 Player</p>
    </div>
  );
}

export function Pause({ pauseIndex }) {
  return (
    <div
      className={`text-white press-start-2p-regular relative flex flex-col border-2 border-white w-[600px] h-[800px] text-center `}
    >
      <p className="text-5xl mt-[350px]">Game Paused</p>
      <p className="text-sm mt-4">
        {"(Press"}{" "}
        <span className="border-2 border-gray-600 bg-gray-800 text-white">
          R
        </span>{" "}
        {"to Resume)"}
      </p>
    </div>
  );
}
