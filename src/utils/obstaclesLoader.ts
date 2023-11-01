import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Group, Object3D } from 'three/src/Three.js';

const fbxLoader = new FBXLoader();

type ObstacleName = "Bus" | 'Taxi';
export const loadRoadObstacle = async (obstacleName:ObstacleName) => {
    const bus = await fbxLoader.loadAsync(`./assets/${obstacleName}.fbx`);
    return bus
}

export const loadObstacleOne = (bus:Object3D, taxi:Object3D) => {
    const meshGroup = new Group();
    const busClone = bus.clone();
    busClone.rotation.y = 180 * (Math.PI / 180);
    busClone.position.set(0.046, -0.065, 0);
    meshGroup.add(busClone)
    const busClone2 = bus.clone();
    busClone2.rotation.y = 180 * (Math.PI / 180);
    busClone2.position.set(-0.04, -0.065, 0.5);
    meshGroup.add(busClone2)
    const busClone3 = bus.clone();
    busClone3.rotation.y = 180 * (Math.PI / 180);
    busClone3.position.set(-0.04, -0.065, 1);
    meshGroup.add(busClone3)
    const taxiClone = taxi.clone();
    taxiClone.position.set(-0.15, -0.065, 1);
    const taxiClone2 = taxi.clone();
    taxiClone2.position.set(0.15, -0.065, 1);
    const taxiClone3 = taxi.clone();
    taxiClone3.position.set(0.15, -0.065, -0.5);
    meshGroup.add(taxiClone)
    meshGroup.add(taxiClone2)
    meshGroup.add(taxiClone3)
    meshGroup.position.set(0, 0, -5);
   
    return meshGroup
}

export const loadCoin = async () => {
    const coin = await fbxLoader.loadAsync('./assets/Coin.fbx');
    return coin
}

export const loadGroupACoins =  (coin:Object3D) => {
    
    const coinsGroup = new Group();
    for (let i = 0; i < 5; i += 1) {
        const laneACoin = coin.clone();
        const laneBCoin = coin.clone();
        const laneCCoin = coin.clone();
        const laneDCoin = coin.clone();
        laneACoin.position.set(-0.15, -0.06, -i * 0.16);
        laneBCoin.position.set(-0.04, -0.06, -i * 0.16);
        laneCCoin.position.set(0.16, -0.06, -i * 0.16);
        laneDCoin.position.set(0.05, -0.06, -i * 0.16);
        
        coinsGroup.add(laneACoin, laneBCoin, laneCCoin, laneDCoin);
      }
      coinsGroup.position.set(0, 0, -1);
      return coinsGroup

}