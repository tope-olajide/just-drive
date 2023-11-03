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

let apiKey = "xxxxxx";
let username:string="";

let channelName: string =uniqueNamesGenerator(customConfig) 
let joinLink = "";

let ably = new Ably.Realtime({ key: apiKey });

    
export let channel: Ably.Types.RealtimeChannelCallbacks
 ably.connection.on('failed', function () {
    console.log('# failed connection')
 });
  
const userScores = {};

// Function to display Scores in the channel
export function displayMessage(message) {
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

  
export const subscribeToAChannel = (joinChannelName?: string | undefined) => {


    const hostInputField = document.getElementById("hostUsername") 
    const visitorInputField = document.getElementById("visitorUsername") 
    /*  const playerName = inputField?.value.trim();
    if (playerName === "") {
        alert("Username is empty.");
        return
    }
    if (playerName.includes(" ")) {
        alert("username must not contain a space.");
        return
  } */
  username = hostInputField?.value || visitorInputField?.value
    console.log({username})
    ably.connection.on('connected', function () {
        console.log('# successful connection')
    });
        (document.getElementById('usernameSection') as HTMLInputElement).style.display = 'none';
        (document.getElementById('createCompetitionButton') as HTMLInputElement).style.display = 'block';
        console.log('# successful connection')
  
  channel = ably.channels.get(joinChannelName ? joinChannelName : channelName);
        joinLink =
    window.location.href.split("?")[0] + `?space=${channelName}`;
        console.log(`Join Link: ${joinLink}`);
        (document.getElementById('createCompetitionButton') as HTMLInputElement).style.display = 'none';
        const copyLinkButton = document.querySelector(
            "#copyLinkButton"
          ) as HTMLButtonElement;
    copyLinkButton.style.display = "block";
    (document.getElementById('startTournamentButton') as HTMLInputElement).style.display = 'block';
    
}




export function startBroadcastingScore(scores:number) {

    if (channel) {
      channel.publish({
        name: username,
        data: String(scores + "-" + username),
      }); // Publish the score to the channel
      console.log(channel.name)
      console.log(String(scores + "-" + username));
    }

}
