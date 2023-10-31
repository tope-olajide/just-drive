import { WebGLRenderer, PerspectiveCamera } from "three";

import RaceScene from "./scenes/Race";
import MainMenuScene from "./scenes/MainMenu";
const width = window.innerWidth;
const height = window.innerHeight;

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

const render = () => {
  mainMenuScene.update();
  renderer.render(mainMenuScene, mainCamera);
  requestAnimationFrame(render);
};

const main = async () => {
  await mainMenuScene.load();
  (document.querySelector(".loader-container") as HTMLElement).style.display =
    "none";
  
  mainMenuScene.initialize();

  render();
};

main();
