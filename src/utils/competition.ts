import Ably from 'ably';

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

let apiKey = "xxxXXxxxXXxxxXXxxxXXXXXXXXXXXXXXXXXXXxxxxxxxxxxxxxxxxxxxxxxxxx";
let username;


let joinLink = "";

let ably = new Ably.Realtime({ key: apiKey });

    
let channel
 ably.connection.on('failed', function () {
    console.log('# failed connection')
 });
  
const userScores = {};

// Function to display Scores in the channel
function displayMessage(message) {
  const scoreListElement = document.getElementById("scoreList");

  const messageItem = document.createElement("p");
  messageItem.textContent = String(message.data);
  scoreListElement!.appendChild(messageItem);

  // Parse the message to get the score and username
  const [score, username] = message.data.split("-");

  // Update the userScores object with the new score
  userScores[username] = parseInt(score);

  // Update the UI to display all user scores
  updateScoreList();
}

function updateScoreList() {
    const scoreListElement = document.getElementById("scoreList");
    scoreListElement.innerHTML = "";

    for (const userId in userScores) {
      const messageItem = document.createElement("p");
      messageItem.textContent = `${userId}: ${userScores[userId]}`;
      scoreListElement.appendChild(messageItem);
    }
}
function copyToClipboard(url: string) {
    const textArea = document.createElement("textarea");
    textArea.value = url;
  
    document.body.appendChild(textArea);
  
    textArea.select();
  
    try {
      navigator.clipboard
        .writeText(url)
        .then(function () {
          console.log("URL copied to clipboard: " + url);
        })
        .catch(function (err) {
          console.error("Unable to copy text to clipboard: " + err);
        });
    } catch (err) {
      console.error("Unable to copy text to clipboard: " + err);
    }
  
    document.body.removeChild(textArea);
  }

  
const subscribeToAChannel = () => {
    const inputField = document.getElementById("username");
    const username = inputField?.value.trim();
    if (username === "") {
        alert("Username is empty.");
        return
    }
    if (username.includes(" ")) {
        alert("username must not contain a space.");
        return
    }
    ably.connection.on('connected', function () {
        console.log('# successful connection')
    });
        (document.getElementById('usernameSection') as HTMLInputElement).style.display = 'none';
        (document.getElementById('createCompetitionButton') as HTMLInputElement).style.display = 'block';
        console.log('# successful connection')
        const channelName: string = uniqueNamesGenerator(customConfig);
    channel = ably.channels.get(channelName);
    const hostJoinLink = window.location.href.split("?")[0] + `?space=${channelName}`;
        joinLink =
    window.location.href.split("?")[0] + `?space=${channelName}`+ `?host=${username}`;
        console.log(`Join Link: ${joinLink}`);
        (document.getElementById('createCompetitionButton') as HTMLInputElement).style.display = 'none';
        const copyLinkButton = document.querySelector(
            "#copyLinkButton"
          ) as HTMLButtonElement;
    copyLinkButton.style.display = "block";
    (document.getElementById('startGameButton') as HTMLInputElement).style.display = 'block';
    
}


document
  .getElementById("competitionButton")
  .addEventListener("click", function () {
    alert("ddddddddd");
  });

document
  .getElementById("createCompetitionButton")
    .addEventListener("click", function () {
        subscribeToAChannel()
  });
  
  document
  .getElementById("copyLinkButton")
    .addEventListener("click", function () {
        copyToClipboard(joinLink)
    });
  
    
document
.getElementById("closeCompetitionModal")
  .addEventListener("click", function () {
  alert('www')
  //(document.getElementById('competitionModal') as HTMLButtonElement).style.display = 'none';
});
