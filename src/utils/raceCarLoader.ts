import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Car = "Ferrari";

export const loadCar = async (carName: Car) => {
  const glbLoader = new GLTFLoader();
  const block = await glbLoader.loadAsync(`./assets/${carName}.glb`);
  const blockScene = block.scene;
  return blockScene;
};
