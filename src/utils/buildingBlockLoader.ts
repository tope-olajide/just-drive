import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Block = "BuildingBlockA" | "BuildingBlockB" | "BuildingBlockC" | "BuildingBlockD";

export const loadBlock = async (blockName: Block) => {
  const glbLoader = new GLTFLoader();
  const block = await glbLoader.loadAsync(`./assets/${blockName}.glb`);
  const blockScene = block.scene;
  return blockScene;
};
