document.addEventListener("DOMContentLoaded", () => {
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const selectedQuizId = parseInt(localStorage.getItem("selectedQuizId"));
  
    if (!selectedQuizId) {
      alert("No quiz selected. Redirecting to home page.");
      window.location.href = "home.html";
      return;
    }
  
    const selectedQuiz = quizzes.find((quiz) => quiz.id === selectedQuizId);
  
    if (!selectedQuiz) {
      alert("Quiz not found. Redirecting to home page.");
      window.location.href = "home.html";
      return;
    }
  
    // Render quiz title and duration
    document.getElementById("quiz-title").textContent = selectedQuiz.name;
    document.getElementById("quiz-duration").textContent = `${selectedQuiz.duration} phút`;
  
    let currentQuestionIndex = 0;
    const userAnswers = new Array(selectedQuiz.questionsData.length).fill(null);
  
    // Start the timer
    startTimer(selectedQuiz.duration);
  
    // Render the first question
    renderQuestion(selectedQuiz, currentQuestionIndex);
  
    // Handle "Next" button
    document.getElementById("next-btn").addEventListener("click", () => {
      if (currentQuestionIndex < selectedQuiz.questionsData.length - 1) {
        currentQuestionIndex++;
        renderQuestion(selectedQuiz, currentQuestionIndex);
      }
    });
  
    // Handle "Previous" button
    document.getElementById("prev-btn").addEventListener("click", () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion(selectedQuiz, currentQuestionIndex);
      }
    });
  
    // Handle "Submit" button
    document.getElementById("submit-btn").addEventListener("click", () => {
      calculateResults(selectedQuiz, userAnswers);
    });
  
    // Render navigation buttons
    renderNavigationButtons(selectedQuiz.questionsData.length, (index) => {
      currentQuestionIndex = index;
      renderQuestion(selectedQuiz, currentQuestionIndex);
    });
  });
  
  const renderQuestion = (quiz, questionIndex) => {
    const questionData = quiz.questionsData[questionIndex];
  
    // Update question count
    document.getElementById("question-count").textContent = `Câu hỏi ${
      questionIndex + 1
    } trên ${quiz.questionsData.length}:`;
  
    // Update question text
    document.getElementById("question-text").textContent = questionData.question;
  
    // Render answer options
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = ""; // Clear previous options
  
    questionData.answers.forEach((answer, index) => {
      const optionDiv = document.createElement("div");
      optionDiv.classList.add("form-check");
  
      optionDiv.innerHTML = `
          <input class="form-check-input" type="radio" name="answer" id="option${index}" />
          <label class="form-check-label" for="option${index}">${answer.answer}</label>
        `;
  
      optionsContainer.appendChild(optionDiv);
  
      // Save the user's answer
      optionDiv.querySelector("input").addEventListener("change", () => {
        userAnswers[questionIndex] = index;
      });
    });
  };
  
  const calculateResults = (quiz, userAnswers) => {
    let correctAnswers = 0;
  
    quiz.questionsData.forEach((question, index) => {
      const userAnswerIndex = userAnswers[index];
      if (
        userAnswerIndex !== null &&
        question.answers[userAnswerIndex].isCorrected
      ) {
        correctAnswers++;
      }
    });
  
    const totalQuestions = quiz.questionsData.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
  
    // Update modal content
    document.getElementById("quiz-score").textContent = `Điểm của bạn: ${score}%`;
    document.getElementById(
      "quiz-details"
    ).innerHTML = `
      <p>Tổng số câu hỏi: ${totalQuestions}</p>
      <p>Câu trả lời đúng: ${correctAnswers}</p>
      <p>Câu trả lời sai: ${totalQuestions - correctAnswers}</p>
    `;
  
    // Show the modal
    const resultModal = new bootstrap.Modal(document.getElementById("resultModal"));
    resultModal.show();
  
    // Handle "Retry" button
    document.getElementById("retry-btn").addEventListener("click", () => {
      window.location.reload(); // Reload the page to restart the quiz
    });
  
    // Handle "Home" button
    document.getElementById("home-btn").addEventListener("click", () => {
      window.location.href = "home.html"; // Redirect to home page
    });
  };
  
  // Timer function
  const startTimer = (durationInMinutes) => {
    const timerElement = document.getElementById("quiz-timer");
    let timeRemaining = durationInMinutes * 60; // Convert minutes to seconds
  
    const timerInterval = setInterval(() => {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
  
      // Update the timer display
      timerElement.textContent = `Thời gian còn lại: ${minutes}:${seconds
        .toString()
        .padStart(2, "0")} phút`;
  
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        alert("Time's up! The quiz will now be submitted.");
        calculateResults(selectedQuiz, userAnswers);
      }
  
      timeRemaining--;
    }, 1000);
  };