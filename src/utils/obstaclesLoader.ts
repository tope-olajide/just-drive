import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { Group, Object3D } from "three/src/Three.js";

const fbxLoader = new FBXLoader();

type ObstacleName = "Bus" | "Taxi" | "Limousine" | "Firetruck" | "Van";
export const loadRoadObstacle = async (obstacleName: ObstacleName) => {
  const bus = await fbxLoader.loadAsync(`./assets/${obstacleName}.fbx`);
  return bus;
};

export const loadObstacleOne = (bus: Object3D, taxi: Object3D) => {
  const meshGroup = new Group();
  const busClone = bus.clone();
  busClone.rotation.y = 180 * (Math.PI / 180);
  busClone.position.set(0.046, -0.075, 0);
  meshGroup.add(busClone);
  const busClone2 = bus.clone();
  busClone2.rotation.y = 180 * (Math.PI / 180);
  busClone2.position.set(-0.04, -0.075, 0.5);
  meshGroup.add(busClone2);
  const busClone3 = bus.clone();
  busClone3.rotation.y = 180 * (Math.PI / 180);
  busClone3.position.set(-0.04, -0.075, 1);
  meshGroup.add(busClone3);
  const taxiClone = taxi.clone();
  taxiClone.position.set(-0.15,-0.075, 1);
  const taxiClone2 = taxi.clone();
  taxiClone2.position.set(0.15, -0.075, 1);
  const taxiClone3 = taxi.clone();
  taxiClone3.position.set(0.15, -0.075, -1);
  meshGroup.add(taxiClone);
  meshGroup.add(taxiClone2);
  meshGroup.add(taxiClone3);
  meshGroup.position.set(0, 0, -10);
  return meshGroup;
};

export const loadObstacleTwo = (
  bus: Object3D,
  taxi: Object3D,
  limo: Object3D,
  fireTruck: Object3D,
  van: Object3D
) => {
  const meshGroup = new Group();
  const taxiCloneLane1 = taxi.clone();
  taxiCloneLane1.position.set(-0.15, -0.075, 1); //lane 1

  const taxiCloneLane2 = taxi.clone();
  taxiCloneLane2.position.set(-0.04, -0.075, 1); //lane 2

  const taxiCloneLane3 = taxi.clone();
  taxiCloneLane3.position.set(0.06, -0.075, 1); //lane 3

  const taxiCloneLane4 = taxi.clone();
  taxiCloneLane4.position.set(0.15, -0.075, 1); //lane 4

  // meshGroup.add(taxiCloneLane1, taxiCloneLane2, taxiCloneLane3, taxiCloneLane4 )

  const busCloneLane1 = bus.clone();
  busCloneLane1.position.set(-0.14, -0.065, 1); //Lane 1

  const busCloneLane2 = bus.clone();
  busCloneLane2.position.set(-0.04, -0.065, 1); // Lane 2

  const busCloneLane3 = bus.clone();
  busCloneLane3.position.set(0.055, -0.065, 1); //Lane 3
  const busCloneLane4 = bus.clone();
  busCloneLane4.position.set(0.15, -0.065, 1); //Lane 4
  // meshGroup.add(busCloneLane1, busCloneLane2, busCloneLane3, busCloneLane4)
  const limoCloneLane1 = limo.clone();
  limoCloneLane1.position.set(-0.14, -0.065, 1); //Lane 1

  const limoCloneLane2 = limo.clone();
  limoCloneLane2.position.set(-0.04, -0.065, 1); // Lane 2

  const limoCloneLane3 = limo.clone();
  limoCloneLane3.position.set(0.055, -0.065, 1); //Lane 3
  const limoCloneLane4 = limo.clone();
  limoCloneLane4.position.set(0.15, -0.065, 1); //Lane 4

  //   meshGroup.add(limoCloneLane1, limoCloneLane2, limoCloneLane3, limoCloneLane4)

  const fireTruckCloneLane1 = fireTruck.clone();
  fireTruckCloneLane1.position.set(-0.14, -0.065, 1); //Lane 1

  const fireTruckCloneLane2 = fireTruck.clone();
  fireTruckCloneLane2.position.set(-0.04, -0.065, 1); // Lane 2

  const fireTruckCloneLane3 = fireTruck.clone();
  fireTruckCloneLane3.position.set(0.055, -0.065, 1); //Lane 3
  const fireTruckCloneLane4 = fireTruck.clone();
  fireTruckCloneLane4.position.set(0.15, -0.065, 1); //Lane 4

  //   meshGroup.add(fireTruckCloneLane1, fireTruckCloneLane2, fireTruckCloneLane3, fireTruckCloneLane4)

  const vanCloneLane1 = van.clone();
  vanCloneLane1.position.set(-0.14, -0.065, 1); //Lane 1

  const vanCloneLane2 = van.clone();
  vanCloneLane2.position.set(-0.04, -0.065, 1); // Lane 2

  const vanCloneLane3 = van.clone();
  vanCloneLane3.position.set(0.055, -0.065, 1); //Lane 3
  const vanCloneLane4 = van.clone();
  vanCloneLane4.position.set(0.15, -0.065, 1); //Lane 4

  meshGroup.add(vanCloneLane1, vanCloneLane2, vanCloneLane3, vanCloneLane4);

  meshGroup.position.set(0, 0, -5);

  return meshGroup;
};
export const loadObstacleThree = (

  limo: Object3D,
  fireTruck: Object3D,
  van: Object3D
) => {
  const meshGroup = new Group();
  const vanCloneLane1 = van.clone();
  vanCloneLane1.position.set(-0.14, -0.065, 1); //Lane 1

  const vanCloneLane2 = van.clone();
  vanCloneLane2.position.set(-0.04, -0.065, 1); // Lane 2

  const vanCloneLane3 = van.clone();
  vanCloneLane3.position.set(0.055, -0.065, 1); //Lane 3

  const limoCloneLane2 = limo.clone();
  limoCloneLane2.position.set(-0.04, -0.065, 0); // Lane 2

  const limoCloneLane3 = limo.clone();
  limoCloneLane3.position.set(0.055, -0.065, 0); //Lane 3

  const fireTruckCloneLane1 = fireTruck.clone();
  fireTruckCloneLane1.position.set(-0.14, -0.065, -1); //Lane 1

  const fireTruckCloneLane3 = fireTruck.clone();
  fireTruckCloneLane3.position.set(0.055, -0.065, -1); //Lane 3
  const fireTruckCloneLane4 = fireTruck.clone();
  fireTruckCloneLane4.position.set(0.15, -0.065, -1); //Lane 4

  meshGroup.add(
    vanCloneLane1,
    vanCloneLane2,
    vanCloneLane3,
    fireTruckCloneLane1,
    limoCloneLane2,
    limoCloneLane3,
    fireTruckCloneLane3,
    fireTruckCloneLane4
  );
  meshGroup.position.set(0, 0, -10);
  return meshGroup;
};

