import { WebGLRenderer, PerspectiveCamera } from "three";

import RaceScene from "./scenes/Race";
import MainMenuScene from "./scenes/MainMenu";
import CarSelectionScene from "./scenes/CarSelectionScene";
import { copyToClipboard, subscribeToAChannel } from "./utils/competition";
//import TournamentScene from "./scenes/Tournament";
const width = window.innerWidth;
const height = window.innerHeight;

let currentScene: MainMenuScene | RaceScene | CarSelectionScene;

const renderer = new WebGLRenderer({
  canvas: document.getElementById("app") as HTMLCanvasElement,
  antialias: true,
});

renderer.setSize(width, height);
export const mainCamera = new PerspectiveCamera(75, width / height, 0.1, 800);
mainCamera.rotation.x = -25 * (Math.PI / 180);
mainCamera.position.set(0, 0.17, -0.45);

function onWindowResize() {
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

const raceScene = new RaceScene();
const mainMenuScene = new MainMenuScene();
const carSelectionScene = new CarSelectionScene();

const switchToMainMenuScene = () => {
  currentScene.hide();
  currentScene = mainMenuScene;
  currentScene.initialize();
};

const switchToRaceScene = () => {
  currentScene.hide();
  currentScene = raceScene;
  currentScene.initialize();
};
const switchToCarSelectionScene = () => {
  currentScene.hide();
currentScene = carSelectionScene;
  currentScene.initialize();
};
currentScene = mainMenuScene;

const render = () => {
  currentScene.update();
  renderer.render(currentScene, mainCamera);
  requestAnimationFrame(render);
};
(document.querySelector("#playGameButton") as HTMLInputElement).onclick =
  () => {
    switchToRaceScene();
  };

 /*  (document.querySelector("#startTournamentButton") as HTMLInputElement).onclick =
    () => {
      switchToTournamentScene();
    (document.getElementById('competitionModal') as HTMLButtonElement).style.display = 'none';
  }; */

const main = async () => {
 
 await carSelectionScene.load();
  await mainMenuScene.load();
   await raceScene.load();
  (document.querySelector(".loader-container") as HTMLElement).style.display =
    "none";
  currentScene.initialize();
  render();
};

main();



(document.querySelector("#quitGameButton") as HTMLInputElement).onclick =
  () => {
    (
      document.getElementById("gamePausedModal") as HTMLInputElement
    ).style.display = "none";
    
    switchToMainMenuScene();
  };

  (document.querySelector("#exitGameButton") as HTMLInputElement).onclick =
  () => {
    (
      document.getElementById("gameOverModal") as HTMLInputElement
    ).style.display = "none";
    switchToMainMenuScene();
  };

(document.querySelector("#closeGamePausedModal") as HTMLInputElement).onclick =
  () => {
    (
      document.getElementById("gamePausedModal") as HTMLInputElement
    ).style.display = "none";
  };

  (document.querySelector(".home-menu") as HTMLInputElement).onclick = () => {
    switchToMainMenuScene();
  };




  (document.querySelector("#closeCompetitionModal") as HTMLInputElement).onclick =
  () => {
    (
      document.getElementById("competitionModal") as HTMLInputElement
    ).style.display = "none";
  };

  
  (document.querySelector("#competitionButton") as HTMLInputElement).onclick =
  () => {
    (document.getElementById('competitionModal') as HTMLButtonElement).style.display = 'flex';
  };

  (document.querySelector("#createCompetitionButton") as HTMLInputElement).onclick =
  () => {
    subscribeToAChannel()
  };
  (document.querySelector("#copyLinkButton") as HTMLInputElement).onclick =
  () => {
    copyToClipboard()
  };

  (document.querySelector("#joinTournamentButton") as HTMLInputElement).onclick =
    () => {
      const urlParams = new URLSearchParams(window.location.search);
      const spaceParam = urlParams?.get('space') || '';
      console.log(spaceParam);
      subscribeToAChannel(spaceParam);
      /* switchToTournamentScene(); */
      (document.getElementById('tournamentInvitationModal') as HTMLButtonElement).style.display = 'none';
      
  };

  (document.querySelector("#marketButton") as HTMLInputElement).onclick =
  () => {
    switchToCarSelectionScene()
  };


