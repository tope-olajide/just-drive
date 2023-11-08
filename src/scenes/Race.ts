import { mainCamera } from "./../main";
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
  Vector3,
} from "three";

import {
  checkPlayersGameOverStatus,
  displayCongratulationModal,
  mainCamera,
  sortAndGetPosition,
} from "../main";

// @ts-ignore
import TWEEN, { Tween } from "@tweenjs/tween.js";

import { mainRoad } from "../utils/mainRoad";
import { citySkyBox } from "../utils/skybox";
import { loadBlock } from "../utils/buildingBlockLoader";
import { loadCar } from "../utils/raceCarLoader";
import {
  loadObstacleOne,
  loadRoadObstacle,
  loadObstacleThree,
  loadObstacleFour,
  loadObstacleFive,
} from "../utils/obstaclesLoader";
import {
  loadCoin,
  loadGroupACoins,
  loadGroupBCoins,
  loadGroupCCoins,
  loadGroupDCoins,
  loadGroupECoins,
  loadGroupFCoins,
} from "../utils/coinsLoader";
import { IallGameCars } from "./CarSelectionScene";
import cars from "../utils/cars";
import {
  channel,
  displayScore,
  startBroadcastingScore,
  userScores,
  username,
} from "../utils/tournament";

export default class RaceScene extends Scene {
  private isTornamentMode: string | undefined;

  private mainRoad = new Object3D();
  private mainRoadClone = new Object3D();
  private roadSize = 0;
  private buildingBlocKSize = 0;
  private isPlayerHeadStart = false;
  private speed = 1;
  private clock = new Clock();
  private delta = 0;
  private skyBox = new Object3D();
  private buildingBlockA = new Object3D();
  private buildingBlockB = new Object3D();
  private buildingBlockC = new Object3D();
  private buildingBlockD = new Object3D();

  private pooledObstacles = <Array<Object3D>>[];
  private pooledCoins = <Array<Object3D>>[];
  private bus = new Object3D();
  private taxi = new Object3D();
  private coin = new Object3D();
  private obstacleOne = new Group();
  // private obstacleTwo = new Group();
  private obstacleThree = new Group();
  private obstacleFour = new Group();
  private obstacleFive = new Group();
  private groupACoins = new Group();
  private groupBCoins = new Group();
  private groupCCoins = new Group();
  private groupDCoins = new Group();
  private groupECoins = new Group();
  private groupFCoins = new Group();
  private isGamePaused = false;
  private playerBoxCollider = new Box3(new Vector3(), new Vector3());
  private obstacleBox = new Box3(new Vector3(), new Vector3());
  private obstacleBox2 = new Box3(new Vector3(), new Vector3());
  private coinBox = new Box3(new Vector3(), new Vector3());

  private scores = 0;

  private coins = 0;

  private isGameOver = false;
  private limo!: Object3D;
  private fireTruck!: Object3D;
  private van!: Object3D;

  private activeObstacleOne = new Object3D();

  private activeObstacleTwo = new Object3D();

  private activeCoinsGroup = new Object3D();
  private allGameCars: IallGameCars[] = [];

  private activeCarIndex = 0;

  private sporty = new Object3D();
  private pickup = new Object3D();
  private offroad = new Object3D();
  private suv = new Object3D();
  private carsContainer: Object3D[] = [];

  private playerCar!: Object3D;

  constructor(isTournament?: string) {
    super();
    this.load();
    this.isTornamentMode = isTournament;
  }

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

    this.ferrari = await loadCar("Offroad");
    this.bus = await loadRoadObstacle("Bus");
    this.bus.scale.set(0.0002, 0.0002, 0.0002);

    this.taxi = await loadRoadObstacle("Taxi");
    this.taxi.scale.set(0.00017, 0.00017, 0.00017);

    this.limo = await loadRoadObstacle("Limousine");
    this.limo.scale.set(0.00019, 0.00019, 0.00019);

    this.fireTruck = await loadRoadObstacle("Firetruck");
    this.fireTruck.scale.set(0.00019, 0.00019, 0.00019);

    this.van = await loadRoadObstacle("Van");
    this.van.scale.set(0.00019, 0.00019, 0.00019);

    this.coin = await loadCoin();
    this.coin.scale.set(0.00016, 0.00016, 0.00016);
    this.coin.rotation.set(90 * (Math.PI / 180), 0, 0);

