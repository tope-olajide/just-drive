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
  
  import { mainCamera } from "../main";
  import TWEEN, { Tween } from "@tweenjs/tween.js";
  
  import { mainRoad } from "../utils/mainRoad";
  import { citySkyBox } from "../utils/skybox";
  import { loadBlock } from "../utils/buildingBlockLoader";
  import { loadCar } from "../utils/raceCarLoader";
  import { loadCoin, loadGroupACoins, loadObstacleOne, loadRoadObstacle } from "../utils/obstaclesLoader";
import { channel, startBroadcastingScore, displayMessage } from "../utils/competition";
  
export default class TournamentScene extends Scene {
      
    
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
    private ferrari = new Object3D();
    private playerBox = new Mesh(
      new BoxGeometry(),
      new MeshPhongMaterial({ color: 0x0000ff })
    );
  
    private pooledObstacles = <Array<Object3D>>[];
    private pooledCoins = <Array<Object3D>>[];
    private amountToPool = 4;
    private bus = new Object3D();
    private taxi = new Object3D();
  private coin = new Object3D();
    private obstacleOne = new Group();
    private groupACoins = new Group();
    private isGamePaused = false;
    private playerBoxCollider = new Box3(new Vector3(), new Vector3());
    private obstacleBox = new Box3(new Vector3(), new Vector3());
    private coinBox = new Box3(new Vector3(), new Vector3());
  
    private scores = 0;
  
    private coins = 0;
  
    async load() {
      this.mainRoad = await mainRoad();
      this.skyBox = await citySkyBox();
  
      this.skyBox.position.set(0, 0, 0);
      this.add(this.skyBox);
      this.buildingBlockA = await loadBlock("BuildingBlockA");
      this.buildingBlockB = await loadBlock("BuildingBlockB");
      this.buildingBlockC = await loadBlock("BuildingBlockC");
      this.buildingBlockD = await loadBlock("BuildingBlockD");
      this.ferrari = await loadCar("Ferrari");
      this.bus = await loadRoadObstacle("Bus");
      this.bus.scale.set(0.00015, 0.00015, 0.00015);
  
      this.taxi = await loadRoadObstacle("Taxi");
      this.taxi.scale.set(0.00017, 0.00017, 0.00017);
  
      this.coin = await loadCoin()
      this.coin.scale.set(0.00016, 0.00016, 0.00016)
      this.coin.rotation.set(90 * (Math.PI / 180), 0, 150 * (Math.PI / 180));
  
      this.obstacleOne = loadObstacleOne(this.bus, this.taxi);
      this.groupACoins = loadGroupACoins(this.coin);
  
      (document.querySelector('.pause-button') as HTMLInputElement).onclick = () => {
        this.pauseAndResumeGame();
      };
      (document.querySelector('#closeGamePausedModal') as HTMLInputElement).onclick = () => {
        this.pauseAndResumeGame();
      };
      (document.getElementById('resumeGameButton') as HTMLInputElement).onclick = () => {
        this.pauseAndResumeGame();
      };
    }
  
  
    private poolObstacles() {
      for (let i = 0; i < this.amountToPool; i++) { 
        const obstacleOne = this.obstacleOne.clone();
        obstacleOne.visible = false;
        this.add(obstacleOne)
        this.pooledObstacles.push(obstacleOne);
      }
    }
    private poolCoins() {
      for (let i = 0; i < this.amountToPool; i++) { 
        const coinGroupA = this.groupACoins.clone();
        coinGroupA.visible = false;
        this.add(coinGroupA)
        this.pooledCoins.push(coinGroupA);
      }
    }
    private getRandomPooledObstacle() {
      const availableItems = this.pooledObstacles.filter(item => !item.visible);
      if (availableItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        return availableItems[randomIndex];
      }
      return null;
    }
    private getRandomPooledCoin() {
      const availableItems = this.pooledCoins.filter(item => !item.visible);
      if (availableItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        return availableItems[randomIndex];
      }
      return null;
    }
  
    private spawnObstacle() {
      const obstacle = this.getRandomPooledObstacle()
      if (obstacle) {
        obstacle.position.z = -10
        obstacle.visible = true
      }
    }
  
    private spawnCoins() {
      const coins = this.getRandomPooledCoin()
      if (coins) {
        coins.position.z = -5
        coins.visible = true
      }
    }
  
    private moveObstacle() {
        for (let i = 0; i < this.pooledObstacles.length; i++) {
          if (this.pooledObstacles[i].visible) {
            
            this.pooledObstacles[i].position.z += this.speed * this.delta;
            this.detectCollisionWithObstacles(this.pooledObstacles[i])
            if (this.pooledObstacles[i].position.z > 0.5) {
              this.pooledObstacles[i].visible = false;
              this.pooledObstacles[i].position.set(0, 0, 0); 
            }
            if (this.pooledObstacles[i].position.z > -5) {
              this.spawnObstacle()
            }
          //  console.log(this.pooledObstacles[i].position.z)
          }
        }
    }
  
