import Ably from "ably";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  Config,
} from "unique-names-generator";

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: "-",
  length: 3,
};


export let username: string = "";


let channelName: string = uniqueNamesGenerator(customConfig);
let joinLink = "";


let ably: Ably.Realtime
export let channel: Ably.Types.RealtimeChannelCallbacks
const fetchToken = async () => {
  const response = await fetch('https://just-drive-api.onrender.com/token');
  const result = await response.json();
  console.log({ result })
  return result
}
async function initializeAbly() {
  await fetchToken()
  ably = new Ably.Realtime({ authUrl: 'https://just-drive-api.onrender.com/token' });

  console.log('initializing ably....')
  ably.connection.on('connected', function () {
    console.log('# Successful connection');
  });
  
  ably.connection.on('failed', function () {
    console.log('# Failed connection');
  });
  console.log(ably)
}

initializeAbly();
export const userScores:any = {};
export const userGameStatus:any = {};

// Function to display Scores in the channel
export function displayScore(message: Ably.Types.Message, elementID:string) {
  const scoreListElement = document.getElementById(elementID);

  const messageItem = document.createElement("p");
  messageItem.textContent = String(message.data);
  scoreListElement!.appendChild(messageItem);

  // Parse the message to get the score and username
  const [score, username, isGameOver] = message.data.split("-");

  // Update the userScores object with the new score
  userScores[username] = parseInt(score);
  userGameStatus[username]  = isGameOver

  
  // Update the UI to display all user scores
  updateScoreList(elementID);
}

function updateScoreList(elementID:string) {
  const scoreListElement = document.getElementById(elementID);
  scoreListElement!.innerHTML = "";

  // Create an array of objects with user ID and score
  const userScoreArray = [];
  for (const userId in userScores) {
    userScoreArray.push({ userId, score: userScores[userId] });
  }

  // Sort the array in ascending order based on the scores
  userScoreArray.sort((a, b) => b.score - a.score);

  // Iterate over the sorted array and update the score list
  userScoreArray.forEach((userScore) => {
    const messageItem = document.createElement("p");
    if (userScore.userId === username) {
      // Check if the userId is equal to the specified username
      messageItem.textContent = `You: ${userScore.score}`; // If true, return 'You'
    } else {
      messageItem.textContent = `${userScore.userId}: ${userScore.score}`; // Otherwise, return the actual value
    }
    scoreListElement!.appendChild(messageItem);
  });
}

export function copyToClipboard() {
  const textArea = document.createElement("textarea");
  textArea.value = joinLink;
  document.body.appendChild(textArea);

  textArea.select();

  try {
    navigator.clipboard
      .writeText(joinLink)
      .then(function () {
        console.log("URL copied to clipboard: " + joinLink);
      })
      .catch(function (err) {
        console.error("Unable to copy text to clipboard: " + err);
      });
  } catch (err) {
    console.error("Unable to copy text to clipboard: " + err);
  }

  document.body.removeChild(textArea);
}
function isAlphanumeric(inputField:any) {
  const inputValue = inputField.value;
  const alphanumericPattern = /^[a-zA-Z0-9]+$/;

  if (!alphanumericPattern.test(inputValue) || inputValue.includes(" ")||!inputValue) {
    alert("Error: Only alphanumeric characters (no spaces) are allowed.");
    inputField.value = ""; 
  }
}

export const subscribeToAChannel = (joinChannelName?: string | undefined) => {
 
    initializeAbly();
  
  const hostInputField = document.getElementById("hostUsername")  as HTMLInputElement;
  const visitorInputField = document.getElementById("visitorUsername") as HTMLInputElement;

  hostInputField?.addEventListener("blur", function () {
    isAlphanumeric(hostInputField);
  });
  
  visitorInputField?.addEventListener("blur", function () {
    isAlphanumeric(visitorInputField);
  });
  
  username = hostInputField?.value || visitorInputField?.value;
  console.log({ username });

  (
    document.getElementById("usernameSection") as HTMLElement
  ).style.display = "none";
  (
    document.getElementById("createCompetitionButton") as HTMLElement
  ).style.display = "block";


  channel = ably.channels.get(joinChannelName ? joinChannelName : channelName);
  console.log({channel})
  joinLink = window.location.href.split("?")[0] + `?space=${channelName}`;
  console.log(`Join Link: ${joinLink}`);
  (
    document.getElementById("createCompetitionButton") as HTMLElement
  ).style.display = "none";
  const copyLinkButton = document.querySelector(
    "#copyLinkButton"
  ) as HTMLButtonElement;
  copyLinkButton.style.display = "block";
  (
    document.getElementById("startTournamentButton") as HTMLElement
  ).style.display = "block";
};

export function startBroadcastingScore(scores: number, isGameOver:boolean) {
  if (channel) {
    channel.publish({
      name: username,
      data: String(scores + "-" + username + "-" + isGameOver),
    });
    console.log(channel.name);
    console.log(String(scores + "-" + username + "-" + isGameOver));
  }
}

