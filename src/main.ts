import { WebGLRenderer, PerspectiveCamera } from "three";

import RaceScene from "./scenes/Race";
import MainMenuScene from "./scenes/MainMenu";
import CarSelectionScene from "./scenes/CarSelectionScene";
import { channel, copyToClipboard, displayScore, subscribeToAChannel, userGameStatus, userScores, username } from "./utils/tournament";

const width = window.innerWidth;
const height = window.innerHeight;

let currentScene: MainMenuScene | RaceScene | CarSelectionScene;

const renderer = new WebGLRenderer({
  canvas: document.getElementById("app") as HTMLCanvasElement,
  antialias: true,
});

renderer.setSize(width, height);
export const mainCamera = new PerspectiveCamera(70, width / height, 0.1, 800);
mainCamera.rotation.x = -25 * (Math.PI / 180);
mainCamera.position.set(0, 0.17, -0.45);

function onWindowResize() {
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

const raceScene = new RaceScene('true');
const mainMenuScene = new MainMenuScene();
const carSelectionScene = new CarSelectionScene();
const raceSceneWithTournament = new RaceScene();

const switchToMainMenuScene = () => {
  currentScene.hide();
  currentScene = mainMenuScene;
  currentScene.initialize();
};

const switchToRaceScene = () => {
  currentScene.hide();
  currentScene = raceScene;
  currentScene.initialize();
};
const switchToRaceSceneWithTournament = () => {
  currentScene.hide();
  currentScene = raceSceneWithTournament;
  currentScene.initialize();
};
const switchToCarSelectionScene = () => {
  currentScene.hide();
currentScene = carSelectionScene;
  currentScene.initialize();
};
currentScene = mainMenuScene;

const render = () => {
  currentScene.update();
  renderer.render(currentScene, mainCamera);
  requestAnimationFrame(render);
};
(document.querySelector("#playGameButton") as HTMLElement).onclick =
  () => {
    switchToRaceSceneWithTournament();
  };

   (document.querySelector("#startTournamentButton") as HTMLElement).onclick =
    () => {
     
      (document.getElementById('competitionModal') as HTMLButtonElement).style.display = 'none';
       switchToRaceScene();
  }; 

const main = async () => {
 
 await carSelectionScene.load();
  await mainMenuScene.load();
 //  await raceScene.load();
  (document.querySelector(".loader-container") as HTMLElement).style.display =
    "none";
  currentScene.initialize();
  render();
};

main();



(document.querySelector("#quitGameButton") as HTMLElement).onclick =
  () => {
    (
      document.getElementById("gamePausedModal") as HTMLElement
    ).style.display = "none";
    
    switchToMainMenuScene();
  };

  (document.querySelector("#exitGameButton") as HTMLElement).onclick =
  () => {
    (
      document.getElementById("gameOverModal") as HTMLElement
    ).style.display = "none";
    switchToMainMenuScene();
  };

(document.querySelector("#closeGamePausedModal") as HTMLElement).onclick =
  () => {
    (
      document.getElementById("gamePausedModal") as HTMLElement
    ).style.display = "none";
  };

  (document.querySelector(".home-menu") as HTMLElement).onclick = () => {
    switchToMainMenuScene();
};
  

(document.querySelector("#aboutButton") as HTMLElement).onclick = () => {
  (
    document.getElementById("aboutModal") as HTMLElement
  ).style.display = "flex";
};

(document.querySelector("#closeAboutModal") as HTMLElement).onclick = () => {
  (
    document.getElementById("aboutModal") as HTMLElement
  ).style.display = "none";
};


(document.querySelector("#closeSpectatorModeModal") as HTMLElement).onclick =
  () => {
    (
      document.getElementById("spectatorModeModal") as HTMLElement
    ).style.display = "none";
    switchToMainMenuScene()
  }

  (document.querySelector("#closeCompetitionModal") as HTMLElement).onclick =
  () => {
    (
      document.getElementById("competitionModal") as HTMLElement
    ).style.display = "none";

    (
      document.getElementById("startTournamentButton") as HTMLElement
    ).style.display = "none";

    (
      document.getElementById("copyLinkButton") as HTMLElement
    ).style.display = "none";

    (
      document.getElementById("usernameSection") as HTMLElement
    ).style.display = "block";

    (
      document.getElementById("createCompetitionButton") as HTMLElement
    ).style.display = "block";

    
  };

  
  (document.querySelector("#competitionButton") as HTMLElement).onclick =
  () => {
    (document.getElementById('competitionModal') as HTMLButtonElement).style.display = 'flex';
  };

  (document.querySelector("#createCompetitionButton") as HTMLElement).onclick =
  () => {
    subscribeToAChannel()
  };
  (document.querySelector("#copyLinkButton") as HTMLElement).onclick =
  () => {
    copyToClipboard()
  };
  function removeURLParameter() {
    const urlObject = new URL(window.location.href);
    urlObject.searchParams.delete('space');
    const newURL = urlObject.toString();
    window.history.replaceState({}, document.title, newURL);
  }
  (document.querySelector("#joinTournamentButton") as HTMLElement).onclick =
    () => {
      const urlParams = new URLSearchParams(window.location.search);
      const spaceParam = urlParams?.get('space') || '';
      console.log(spaceParam);
      subscribeToAChannel(spaceParam);
      switchToRaceScene();
      removeURLParameter();
      (document.getElementById('tournamentInvitationModal') as HTMLButtonElement).style.display = 'none';
   
  };

  (document.querySelector("#marketButton") as HTMLElement).onclick =
  () => {
    switchToCarSelectionScene()
  };

  export function sortAndGetPosition(userScores: Record<string, number>, targetUser: string) {
    // Create an array of objects from the original userScores object
    const scoresArray = Object.entries(userScores).map(([user, score]) => ({ user, score }));

    // Sort the array by score in descending order
    scoresArray.sort((a, b) => b.score - a.score);

    // Find the position of the target user in the sorted array
    const position = scoresArray.findIndex(entry => entry.user === targetUser);

    // Return the sorted array and the position
    return { sortedScores: scoresArray, position };
}
  const competitionStatusElement = document.getElementById("competitionStatus");
  const playerPositionElement = document.getElementById("playerPosition");
let intervalId: string | number | NodeJS.Timeout | undefined;
export const checkPlayersGameOverStatus = () => {
  if (Object.keys(userGameStatus).length === 0) {
    return "Finished";
  }
  else {
    const allTrue = Object.values(userGameStatus).every(value => value === "true");
    if (allTrue) {
        return "Finished";
      
    } else {
        return "In Progress";
    }
}
  
}

  function checkStatus() {
    if (Object.keys(userGameStatus).length === 0) {
        competitionStatusElement!.textContent = "Finished";
      clearInterval(intervalId);
      
    } else {
        const allTrue = Object.values(userGameStatus).every(value => value === "true");
        if (allTrue) {
            competitionStatusElement!.textContent = "Finished";
          clearInterval(intervalId);
          const result = sortAndGetPosition(userScores, username);
          console.log({ userScores })
          const position = result.position + 1;
          playerPositionElement!.textContent = String(position)
          if (position === 1 ) {
            (document.getElementById('spectatorModeModal') as HTMLButtonElement).style.display = 'none';
             return displayCongratulationModal();
          }

          console.log({position});
          
        } else {
            competitionStatusElement!.textContent = "In Progress";
        }
    }
  }
const switchToSpectactorMode = () => {
  
  (document.getElementById('tournamentGameOverModal') as HTMLButtonElement).style.display = 'none';
  (document.getElementById('spectatorModeModal') as HTMLButtonElement).style.display = 'flex';


  channel.attach((err) => {
    if (!err) {
      channel.subscribe(function (message) {
        displayScore(message, 'spectatorModeLiveScores');
      });
      (
        document.querySelector("#liveScoreBoard") as HTMLElement
      ).style.display = "block";
      checkStatus();
      

// Start checking the status every 1 second 
 intervalId = setInterval(checkStatus, 1000);
    } else {
      console.error("Error attaching to the channel: " + err.message);
    }
  });
}
(document.querySelector("#spectatorModeButton") as HTMLElement).onclick =
() => {
  switchToSpectactorMode()
}; 


export function displayCongratulationModal() {
    (document.getElementById('congratulatonsModeModal') as HTMLButtonElement).style.display = 'flex';
    (document.querySelector(".confetti") as HTMLElement).style.display = 'flex';
}


export function closeCongratulationModal() {
  (document.getElementById('congratulatonsModeModal') as HTMLButtonElement).style.display = 'none';
  (document.querySelector(".confetti") as HTMLElement).style.display = 'none';
  switchToMainMenuScene();
  
}

(document.querySelector("#closeCongratulatonsModeModal") as HTMLElement).onclick =
() => {
  closeCongratulationModal();
  (
    document.querySelector("#liveScoreBoard") as HTMLElement
  ).style.display = "none";
}; 

