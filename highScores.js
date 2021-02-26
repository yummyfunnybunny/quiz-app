const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores
  .map((score) => {
    return `<li class="high-score">
              <div class="high-score--name">${score.name}</div>
              <div class="high-score--score">${score.score}</div>
            </li>
            `;
  })
  .join("");
