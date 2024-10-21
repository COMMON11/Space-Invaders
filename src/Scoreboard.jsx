import { useEffect, useState } from "react";
import Spaceship from "./assets/Spaceship.svg";
export default function Scoreboard({ score, lives, HiScore }) {
  const spaceshipArray = Array.from({ length: lives - 1 }, (_, index) => (
    <img
      key={index}
      src={Spaceship}
      alt="Spaceship"
      className="h-[50px] w-[50px]"
    />
  ));
  return (
    <>
      <div
        className={`flex flex-col items-center w-[300px] h-[800px] border-2 border-white`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <p className="text-white">Controls:</p>
            <p className="press-start-2p-regular text-white text-sm pt-3">
              <span className="border-2 border-gray-600 bg-gray-800 text-white">
                {"<"}
              </span>{" "}
              or{" "}
              <span className="border-2 border-gray-600 bg-gray-800 text-white">
                A
              </span>{" "}
              <span> to Move left</span>{" "}
            </p>
            <p className="press-start-2p-regular text-white text-sm pt-3">
              <span className="border-2 border-gray-600 bg-gray-800 text-white">
                {">"}
              </span>{" "}
              or{" "}
              <span className="border-2 border-gray-600 bg-gray-800 text-white">
                D
              </span>{" "}
              <span> to Move right</span>
            </p>
            <p className="press-start-2p-regular text-white text-sm pt-3">
              <span className="border-2 border-gray-600 bg-gray-800 text-white">
                Spacebar
              </span>{" "}
              to shoot
            </p>
            <p className="press-start-2p-regular text-white text-sm pt-3">
              <span className="border-2 border-gray-600 bg-gray-800 text-white">
                P
              </span>{" "}
              to pause
            </p>
          </div>

          <div>
            <p className="press-start-2p-regular text-white text-3xl text-center -mt-32">
              Score
            </p>
            <p className="press-start-2p-regular text-white mt-4 text-4xl text-center">
              {score}
            </p>
            <p className="press-start-2p-regular text-white mt-10 text-3xl text-center">
              Hi-Score
            </p>
            <p className="press-start-2p-regular text-white mt-4 text-4xl text-center">
              {HiScore}
            </p>
          </div>
          <div className="flex">
            <p className="press-start-2p-regular text-white ml-2 mt-3 mr-3 mb-5">
              lives:
            </p>
            {spaceshipArray}
          </div>
        </div>
      </div>
    </>
  );
}