export const loadObstacleFour = (
  taxi: Object3D,
  limo: Object3D,
  fireTruck: Object3D,

) => {
  const meshGroup = new Group();
  const fireTruckCloneLane2 = fireTruck.clone();
  fireTruckCloneLane2.position.set(-0.04, -0.065, 1); // Lane 2

  const fireTruckCloneLane3 = fireTruck.clone();
  fireTruckCloneLane3.position.set(0.055, -0.065, 1); //Lane 3
  const fireTruckCloneLane4 = fireTruck.clone();
  fireTruckCloneLane4.position.set(0.15, -0.065, 1); //Lane 4

  const taxiCloneLane1 = taxi.clone();
  taxiCloneLane1.position.set(-0.15, -0.075, 0); //lane 1

  const taxiCloneLane2 = taxi.clone();
  taxiCloneLane2.position.set(-0.04, -0.075, 0); //lane 2

  const limoCloneLane1 = limo.clone();
  limoCloneLane1.position.set(-0.14, -0.065, -1); //Lane 1

  const limoCloneLane3 = limo.clone();
  limoCloneLane3.position.set(0.055, -0.065, -1); //Lane 3

  meshGroup.add(
    fireTruckCloneLane3,
    fireTruckCloneLane4,
    fireTruckCloneLane2,
    taxiCloneLane1,
    limoCloneLane1,
    limoCloneLane3,
    taxiCloneLane2
  );
  meshGroup.position.set(0, 0, -10);
  return meshGroup;
};

export const loadObstacleFive = (
  bus: Object3D,
  taxi: Object3D,
  limo: Object3D,
) => {
  const meshGroup = new Group();
  const taxiCloneLane1 = taxi.clone();
  taxiCloneLane1.position.set(-0.15, -0.075, 1); //lane 1

  const taxiCloneLane2 = taxi.clone();
  taxiCloneLane2.position.set(-0.04, -0.075, 1); //lane 2

  const limoCloneLane3 = limo.clone();
  limoCloneLane3.position.set(0.055, -0.065, 0); //Lane 3
  const limoCloneLane4 = limo.clone();
  limoCloneLane4.position.set(0.15, -0.065, 0); //Lane 4

  const busCloneLane1 = bus.clone();
  busCloneLane1.position.set(-0.14, -0.065, -1); //Lane 1

  const busCloneLane2 = bus.clone();
  busCloneLane2.position.set(-0.04, -0.065, -1); // Lane 2
  meshGroup.add(
    taxiCloneLane2,
    taxiCloneLane1,
    limoCloneLane4,
    limoCloneLane3,
    busCloneLane1,
    busCloneLane2
  );
  meshGroup.position.set(0, 0, -10);
  return meshGroup;
};

