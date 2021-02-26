const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finaScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
finaScore.innerText = mostRecentScore;

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
  console.log(username.value);
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
  // prevent form default
  e.preventDefault();

  // create object 'score' and set name and score within it
  const score = {
    score: Math.floor(Math.random() * 100),
    // score: mostRecentScore,
    name: username.value,
  };
  // push the new 'score' onto the 'highScores' array
  highScores.push(score);
  // sor the array by score from highest to lowest
  highScores.sort((a, b) => b.score - a.score);
  // save only the top 5 scores by splicing up to the max high scores
  highScores.splice(MAX_HIGH_SCORES);

  // save the highScore to local Storage
  localStorage.setItem("highScores", JSON.stringify(highScores));

  // go back to the home page
  window.location.assign("/");
};