    this.obstacleOne = loadObstacleOne(this.bus, this.taxi);

    this.obstacleThree = loadObstacleThree(
      this.bus,
      this.taxi,
      this.limo,
      this.fireTruck,
      this.van
    );
    this.obstacleFour = loadObstacleFour(
      this.bus,
      this.taxi,
      this.limo,
      this.fireTruck,
      this.van
    );
    this.obstacleFive = loadObstacleFive(
      this.bus,
      this.taxi,
      this.limo,
      this.fireTruck,
      this.van
    );
    this.groupACoins = loadGroupACoins(this.coin);
    this.groupBCoins = loadGroupBCoins(this.coin);
    this.groupCCoins = loadGroupCCoins(this.coin);
    this.groupDCoins = loadGroupDCoins(this.coin);
    this.groupECoins = loadGroupECoins(this.coin);
    this.groupFCoins = loadGroupFCoins(this.coin);

    (document.querySelector(".pause-button") as HTMLInputElement).onclick =
      () => {
        this.pauseAndResumeGame();
      };
    (
      document.querySelector("#closeGamePausedModal") as HTMLInputElement
    ).onclick = () => {
      this.pauseAndResumeGame();
    };
    (document.getElementById("resumeGameButton") as HTMLInputElement).onclick =
      () => {
        this.pauseAndResumeGame();
      };

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
    this.mainRoad.scale.set(0.045, 0.045, 0.045);
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

    this.add(this.mainRoadClone);

    this.poolObstacles();
    this.poolCoins();

