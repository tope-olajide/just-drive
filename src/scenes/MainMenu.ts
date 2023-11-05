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
  import { loadCar } from "../utils/raceCarLoader";
  import { loadObstacleOne, loadRoadObstacle } from "../utils/obstaclesLoader";
  
export default class MainMenuScene extends Scene {
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
  
    private pooledBuildingBlocks = <Array<Object3D>>[];
    private amountToPool = 4;
    private bus = new Object3D();
    private taxi = new Object3D();
    private limo = new Object3D();
  
    private obstacleOne = new Group();
  
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

     
  
        this.obstacleOne = loadObstacleOne(this.bus, this.taxi);
        mainCamera.rotation.set(0,0,0);
  
        const light = new DirectionalLight(0xffffff, 3);
        light.position.set(0, 2, 1);
        this.add(light);
        const ambient = new AmbientLight("#3F4A59", 3);
        this.add(ambient);
    }

    initialize() {
        if (!this.visible) {
            this.visible = true;
        }
        const urlParams = new URLSearchParams(window.location.search);
        const spaceParam = urlParams.get('space');
        if (spaceParam) {
            (document.querySelector('#tournamentInvitationModal') as HTMLInputElement).style.display = 'flex';
         }
        (document.querySelector('.menu-buttons-container') as HTMLInputElement).style.display = 'flex';
        (document.querySelector('.info-section') as HTMLInputElement).style.display = 'block';


        (document.querySelector('.high-score') as HTMLInputElement).innerHTML = JSON.parse(localStorage.getItem('high-score')!);
        (document.querySelector('.total-coins') as HTMLInputElement).innerHTML = JSON.parse(localStorage.getItem('total-coins')!);

        
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
        console.log(this.mainRoadClone.position.z);
  
        this.add(this.mainRoadClone);
  
        this.playerBox.scale.set(0.01, 0.01, 0.02);
        this.playerBox.position.set(-0.015, -0.047, -0.18);
        //  this.add(this.playerBox);
  
        this.ferrari.scale.set(0.012, 0.012, 0.012);
        //this.ferrari.rotation.y = 180 * (Math.PI / 180);
        this.ferrari.position.set(0, -0.065, -0.8);
  
        this.add(this.ferrari);
        /*     this.bus.rotation.y = 180 * (Math.PI / 180);
            this.bus.position.set(-0.04, -0.065, -2.58);
            this.add(this.bus); */
        this.add(this.obstacleOne);
        document.onkeydown = (e) => {
            if (e.key === "ArrowLeft") {
                this.moveLeft();
            }
           
            if (e.key === "ArrowRight") {
                this.moveRight();
            }
            
        };
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
      
    }

    hide() {
        this.visible = false;
        (document.querySelector('.menu-buttons-container') as HTMLInputElement).style.display = 'none';
        (document.querySelector('.info-section') as HTMLInputElement).style.display = 'none';

        
    }
}
  