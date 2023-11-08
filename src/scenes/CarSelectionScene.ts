import {
  AmbientLight,
  DirectionalLight,
  Scene,
  BoxGeometry,
  Mesh,
  Object3D,
  Clock,
  Box3,
  MeshPhongMaterial,
  Group,
} from "three";

import { mainCamera } from "../main";
import TWEEN, { Tween } from "@tweenjs/tween.js";

import { mainRoad } from "../utils/mainRoad";
import { citySkyBox } from "../utils/skybox";
import { loadBlock } from "../utils/buildingBlockLoader";
import { Car, loadCar } from "../utils/raceCarLoader";
import { loadObstacleOne, loadRoadObstacle } from "../utils/obstaclesLoader";
import cars from "../utils/cars";

export interface IallGameCars {
  name: Car;
  model: string;
  isActive: boolean;
  price: number;
  isLocked: boolean;
}

export default class CarSelectionScene extends Scene {
  private mainRoad = new Object3D();
  private mainRoadClone = new Object3D();
  private roadSize = 0;
  private buildingBlocKSize = 0;

  private speed = 1;
  private clock = new Clock();
  private delta = 0;
  private skyBox = new Object3D();
  private buildingBlockA = new Object3D();
  private buildingBlockB = new Object3D();
  private buildingBlockC = new Object3D();
  private buildingBlockD = new Object3D();

  private sporty = new Object3D();
  private pickup = new Object3D();
  private offroad = new Object3D();
  private suv = new Object3D();
  private carsContainer: Object3D[] = [];

  private activeIndexNumber = 0;

  private activeCar = new Object3D();
  private allGameCars: IallGameCars[] = [];

  async load() {
    this.mainRoad = await mainRoad();
    this.skyBox = await citySkyBox();

    this.skyBox.position.set(0, 0, 0);
    this.add(this.skyBox);

    this.buildingBlockA = await loadBlock("BuildingBlockA");
    this.buildingBlockB = await loadBlock("BuildingBlockB");
    this.buildingBlockC = await loadBlock("BuildingBlockC");
    this.buildingBlockD = await loadBlock("BuildingBlockD");

    this.pickup = await loadCar(cars[0].model);
    this.offroad = await loadCar(cars[1].model);
    this.suv = await loadCar(cars[2].model);
    this.sporty = await loadCar(cars[3].model);

    this.pickup.visible = false;
    this.offroad.visible = false;
    this.suv.visible = false;
    this.sporty.visible = false;

    this.add(this.pickup, this.offroad, this.suv, this.sporty);

    this.carsContainer.push(this.pickup, this.offroad, this.suv, this.sporty);

    const light = new DirectionalLight(0xffffff, 3);
    light.position.set(0, 1.5, 1);
    this.add(light);
    const ambient = new AmbientLight("#fff", 1);
    this.add(ambient);

    if (!JSON.parse(localStorage.getItem("allGameCars")!)) {
      localStorage.setItem("allGameCars", JSON.stringify(cars));
    }

    this.allGameCars = JSON.parse(localStorage.getItem("allGameCars")!);

    (document.getElementById("nextBtn") as HTMLInputElement).onclick = () => {
      this.switchToNextCar();
    };

    (document.getElementById("prevBtn") as HTMLInputElement).onclick = () => {
      this.switchToPrevCar();
    };

    (document.getElementById("car-price-button") as HTMLInputElement).onclick =
      () => {
        this.purchaseCharacter();
      };

    (
      document.getElementById("selectCharacterBtn") as HTMLInputElement
    ).onclick = () => {
      this.activateCar();
    };
  }
  private switchToNextCar() {
    if (this.activeIndexNumber + 1 !== this.carsContainer.length) {
      this.activeCar.visible = false;
      this.activeIndexNumber += 1;
      this.activeCar = this.carsContainer[this.activeIndexNumber];
      this.activeCar.scale.set(0.035, 0.035, 0.04);
      this.activeCar.position.set(0, -0.081, -0.48);
      this.activeCar.visible = true;
      this.add(this.mainRoadClone);
    }
  }

  private switchToPrevCar() {
    if (this.activeIndexNumber !== 0) {
      this.activeCar.visible = false;
      this.activeIndexNumber -= 1;
      this.activeCar = this.carsContainer[this.activeIndexNumber];
      this.activeCar.scale.set(0.035, 0.035, 0.04);
      this.activeCar.position.set(0, -0.081, -0.48);
      this.activeCar.visible = true;
    }
  }

