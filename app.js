let allQuestions = [];
let filteredQuestions = [];
let currentQuestionIndex = 0;

const topicSelect = document.getElementById("topicSelect");
const startBtn = document.getElementById("startBtn");
const quizDiv = document.getElementById("quiz");
const questionText = document.getElementById("questionText");
const optionsList = document.getElementById("optionsList");
const feedbackDiv = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");

// Load questions from JSON
fetch("data/questions.json")
  .then(response => response.json())
  .then(data => {
    allQuestions = data;
    populateTopics();
  })
  .catch(error => {
    console.error("Error loading questions:", error);
  });

// Populate topic dropdown
function populateTopics() {
  const topics = [...new Set(allQuestions.map(q => q.topic))];

  topics.forEach(topic => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    topicSelect.appendChild(option);
  });
}

// Start quiz
startBtn.addEventListener("click", () => {
  const selectedTopic = topicSelect.value;

  if (!selectedTopic) {
    alert("Please select a topic.");
    return;
  }

  filteredQuestions = allQuestions.filter(
    q => q.topic === selectedTopic
  );

  currentQuestionIndex = 0;
  quizDiv.classList.remove("hidden");
  startBtn.disabled = true;
  topicSelect.disabled = true;

  showQuestion();
});

// Display a question
function showQuestion() {
  feedbackDiv.textContent = "";
  nextBtn.classList.add("hidden");
  optionsList.innerHTML = "";

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;

  currentQuestion.options.forEach((optionText, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");

    btn.textContent = optionText;
    btn.classList.add("option-test)
    btn.addEventListener("click", () =>
      checkAnswer(index, currentQuestion)
    );

    li.appendChild(btn);
    optionsList.appendChild(li);
  });
}

// Check answer
function checkAnswer(selectedIndex, question) {
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach(btn => (btn.disabled = true));

  if (selectedIndex === question.answerIndex) {
    buttons[selectedIndex].classList.add("correct");
    feedbackDiv.textContent = "Correct! " + question.explanation;
  } else {
    buttons[selectedIndex].classList.add("incorrect");
    buttons[question.answerIndex].classList.add("correct");
    feedbackDiv.textContent =
      "Incorrect. " + question.explanation;
  }

  nextBtn.classList.remove("hidden");
}

// Next question
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < filteredQuestions.length) {
    showQuestion();
  } else {
    questionText.textContent = "Quiz completed!";
    optionsList.innerHTML = "";
    feedbackDiv.textContent = "Well done 🎉";
    nextBtn.classList.add("hidden");
  }
});
