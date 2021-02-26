const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then((res) => {
    // turn the result into json data
    // console.log(res);
    return res.json();
  })
  .then((loadedQuestions) => {
    // console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });
      return formattedQuestion;
    });
    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
  // reset game variables
  questionCounter = 0;
  score = 0;
  // make a copy of the questions array via the spread operator
  availableQuestions = [...questions];

  // get the first question!
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  // Go to the end page if there are no questions left,
  // or if we've answered the amount of questions we assigned
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    // go to the end page
    return window.location.assign("/end.html");
  }
  // increase the questionCounter
  questionCounter++;

  // update progress text and bar
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  // select a random question from the availableQuestions array
  // and render it to the screen
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  // loop through the choices for the current question and render
  // them
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  // remove the question we just got from the array of available questions
  // so we don't get it again in the same quiz...
  availableQuestions.splice(questionIndex, 1);

  // set acceptingAsnwers to true now so player can choose an answer
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;

    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    console.log(typeof currentQuestion.answer);
    const correctAnswer = choices.filter(
      (choice) => choice.dataset["number"] == currentQuestion.answer
    );
    // const correctAsnwer = choices.forEach((choice) => {
    // choices.filter;
    // console.log(choice);
    // console.log(typeof +choice.dataset["number"]);
    // console.log(currentQuestion.answer);
    // return choice.dataset["number"] == currentQuestion.answer;
    // if (+choice.dataset["number"] === currentQuestion.answer) {
    // return choice;
    // } else {
    // return 99;
    // }
    // });
    console.log(correctAnswer);

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    } else {
      // reveal correct answer
      setTimeout(() => {
        correctAnswer[0].parentElement.classList.add("correct");
      }, 1000);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      correctAnswer[0].parentElement.classList.remove("correct");
      getNewQuestion();
    }, 3000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
