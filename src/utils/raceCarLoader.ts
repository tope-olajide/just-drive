import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type Car = "Sporty"|"Pickup"|"SUV"|"Offroad"|"Ferrari";

export const loadCar = async (carName: string) => {
  const glbLoader = new GLTFLoader();
  const block = await glbLoader.loadAsync(`./assets/${carName}.glb`);
  const blockScene = block.scene;
  return blockScene;
};
