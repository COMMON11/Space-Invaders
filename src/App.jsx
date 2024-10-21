import Game from "./Game";
function App() {
  const canvasSize = { width: 600, height: 800 };
  return (
    <>
      <div className="flex flex-col press-start-2p-regular items-center">
        <header className="text-white text-5xl mt-4">Space Invaders!</header>

        <Game canvasSize={canvasSize} />

        <footer className="press-start-2p-regular text-md text-white mt-2">
          Made by: Paras Katekar
        </footer>
      </div>
    </>
  );
}

export default App;
