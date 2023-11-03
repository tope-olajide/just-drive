import { WebGLRenderer, PerspectiveCamera } from "three";

import RaceScene from "./scenes/Race";
import MainMenuScene from "./scenes/MainMenu";
import { copyToClipboard, subscribeToAChannel } from "./utils/competition";
import TournamentScene from "./scenes/Tournament";
const width = window.innerWidth;
const height = window.innerHeight;

let currentScene: MainMenuScene | RaceScene | TournamentScene;

const renderer = new WebGLRenderer({
  canvas: document.getElementById("app") as HTMLCanvasElement,
  antialias: true,
});

renderer.setSize(width, height);
export const mainCamera = new PerspectiveCamera(60, width / height, 0.1, 800);
mainCamera.rotation.x = -10 * (Math.PI / 180);
mainCamera.position.set(-0.001, 0.1, 0);
function onWindowResize() {
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

const raceScene = new RaceScene();
const mainMenuScene = new MainMenuScene();
const tournamentScene = new TournamentScene();

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
const switchToTournamentScene = () => {
  currentScene.hide();
  currentScene = tournamentScene;
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

  (document.querySelector("#startTournamentButton") as HTMLInputElement).onclick =
    () => {
      switchToTournamentScene();
    (document.getElementById('competitionModal') as HTMLButtonElement).style.display = 'none';
  };

const main = async () => {
  await raceScene.load();
  await tournamentScene.load();
  await mainMenuScene.load();
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
      console.log(spaceParam)
      subscribeToAChannel(spaceParam)
      switchToTournamentScene();
      (document.getElementById('tournamentInvitationModal') as HTMLButtonElement).style.display = 'none';
      
  };
 