    private detectCollisionWithObstacles(activeObstacle: Object3D) {
      
      for (let i = 0; i < activeObstacle.children.length; i += 1) {
        this.obstacleBox.setFromObject(activeObstacle.children[i]);
        if (this.playerBoxCollider.intersectsBox(this.obstacleBox)) {
          this.gameOver();
        }
      }
  
    }
     private detectCollisionWithCoins(activeCoinsGroup: Object3D) {
      for (let i = 0; i < activeCoinsGroup.children.length; i += 1) {
        this.coinBox.setFromObject(activeCoinsGroup.children[i]);
        if (this.playerBoxCollider.intersectsBox(this.coinBox)) {
          activeCoinsGroup.children[i].position.z += 100;
          activeCoinsGroup.children[i].visible = false;
          
          if (!this.isGamePaused /* && !this.isGameOver */) {
            
            this.coins += 0.25;
            console.log( this.coins)
          }
          (document.querySelector('.coins-count') as HTMLInputElement).innerHTML = `${Math.round(this.coins)}`;
          setTimeout(() => {
            activeCoinsGroup.children[i].position.z -= 100;
            
          }, 100);
        }
      }
    } 
    private displayCoinsChildren(parent:Object3D) {
      for (let i = 0; i < parent.children.length; i += 1) {
        if (!parent.children[i].visible) {
          parent.children[i].visible = true;
        }
      } 
    }
  
    private moveCoins() {
      for (let i = 0; i < this.pooledCoins.length; i++) {
        if (this.pooledCoins[i].visible) {
          this.pooledCoins[i].position.z += this.speed * this.delta;
          this.detectCollisionWithCoins(this.pooledCoins[i])
          if (this.pooledCoins[i].position.z > 0.5) {
  
            this.pooledCoins[i].visible = false;
            this.displayCoinsChildren(this.pooledCoins[i])
            this.pooledCoins[i].position.set(0, 0, 0); 
          }
          if (this.pooledCoins[i].position.z > -5) {
            
            this.spawnCoins()
          }
          
        }
      }
    }
    
    private gameOver() {
      console.log('game over')
  /*     this.clock.stop();
      (document.getElementById('gameOverModal') as HTMLInputElement).style.display = 'flex'; */
    }
  
