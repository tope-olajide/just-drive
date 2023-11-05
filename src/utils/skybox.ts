

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const citySkyBox = async () => {
  const glbLoader = new GLTFLoader();
  const skyBox = await glbLoader.loadAsync("./assets/skybox.glb");
  const skyBoxScene = skyBox.scene;
  return skyBoxScene;
};