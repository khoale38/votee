import fetch from "node-fetch";
import fs from "fs";

let apiUrl = "https://wordle.votee.dev:8000/";

var la = fs.readFileSync("./wordle-La.txt").toString().split("\n");
var ta = fs.readFileSync("./wordle-Ta.txt").toString().split("\n");

let possibleWord = [...la, ...ta];

async function makeGuess(guess) {
  try {
    let response = await fetch(apiUrl + "daily?guess=" + guess);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function filterWord(feedback) {
  possibleWord = possibleWord.filter((word) => {
  return feedback.every(({ slot, guess, result }) => {
      if (result == "correct") {
        return word[slot] == guess;
      } else if (result == "absent") {
        return !word.includes(guess);
      } else if (result == "present") {
        return word[slot] !== guess && word.includes(guess);
      }
    })
  });


}

async function main() {
  let guessCount = 5;
  let isCorrect = false;
  while (guessCount > 0 && !isCorrect) {
    let guess =possibleWord[0]
    let rs = await makeGuess(guess);
    console.log(rs)
    if (rs.every((word) => word.result == "correct")) {
      console.log(`The word is: ${guess}`);
      isCorrect = true;
    } else {
      filterWord(rs);

    }
    guessCount--;
  }
}

main();