    initialize() {
        setInterval(async () => {
            channel.attach(function (err) {
            if (!err) {
              channel.subscribe(function (message) {
                displayMessage(message);
              });
            } else {
              console.error("Error attaching to the channel: " + err.message);
            }
        });
        
        startBroadcastingScore(this.scores)
          }, 100);

      const ambient = new AmbientLight("#3F4A59", 3);
      this.add(ambient);
      this.poolObstacles()
      this.poolCoins()
      
  
      this.spawnObstacle()
      this.spawnCoins()
      const light = new DirectionalLight(0xffffff, 3);
      light.position.set(0, 2, 1);
      this.add(light);
      if (!this.visible) {
        this.visible = true;
      }
      this.clock.start();
      (document.querySelector('.race-info-section') as HTMLInputElement).style.display = 'block';
      (document.querySelector('.pause-button') as HTMLInputElement).style.display = 'block';
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
      //this.mainRoadClone.position.set(0, -0.1, -10);
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
  
      this.playerBox.scale.set(0.01, 0.01, 0.02);
      this.playerBox.position.set(-0.015, -0.047, -0.18);
      //  this.add(this.playerBox);
  
      this.ferrari.scale.set(0.0075, 0.0075, 0.0075);
      this.ferrari.rotation.y = 180 * (Math.PI / 180);
      this.ferrari.position.set(-0.04, -0.065, -0.48);
  
      this.add(this.ferrari);
  /*     this.bus.rotation.y = 180 * (Math.PI / 180);
      this.bus.position.set(-0.04, -0.065, -2.58);
      this.add(this.bus); */
     // this.add(this.obstacleOne);
      document.onkeydown = (e) => {
        if (e.key === "ArrowLeft") {
          this.moveLeft();
        }
        if (e.key === " ") {
          console.log(this.playerBox.position);
        }
        if (e.key === "ArrowRight") {
          this.moveRight();
        }
        if (e.key === "a") {
          this.moveCameraLeft();
        }
        if (e.key === "d") {
          this.moveCameraRight();
        }
        if (e.key === "e") {
          this.moveCameraUp();
          //this.playerBox.position.y += 0.008;
        }
        if (e.key === "x") {
          this.moveCameraDown();
          // this.playerBox.position.y -= 0.008;
        }
        if (e.key === "ArrowUp") {
          this.moveCameraForward();
          // this.playerBox.position.z -= 0.008;
        }
        if (e.key === "ArrowDown") {
          this.moveCameraBackward();
          // this.playerBox.position.z += 0.008;
        }
      };
    }
    private moveCameraLeft = () => {
      mainCamera.position.x -= 0.08;
    };
    private moveCameraRight = () => {
      mainCamera.position.x += 0.08;
    };
    private moveCameraUp = () => {
      mainCamera.position.y += 0.08;
      //this.playerBox.position.y += 0.008;
    };
    private moveCameraDown = () => {
      mainCamera.position.y -= 0.08;
    };
    private moveCameraForward = () => {
      mainCamera.position.z -= 0.08;
      // this.mainRoad.position.z += 1;
      //console.log(this.mainRoad.position.z);
      // this.playerBox.position.z += 0.008;
    };
    private moveCameraBackward = () => {
      mainCamera.position.z += 0.08;
      //this.playerBox.position.z -= 0.008;
    };
    private pauseAndResumeGame() {
      if (!this.isGamePaused) {
        this.clock.stop();
        (document.getElementById('gamePausedModal') as HTMLInputElement).style.display = 'flex';
        this.isGamePaused = true;
      } else {
        this.clock.start();
        (document.getElementById('gamePausedModal') as HTMLInputElement).style.display = 'none';
        this.isGamePaused = false;
      }
    }
    private moveLeft() {
      //    if (this.ferrari.position.x !== -0.051) {
      console.log(this.ferrari.position.x);
      this.ferrari.rotation.y = -170 * (Math.PI / 180);
  
      const resetRotation = new TWEEN.Tween(this.ferrari.rotation)
        .to({ y: this.ferrari.rotation.y - 10 * (Math.PI / 180) }, 100)
        .easing(TWEEN.Easing.Quadratic.Out);
      const tweenLeft = new TWEEN.Tween(this.ferrari.position)
        .to({ x: this.ferrari.position.x - 0.1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          // this.ferrari.rotation.y = -160 * (Math.PI / 180);
          /* if (this.ferrari.position.x <= -0.051) {
              this.ferrari.position.x = -0.051;
            } */
        })
        .onComplete(() => {
          resetRotation.start();
        });
      tweenLeft.start();
      const tweenCameraLeft = new Tween(mainCamera.position)
        .to({ x: mainCamera.position.x - 0.04 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out);
      tweenCameraLeft.start();
      console.log(this.ferrari.position.x);
      //   }
    }
  
    private moveRight() {
      //    if (this.ferrari.position.x !== 0.056999999999999995) {
      this.ferrari.rotation.y = 170 * (Math.PI / 180);
      const resetRotation = new TWEEN.Tween(this.ferrari.rotation)
        .to({ y: this.ferrari.rotation.y + 10 * (Math.PI / 180) }, 100)
        .easing(TWEEN.Easing.Quadratic.Out);
      const tweenRight = new Tween(this.ferrari.position)
        .to({ x: this.ferrari.position.x + 0.1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        /* .onUpdate(() => {
            if (this.ferrari.position.x >= 0.056999999999999995) {
              this.ferrari.position.x = 0.056999999999999995;
            }
          }) */
        .onComplete(() => {
          resetRotation.start();
        });
      tweenRight.start();
  
      const tweenCameraRight = new Tween(mainCamera.position)
        .to({ x: mainCamera.position.x + 0.04 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out);
      tweenCameraRight.start();
      console.log(this.ferrari.position.x);
      //   }
    }
    update() {
      this.delta = this.clock.getDelta();
      TWEEN.update();
  
      this.scores += Math.round(this.speed * this.delta +1);
      (document.querySelector('.scores-count') as HTMLInputElement).innerHTML = this.scores.toString();
      
  
      this.playerBoxCollider.setFromObject(this.ferrari);
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
  
      if (this.mainRoad.position.z > 4.1) {
        this.mainRoad.position.z = this.mainRoadClone.position.z - this.roadSize;
        // console.log(this.mainRoad.position.z);
      }
      if (this.mainRoadClone.position.z > 4.1) {
        this.mainRoadClone.position.z = this.mainRoad.position.z - this.roadSize;
      }
      this.moveObstacle()
        this.moveCoins()
        
        

       
    }
    hide() {
      
      (document.querySelector('.pause-button') as HTMLInputElement).style.display = 'none';
      (document.querySelector('.race-info-section') as HTMLInputElement).style.display = 'none';
      this.visible = false;
      this.clock.stop()
  
     }
  }
  