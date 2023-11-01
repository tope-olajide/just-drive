import { WebGLRenderer, PerspectiveCamera } from "three";

import RaceScene from "./scenes/Race";
import MainMenuScene from "./scenes/MainMenu";
const width = window.innerWidth;
const height = window.innerHeight;

let currentScene: MainMenuScene | RaceScene;

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
const main = async () => {
  await raceScene.load();
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




  document
  .getElementById("competitionButton")
  .addEventListener("click", function () {
    alert("ddddddddd");
  });