    const light = new DirectionalLight(0xffffff, 3);
    light.position.set(0, 1.5, 1);
    this.add(light);
    const ambient = new AmbientLight("#fff", 1);
    this.add(ambient);
    (document.getElementById("restartGameButton") as HTMLInputElement).onclick =
      () => {
        this.restartGame();
      };
  }

  private poolObstacles() {
    this.obstacleOne.visible = false;
    // this.obstacleTwo.visible = false;
    this.obstacleThree.visible = false;
    this.obstacleFour.visible = false;
    this.obstacleFive.visible = false;
    this.add(
      this.obstacleThree,
      this.obstacleOne,
      this.obstacleFour,
      this.obstacleFive
    );
    this.pooledObstacles.push(
      this.obstacleThree,
      this.obstacleOne
      /*  this.obstacleFour,
      this.obstacleFive */
    );
  }
  private poolCoins() {
    this.groupACoins.visible = false;
    this.groupBCoins.visible = false;
    this.groupCCoins.visible = false;
    this.groupDCoins.visible = false;
    this.groupECoins.visible = false;
    this.groupFCoins.visible = false;
    this.add(
      this.groupACoins,
      this.groupBCoins,
      this.groupCCoins,
      this.groupDCoins,
      this.groupECoins,
      this.groupFCoins
    );
    this.pooledCoins.push(
      this.groupACoins,
      this.groupBCoins,
      this.groupCCoins,
      this.groupDCoins,
      this.groupECoins,
      this.groupFCoins
    );
  }
  private getRandomPooledObstacle() {
    const availableItems = this.pooledObstacles.filter((item) => !item.visible);
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    return availableItems[randomIndex];
  }
  private getRandomPooledCoin() {
    const availableItems = this.pooledCoins.filter((item) => !item.visible);
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    return availableItems[randomIndex];
  }

  private spawnObstacleOne() {
    this.activeObstacleOne = this.getRandomPooledObstacle();
    this.activeObstacleOne.position.z = -10;
    this.activeObstacleOne.visible = true;
  }

  private spawnObstacleTwo() {
    this.activeObstacleTwo = this.getRandomPooledObstacle();
    this.activeObstacleTwo.position.z = this.activeObstacleOne.position.z - 5;
    this.activeObstacleTwo.visible = true;
  }

  private spawnCoins() {
    this.activeCoinsGroup = this.getRandomPooledCoin();
    this.activeCoinsGroup.position.z = -5;
    this.activeCoinsGroup.visible = true;
  }

  private moveCoins() {
    if ((this.activeCoinsGroup.visible = true)) {
      this.activeCoinsGroup.position.z += this.speed * this.delta;
      if (this.activeCoinsGroup.position.z > 1.5) {
        this.displayCoinsChildren(this.activeCoinsGroup);
        this.activeCoinsGroup.position.z = 0;
        this.activeCoinsGroup.visible = false;
        this.spawnCoins();
      }
    }
  }
  private detectCollisionWithCoins() {
    for (let i = 0; i < this.activeCoinsGroup.children.length; i += 1) {
      this.coinBox.setFromObject(this.activeCoinsGroup.children[i]);
      if (this.playerBoxCollider.intersectsBox(this.coinBox)) {
        if (!this.isGamePaused && !this.isGameOver) {
          this.activeCoinsGroup.children[i].position.z += 100;
          this.activeCoinsGroup.children[i].visible = false;
          this.coins += 1;
          // console.log( this.coins)
          (
            document.querySelector(".coins-count") as HTMLInputElement
          ).innerHTML = `${Math.round(this.coins)}`;
        }

        setTimeout(() => {
          this.activeCoinsGroup.children[i].position.z -= 100;
        }, 200);
      }
    }
  }

  private moveObstacleOne() {
    if ((this.activeObstacleOne.visible = true)) {
      this.activeObstacleOne.position.z += this.speed * this.delta;
      if (this.activeObstacleOne.position.z > 1.5) {
        this.activeObstacleOne.position.z = 0;
        this.activeObstacleOne.visible = false;
        this.spawnObstacleOne();
      }
    }
  }

  private moveObstacleTwo() {
    if ((this.activeObstacleTwo.visible = true)) {
      this.activeObstacleTwo.position.z += this.speed * this.delta;
      if (this.activeObstacleTwo.position.z > 1.5) {
        this.activeObstacleTwo.position.z = 0;
        this.activeObstacleTwo.visible = false;
        this.spawnObstacleTwo();
      }
    }
  }

  private detectCollisionWithObstacles() {
    for (let i = 0; i < this.activeObstacleOne.children.length; i += 1) {
      this.obstacleBox.setFromObject(this.activeObstacleOne.children[i]);
      if (this.playerBoxCollider.intersectsBox(this.obstacleBox)) {
        this.gameOver();
      }
    }
    for (let i = 0; i < this.activeObstacleTwo.children.length; i += 1) {
      this.obstacleBox2.setFromObject(this.activeObstacleTwo.children[i]);

      if (this.playerBoxCollider.intersectsBox(this.obstacleBox2)) {
        this.gameOver();
      }
    }
  }

  private displayCoinsChildren(parent: Object3D) {
    for (let i = 0; i < parent.children.length; i += 1) {
      if (!parent.children[i].visible) {
        parent.children[i].visible = true;
      }
    }
  }

  private gameOver() {
    console.log("game over");
    this.isGameOver = true;
    this.clock.stop();
    //  this.resetObstacle();

    this.isPlayerHeadStart = false;
    this.saveCoins();
    this.saveHighScore();
    if (this.isTornamentMode === "true") {
      setTimeout(() => {
        const result = sortAndGetPosition(userScores, username);
        const position = result.position + 1;
        const playersGameStatus = checkPlayersGameOverStatus();
        if (position === 1 && playersGameStatus === "Finished") {
          console.log({ playersGameStatus });
          return displayCongratulationModal();
        } else {
          (
            document.getElementById(
              "tournamentGameOverModal"
            ) as HTMLInputElement
          ).style.display = "flex";
        }
      }, 1000);
    } else {
      (
        document.getElementById("gameOverModal") as HTMLInputElement
      ).style.display = "flex";
    }
  }

  private restartGame() {
    (
      document.getElementById("gameOverModal") as HTMLInputElement
    ).style.display = "none";
    this.activeObstacleOne.position.z = -10;
    this.activeObstacleOne.visible = false;
    this.activeObstacleTwo.position.z = -15;
    this.activeObstacleTwo.visible = false;
    this.activeCoinsGroup.position.z = -10;
    this.clock.start();
    this.speed = 1;
    this.coins = 0;
    this.scores = 0;
    (document.querySelector(".coins-count") as HTMLInputElement).innerHTML =
      "0";

    this.isGameOver = false;
    this.isGamePaused = false;
    (
      document.querySelector(".pause-button") as HTMLInputElement
    ).style.display = "block";
    // this.player.position.x = 0;
    setTimeout(() => {
      /* this.spawnObstacleOne();
      this.spawnObstacleTwo();
      this.spawnCoins(); */
      this.isPlayerHeadStart = true;
    }, 4000);
    //  (document.querySelector('.disable-touch') as HTMLInputElement).style.display = 'none';
  }
  private async saveCoins() {
    const prevTotalCoins = localStorage.getItem("total-coins") || 0;
    const totalCoins = Number(prevTotalCoins) + this.coins;
    localStorage.setItem("total-coins", totalCoins.toString());
  }

  private async saveHighScore() {
    const highScore = localStorage.getItem("high-score") || 0;
    if (Number(this.scores) > Number(highScore)) {
      localStorage.setItem("high-score", this.scores.toString());
    }
  }

  initialize() {
    if (this.isTornamentMode === "true") {
      channel.attach((err) => {
        if (!err) {
          channel.subscribe(function (message) {
            displayScore(message, "scoreList");
          });
          const interval = setInterval(async () => {
            startBroadcastingScore(this.scores, this.isGameOver);
            if (this.isGameOver) {
              clearInterval(interval);
            }
          }, 200);
        } else {
          console.error("Error attaching to the channel: " + err.message);
        }
      });
    }

    mainCamera.rotation.x = -25 * (Math.PI / 180);
    mainCamera.position.set(0, 0.16, -0.4);

    setTimeout(() => {
      this.isPlayerHeadStart = true;
    }, 4000);

    if (!this.visible) {
      this.visible = true;
    }
    this.isGameOver = false;
    this.isGamePaused = false;
    this.clock.start();
    (
      document.querySelector(".race-info-section") as HTMLInputElement
    ).style.display = "block";
    (
      document.querySelector(".pause-button") as HTMLInputElement
    ).style.display = "block";

    this.allGameCars = JSON.parse(localStorage.getItem("allGameCars")!);
    this.activeCarIndex = this.allGameCars.findIndex(
      (car) => car.isActive === true
    );
    this.playerCar = this.carsContainer[this.activeCarIndex];

    this.playerCar.scale.set(0.023, 0.023, 0.023);
    this.playerCar.rotation.y = 180 * (Math.PI / 180);
    this.playerCar.position.set(-0.04, -0.065, -0.7);

    this.playerCar.visible = true;

    document.onkeydown = (e) => {
      if (!this.isGameOver) {
        if (e.key === "ArrowLeft") {
          this.moveLeft();
        }
        if (e.key === " ") {
          this.pauseAndResumeGame();
        }
        if (e.key === "ArrowRight") {
          this.moveRight();
        }
      }
    };
  }

  private pauseAndResumeGame() {
    if (!this.isGamePaused) {
      (
        document.getElementById("gamePausedModal") as HTMLInputElement
      ).style.display = "flex";
      this.clock.stop();
      this.isGamePaused = true;
    } else {
      this.clock.start();
      (
        document.getElementById("gamePausedModal") as HTMLInputElement
      ).style.display = "none";
      this.isGamePaused = false;
    }
    this.saveCoins();
    this.saveHighScore();
  }
  private moveLeft() {
    console.log(mainCamera.position.x);
    const tweenCameraLeft = new Tween(mainCamera.position)
      .to({ x: mainCamera.position.x - 0.06 }, 200)
      .easing(TWEEN.Easing.Quadratic.Out);
    if (this.playerCar.position.x !== -0.14) {
      this.playerCar.rotation.y = -165 * (Math.PI / 180);

      const resetRotation = new TWEEN.Tween(this.playerCar.rotation)
        .to({ y: this.playerCar.rotation.y - 15 * (Math.PI / 180) }, 100)
        .easing(TWEEN.Easing.Quadratic.Out);
      const tweenLeft = new TWEEN.Tween(this.playerCar.position)
        .to({ x: this.playerCar.position.x - 0.1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          if (this.playerCar.position.x < -0.14) {
            this.playerCar.position.x = -0.14;
          }

          if (mainCamera.position.x < -0.06) {
            mainCamera.position.x = -0.06;
          }
        })
        .onComplete(() => {
          resetRotation.start();
          this.playerCar.position.x = Number(
            this.playerCar.position.x.toFixed(2)
          );
        });
      tweenLeft.start();
      tweenCameraLeft.start();
    }
  }

  private moveRight() {
    console.log(mainCamera.position.x);
    const tweenCameraRight = new Tween(mainCamera.position)
      .to({ x: mainCamera.position.x + 0.06 }, 200)
      .easing(TWEEN.Easing.Quadratic.Out);
    if (this.playerCar.position.x !== 0.16) {
      this.playerCar.rotation.y = 165 * (Math.PI / 180);
      const resetRotation = new TWEEN.Tween(this.playerCar.rotation)
        .to({ y: this.playerCar.rotation.y + 15 * (Math.PI / 180) }, 100)
        .easing(TWEEN.Easing.Quadratic.Out);
      const tweenRight = new Tween(this.playerCar.position)
        .to({ x: this.playerCar.position.x + 0.1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          if (this.playerCar.position.x > 0.16) {
            this.playerCar.position.x = 0.16;
          }
          if (mainCamera.position.x > 0.12) {
            mainCamera.position.x = 0.12;
          }
        })
        .onComplete(() => {
          resetRotation.start();

          this.playerCar.position.x = Number(
            this.playerCar.position.x.toFixed(2)
          );
        });
      tweenRight.start();
      tweenCameraRight.start();
    }
  }

  update() {
    this.delta = this.clock.getDelta();
    TWEEN.update();
    if (!this.isGameOver && !this.isGamePaused) {
      this.scores += Math.round(this.speed * this.delta + 1);
      (document.querySelector(".scores-count") as HTMLInputElement).innerHTML =
        this.scores.toString();
    }

    this.playerBoxCollider.setFromObject(this.playerCar);
    this.mainRoad.position.z += this.speed * this.delta;
    this.mainRoadClone.position.z += this.speed * this.delta;
    this.skyBox.rotation.y += 0.006 * this.delta;

    this.buildingBlockA.position.z += this.speed * this.delta;
    this.buildingBlockB.position.z += this.speed * this.delta;
    this.buildingBlockC.position.z += this.speed * this.delta;
    this.buildingBlockD.position.z += this.speed * this.delta;

    /*     this.obstacleOne.position.z += this.speed * this.delta;
   console.log(this.obstacleOne.position.z)
    if (this.obstacleOne.position.z > 0.5) {
      this.obstacleOne.position.z = -5;
    } */

    if (this.buildingBlockB.position.z > 3.5) {
      this.buildingBlockB.position.z =
        this.buildingBlockA.position.z - this.buildingBlocKSize;
    }
    if (this.buildingBlockA.position.z > 3.5) {
      this.buildingBlockA.position.z =
        this.buildingBlockB.position.z - this.buildingBlocKSize;
    }
    if (this.buildingBlockC.position.z > 3.5) {
      this.buildingBlockC.position.z =
        this.buildingBlockD.position.z - this.buildingBlocKSize;
    }
    if (this.buildingBlockD.position.z > 3.5) {
      this.buildingBlockD.position.z =
        this.buildingBlockC.position.z - this.buildingBlocKSize;
    }

    //  console.log(this.mainRoad.position.z);

    if (this.mainRoad.position.z > 4.5) {
      this.mainRoad.position.z = this.mainRoadClone.position.z - this.roadSize;
      // console.log(this.mainRoad.position.z);
    }
    if (this.mainRoadClone.position.z > 4.5) {
      this.mainRoadClone.position.z = this.mainRoad.position.z - this.roadSize;
    }
    if (this.isPlayerHeadStart) {
      this.moveCoins();
      this.moveObstacleOne();
      this.moveObstacleTwo();
      this.detectCollisionWithObstacles();
      this.detectCollisionWithCoins();
    }
    if (!this.isGameOver && this.speed < 2.2 && !this.isGamePaused) {
      this.speed += 0.00002;
      //  console.log(this.speed)
    }
  }
  hide() {
    (
      document.querySelector(".pause-button") as HTMLInputElement
    ).style.display = "none";
    (
      document.querySelector(".race-info-section") as HTMLInputElement
    ).style.display = "none";
    this.visible = false;
    this.clock.stop();

    // this.resetCoins();

    this.scores = 0;
    (document.querySelector(".scores-count") as HTMLInputElement).innerHTML =
      this.scores.toString();

    this.coins = 0;
    (document.querySelector(".coins-count") as HTMLInputElement).innerHTML =
      this.coins.toString();

    this.saveCoins();
    this.saveHighScore();

    this.isGameOver = false;
    this.activeObstacleOne.position.z = -10;
    this.activeObstacleOne.visible = false;
    this.activeObstacleTwo.position.z = -15;
    this.activeObstacleTwo.visible = false;
    this.activeCoinsGroup.position.z = -10;
    this.isGamePaused = false;
    this.isPlayerHeadStart = false;
  }
}
