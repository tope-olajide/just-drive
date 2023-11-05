import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { Group, Object3D } from "three/src/Three.js";

const fbxLoader = new FBXLoader();

export const loadCoin = async () => {
    const coin = await fbxLoader.loadAsync("./assets/Coin.fbx");
    return coin;
  };
  
  export const loadGroupACoins = (coin: Object3D) => {
    const coinsGroup = new Group();
    for (let i = 0; i < 5; i += 1) {
      const laneACoin = coin.clone();
      const laneBCoin = coin.clone();
      const laneCCoin = coin.clone();
      const laneDCoin = coin.clone();
      laneACoin.position.set(-0.15, -0.06, -i * 0.26);
      laneBCoin.position.set(-0.04, -0.06, -i * 0.26);
      laneCCoin.position.set(0.16, -0.06, -i * 0.26);
      laneDCoin.position.set(0.05, -0.06, -i * 0.26);
      coinsGroup.add(laneACoin);
      coinsGroup.add(laneBCoin);
      coinsGroup.add(laneCCoin);
      coinsGroup.add(laneDCoin);
    }
    coinsGroup.position.set(0, 0, -10);
    return coinsGroup;
  };
  
  export const loadGroupBCoins = (coin: Object3D) => {
    const coinsGroup = new Group();
    for (let i = 0; i < 5; i += 1) {
      const laneBCoin = coin.clone();
      const laneCCoin = coin.clone();
      const laneDCoin = coin.clone();
      laneBCoin.position.set(-0.04, -0.06, -i * 0.26);
      laneCCoin.position.set(0.16, -0.06, -i * 0.26);
      laneDCoin.position.set(0.05, -0.06, -i * 0.26);
      coinsGroup.add(laneBCoin);
      coinsGroup.add(laneCCoin);
      coinsGroup.add(laneDCoin);
    }
    coinsGroup.position.set(0, 0, -10);
    return coinsGroup;
  };
  
  export const loadGroupCCoins = (coin: Object3D) => {
    const coinsGroup = new Group();
    for (let i = 0; i < 5; i += 1) {
      const laneCCoin = coin.clone();
      const laneDCoin = coin.clone();
      laneCCoin.position.set(0.16, -0.06, -i * 0.26);
      laneDCoin.position.set(0.05, -0.06, -i * 0.26);
      coinsGroup.add(laneCCoin);
      coinsGroup.add(laneDCoin);
    }
    coinsGroup.position.set(0, 0, -10);
    return coinsGroup;
  };
  
  export const loadGroupDCoins = (coin: Object3D) => {
    const coinsGroup = new Group();
    for (let i = 0; i < 5; i += 1) {
      const laneDCoin = coin.clone();
      laneDCoin.position.set(0.05, -0.06, -i * 0.26);
      coinsGroup.add(laneDCoin);
    }
    coinsGroup.position.set(0, 0, -10);
    return coinsGroup;
  };
  
  export const loadGroupECoins = (coin: Object3D) => {
    const coinsGroup = new Group();
    for (let i = 0; i < 5; i += 1) {
      const laneACoin = coin.clone();
      const laneDCoin = coin.clone();
      laneACoin.position.set(-0.15, -0.06, -i * 0.26);
      laneDCoin.position.set(0.05, -0.06, -i * 0.26);
      coinsGroup.add(laneACoin);
      coinsGroup.add(laneDCoin);
    }
    coinsGroup.position.set(0, 0, -10);
    return coinsGroup;
  };
  
  export const loadGroupFCoins = (coin: Object3D) => {
      const coinsGroup = new Group();
      for (let i = 0; i < 5; i += 1) {
        const laneBCoin = coin.clone();
        const laneCCoin = coin.clone();
        laneBCoin.position.set(-0.04, -0.06, -i * 0.26);
        laneCCoin.position.set(0.16, -0.06, -i * 0.26);
        coinsGroup.add(laneBCoin);
        coinsGroup.add(laneCCoin);
      }
      coinsGroup.position.set(0, 0, -10);
      return coinsGroup;
    };