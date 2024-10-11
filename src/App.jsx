import Game from "./Game";
import Scoreboard from "./Scoreboard";
function App() {
  const canvasSize = { width: 600, height: 800 };
  return (
    <>
      <div className="flex flex-col press-start-2p-regular items-center">
        <hearder className="text-white text-5xl mt-4">Space Invaders!</hearder>
        <div className="flex w-[900px] h-[800px] mt-10">
          <Game canvasSize={canvasSize} />
          <Scoreboard canvasSize={canvasSize} />
        </div>
        <footer className="press-start-2p-regular text-2xl text-white mt-2">
          Made by: Paras Katekar
        </footer>
      </div>
    </>
  );
}

export default App;
