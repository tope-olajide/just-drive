import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const mainRoad = async () => {
  const glbLoader = new GLTFLoader();
  const mainRoad = await glbLoader.loadAsync("./assets/Asphalt.glb");
  const mainRoadScene = mainRoad.scene;
  return mainRoadScene;
};
