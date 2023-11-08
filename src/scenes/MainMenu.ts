import {
  AmbientLight,
  DirectionalLight,
  Scene,
  Object3D,
  Box3,
  Group,
} from "three";

import { mainCamera } from "../main";
import TWEEN, { Tween } from "@tweenjs/tween.js";

import { mainRoad } from "../utils/mainRoad";
import { citySkyBox } from "../utils/skybox";
import { loadBlock } from "../utils/buildingBlockLoader";
import { loadCar } from "../utils/raceCarLoader";
import { loadRoadObstacle } from "../utils/obstaclesLoader";
import cars from "../utils/cars";
import { IallGameCars } from "./CarSelectionScene";

export default class MainMenuScene extends Scene {
  private mainRoad = new Object3D();
  private mainRoadClone = new Object3D();
  private roadSize = 0;
  private buildingBlocKSize = 0;

  private skyBox = new Object3D();
  private buildingBlockA = new Object3D();
  private buildingBlockB = new Object3D();
  private buildingBlockC = new Object3D();
  private buildingBlockD = new Object3D();



  private bus = new Object3D();
  private taxi = new Object3D();


  private allGameCars: IallGameCars[] = [];

  private activeCarIndex = 0;

  private sporty = new Object3D();
  private pickup = new Object3D();
  private offroad = new Object3D();
  private suv = new Object3D();
  private carsContainer: Object3D[] = [];

  private playerCar = new Object3D();


  async load() {
    this.mainRoad = await mainRoad();
    this.skyBox = await citySkyBox();

    this.skyBox.position.set(0, 0, 0);
    this.add(this.skyBox);
    this.buildingBlockA = await loadBlock("BuildingBlockA");
    this.buildingBlockB = await loadBlock("BuildingBlockB");
    this.buildingBlockC = await loadBlock("BuildingBlockC");
    this.buildingBlockD = await loadBlock("BuildingBlockD");
    this.bus = await loadRoadObstacle("Bus");
    this.bus.scale.set(0.00015, 0.00015, 0.00015);

    this.taxi = await loadRoadObstacle("Taxi");
    this.taxi.scale.set(0.00017, 0.00017, 0.00017);

    

    const light = new DirectionalLight(0xffffff, 3);
    light.position.set(0, 1.5, 1);
    this.add(light);
    const ambient = new AmbientLight("#fff", 1);
    this.add(ambient);

    this.pickup = await loadCar(cars[0].name);
    this.offroad = await loadCar(cars[1].name);
    this.suv = await loadCar(cars[2].name);
    this.sporty = await loadCar(cars[3].name);

    this.pickup.visible = false;
    this.offroad.visible = false;
    this.suv.visible = false;
    this.sporty.visible = false;

    this.add(this.pickup, this.offroad, this.suv, this.sporty);

    this.carsContainer.push(this.pickup, this.offroad, this.suv, this.sporty);

    
      
    this.buildingBlockA.position.set(-0.45, -0.088, -1.6);
    this.buildingBlockA.scale.set(0.02, 0.009, 0.015);
    this.add(this.buildingBlockA);

    this.buildingBlockB.position.set(-0.45, -0.088, -1.6);
    this.buildingBlockB.scale.set(0.02, 0.009, 0.015);
    this.add(this.buildingBlockB);

    this.buildingBlockC.position.set(0.45, -0.088, -2.9);
    this.buildingBlockC.rotation.set(0, 600.05, 0);
    this.buildingBlockC.scale.set(0.02, 0.009, 0.015);
    this.add(this.buildingBlockC);

    this.buildingBlockD.position.set(0.45, -0.088, -2.9);
    this.buildingBlockD.rotation.set(0, 600.05, 0);
    this.buildingBlockD.scale.set(0.02, 0.009, 0.015);
    this.add(this.buildingBlockD);

    this.mainRoad.position.set(0, -0.1, -2.1);
      this.mainRoad.scale.set(0.04, 0.04, 0.04);
      
    this.add(this.mainRoad);

    this.mainRoadClone = this.mainRoad.clone();

    const roadBox = new Box3().setFromObject(this.mainRoad);
    const buildingBlockBox = new Box3().setFromObject(this.buildingBlockD);
    this.buildingBlocKSize = buildingBlockBox.max.z - buildingBlockBox.min.z;

    this.buildingBlockA.position.z =
      this.buildingBlockB.position.z - this.buildingBlocKSize;
    this.buildingBlockC.position.z =
      this.buildingBlockD.position.z - this.buildingBlocKSize;

    this.roadSize = roadBox.max.z - roadBox.min.z - 0.01;

    this.mainRoadClone.position.z = this.mainRoad.position.z - this.roadSize;
    console.log(this.mainRoadClone.position.z);

    this.add(this.mainRoadClone);
  }

  initialize() {
    if (!this.visible) {
      this.visible = true;
    }

    
      
    
    const urlParams = new URLSearchParams(window.location.search);
    const spaceParam = urlParams.get("space");
    if (spaceParam) {
      (
        document.querySelector("#tournamentInvitationModal") as HTMLInputElement
      ).style.display = "flex";
    }

    mainCamera.rotation.x = -5 * (Math.PI / 180);

    mainCamera.position.set(0, 0.06, 0);
    (
      document.querySelector(".menu-buttons-container") as HTMLInputElement
    ).style.display = "flex";
    (
      document.querySelector(".info-section") as HTMLInputElement
    ).style.display = "block";

    (document.querySelector(".high-score") as HTMLInputElement).innerHTML =
      JSON.parse(localStorage.getItem("high-score")!);
    (document.querySelector(".total-coins") as HTMLInputElement).innerHTML =
      JSON.parse(localStorage.getItem("total-coins")!);




  



    this.allGameCars = JSON.parse(localStorage.getItem("allGameCars")!);
    this.activeCarIndex = this.allGameCars.findIndex(
      (car) => car.isActive === true
    );
      
      this.playerCar = this.carsContainer[this.activeCarIndex];
      this.playerCar.scale.set(0.025, 0.025, 0.025);
      //this.playerCar.rotation.y = 180 * (Math.PI / 180);
      this.playerCar.position.set(0, -0.065, -0.3);
        this.playerCar.visible = true
 
 
  }


  update() {}

  hide() {
    this.visible = false;
    (
      document.querySelector(".menu-buttons-container") as HTMLInputElement
    ).style.display = "none";
    (
      document.querySelector(".info-section") as HTMLInputElement
    ).style.display = "none";
  }
}
