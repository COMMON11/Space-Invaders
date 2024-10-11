import Spaceship from "./assets/Spaceship.svg";
export default function Scoreboard(props) {
  return (
    <>
      <div className="flex flex-col items-center w-[300px] h-[800px] border-2 border-white">
        <div className="flex flex-col justify-between h-full">
          <div>
            <p className="press-start-2p-regular text-white mt-60 text-3xl text-center">
              Score
            </p>
            <p className="press-start-2p-regular text-white mt-4 text-4xl text-center">
              0
            </p>
            <p className="press-start-2p-regular text-white mt-10 text-3xl text-center">
              Hi-Score
            </p>
            <p className="press-start-2p-regular text-white mt-4 text-4xl text-center">
              0
            </p>
          </div>
          <div className="flex">
            <p className="press-start-2p-regular text-white ml-2 mt-3 mr-3">
              lives:
            </p>
            <img
              src={Spaceship}
              alt="Spaceship"
              className="h-[50px] w-[50px]"
            />
            <img
              src={Spaceship}
              alt="Spaceship"
              className="h-[50px] w-[50px]"
            />
            <img
              src={Spaceship}
              alt="Spaceship"
              className="h-[50px] w-[50px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