  initialize() {
    this.activeCar = this.carsContainer[this.activeIndexNumber];
    this.activeCar.scale.set(0.035, 0.035, 0.04);
    this.activeCar.position.set(0, -0.081, -0.48);
    this.activeCar.visible = true;
    (
      document.querySelector(".car-selection-container") as HTMLInputElement
    ).style.display = "flex";
    if (!this.visible) {
      this.visible = true;
    }

    mainCamera.rotation.x = -5 * (Math.PI / 180);

    mainCamera.position.set(0, 0.06, 0);

    (
      document.querySelector(".info-section") as HTMLInputElement
    ).style.display = "block";

    (document.querySelector(".high-score") as HTMLInputElement).innerHTML =
      JSON.parse(localStorage.getItem("high-score")!);
    (document.querySelector(".total-coins") as HTMLInputElement).innerHTML =
      JSON.parse(localStorage.getItem("total-coins")!);

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

    (document.querySelector(".home-menu") as HTMLInputElement).style.display =
      "block";
  }

  private activateCar() {
    const savedPlayerData: IallGameCars[] = JSON.parse(
      localStorage.getItem("allGameCars")!
    );
    const updatedCarData = savedPlayerData.map((playerInfo, index: number) => {
      if (this.activeIndexNumber === index) {
        return {
          ...playerInfo,
          isActive: true,
          price: 0,
          isLocked: false,
        };
      }
      return { ...playerInfo, isActive: false };
    });
    localStorage.setItem("allGameCars", JSON.stringify(updatedCarData));
    this.allGameCars = updatedCarData;
  }

  private purchaseCharacter() {
    const totalCoins = Number(localStorage.getItem("total-coins"));
    if (totalCoins >= this.allGameCars[this.activeIndexNumber].price) {
      const remainingCoins =
        totalCoins - Number(this.allGameCars[this.activeIndexNumber].price);
      localStorage.setItem("total-coins", remainingCoins.toString()!);
      this.activateCar();
      (
        document.querySelector(".total-coins") as HTMLInputElement
      ).innerHTML = `${remainingCoins}`;
    }
  }

  update() {
    this.delta = this.clock.getDelta();
    this.activeCar.rotation.y += this.speed * this.delta;
    (document.querySelector(".car-name") as HTMLInputElement).innerHTML =
      this.allGameCars[this.activeIndexNumber].name;

    if (this.allGameCars[this.activeIndexNumber].isLocked) {
      (
        document.getElementById("selectCharacterBtn") as HTMLInputElement
      ).style.display = "none";
      (
        document.getElementById("car-price-button") as HTMLInputElement
      ).style.display = "block";
      (
        document.getElementById("character-price-text") as HTMLInputElement
      ).innerHTML = `${this.allGameCars[this.activeIndexNumber].price}`;
    }
    if (this.allGameCars[this.activeIndexNumber].isActive) {
      (
        document.getElementById("selectCharacterBtn") as HTMLInputElement
      ).style.display = "block";
      (
        document.getElementById("car-price-button") as HTMLInputElement
      ).style.display = "none";
      (
        document.getElementById("select-button-text") as HTMLInputElement
      ).innerHTML = "Selected";
    }

    if (
      !this.allGameCars[this.activeIndexNumber].isLocked &&
      !this.allGameCars[this.activeIndexNumber].isActive
    ) {
      (
        document.getElementById("selectCharacterBtn") as HTMLInputElement
      ).style.display = "block";
      (
        document.getElementById("car-price-button") as HTMLInputElement
      ).style.display = "none";
      (
        document.getElementById("select-button-text") as HTMLInputElement
      ).innerText = "Select";
    }
  }

  hide() {
    this.visible = false;
    (
      document.querySelector(".menu-buttons-container") as HTMLInputElement
    ).style.display = "none";
    (
      document.querySelector(".info-section") as HTMLInputElement
    ).style.display = "none";
    (document.querySelector(".home-menu") as HTMLInputElement).style.display =
      "none";
    (
      document.querySelector(".car-selection-container") as HTMLInputElement
    ).style.display = "none";
  }
}
