let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

document.addEventListener("DOMContentLoaded", () => {
  populateCategoryOptions();

  document
    .getElementById("addQuestionBtn")
    .addEventListener("click", addQuestion);
  document.getElementById("saveQuizBtn").addEventListener("click", saveQuiz);
});

const populateCategoryOptions = () => {
  const categoriesData = localStorage.getItem("categories");
  if (!categoriesData) return;

  const categories = JSON.parse(categoriesData);
  const quizCategorySelect = document.getElementById("quizCategory");

  quizCategorySelect.innerHTML =
    '<option value="" selected disabled>Select a category</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.categoryName;
    option.textContent = category.categoryName;
    quizCategorySelect.appendChild(option);
  });
};

let questionCount = 0;

const addQuestion = () => {
  questionCount++;
  const questionsContainer = document.getElementById("questionsContainer");

  const questionDiv = document.createElement("div");
  questionDiv.classList.add("mb-3");
  questionDiv.setAttribute("id", `question_${questionCount}`);

  questionDiv.innerHTML = `
      <label for="questionText_${questionCount}" class="form-label">Question ${questionCount}</label>
      <input type="text" class="form-control mb-2" id="questionText_${questionCount}" placeholder="Enter question">
      <div id="answersContainer_${questionCount}" class="mb-3">
        <label class="form-label">Answers</label>
        <div class="d-flex align-items-center mb-2">
          <input type="text" class="form-control me-2" placeholder="Enter answer">
          <input type="checkbox" class="form-check-input me-2" title="Mark as correct">
          <button type="button" class="btn btn-danger btn-sm remove-answer"><i class="fa-solid fa-trash-xmark"></i></button>
        </div>
      </div>
      <button type="button" class="btn btn-info btn-sm add-answer" data-question-id="${questionCount}">Add Answer</button>
      <button type="button" class="btn btn-danger btn-sm remove-question" data-question-id="${questionCount}">Delete Question</button>
    `;

  questionsContainer.appendChild(questionDiv);

  // Add event listeners for "Add Answer" and "Remove Answer"
  questionDiv.querySelector(".add-answer").addEventListener("click", (e) => {
    const questionId = e.target.getAttribute("data-question-id");
    const answersContainer = document.getElementById(
      `answersContainer_${questionId}`
    );

    const answerDiv = document.createElement("div");
    answerDiv.classList.add("d-flex", "align-items-center", "mb-2");

    answerDiv.innerHTML = `
        <input type="text" class="form-control me-2" placeholder="Enter answer">
        <input type="checkbox" class="form-check-input me-2" title="Mark as correct">
        <button type="button" class="btn btn-danger btn-sm remove-answer"><i class="fa-solid fa-trash-xmark"></i></button>
      `;

    answersContainer.appendChild(answerDiv);

    answerDiv.querySelector(".remove-answer").addEventListener("click", () => {
      answerDiv.remove();
    });
  });

  // Add event listener for "Delete Question" with SweetAlert confirmation
  questionDiv.querySelector(".remove-question").addEventListener("click", () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        questionDiv.remove();
        Swal.fire({
          title: "Deleted!",
          text: "The question has been deleted.",
          icon: "success",
        });
      }
    });
  });
};

const saveQuiz = () => {
    const name = document.getElementById("quizName").value.trim();
    const category = document.getElementById("quizCategory").value;
    const duration = parseInt(
      document.getElementById("quizDuration").value.trim()
    );
  
    if (!name || !category || isNaN(duration) || duration <= 0) {
      Swal.fire({
        title: "Error!",
        text: "All fields are required, and duration must be greater than 0.",
        icon: "error",
      });
      return;
    }
  
    const questionsData = [];
    for (let i = 1; i <= questionCount; i++) {
      const questionText = document
        .getElementById(`questionText_${i}`)
        .value.trim();
      const answers = Array.from(
        document.querySelectorAll(`#answersContainer_${i} .d-flex`)
      ).map((answerDiv) => {
        const answerText = answerDiv
          .querySelector("input[type='text']")
          .value.trim();
        const isCorrected = answerDiv.querySelector(
          "input[type='checkbox']"
        ).checked;
        return { answer: answerText, isCorrected };
      });
  
      if (!questionText || answers.length === 0) {
        Swal.fire({
          title: "Error!",
          text: `Question ${i} and its answers cannot be empty.`,
          icon: "error",
        });
        return;
      }
  
      questionsData.push({
        question: questionText,
        answers,
      });
    }
  
    // Check for duplicate quiz names
    const isDuplicate = quizzes.some(
      (quiz) => quiz.name.toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) {
      Swal.fire({
        title: "Error!",
        text: "Quiz name already exists. Please choose a different name.",
        icon: "error",
      });
      return;
    }
  
    // Calculate the next available ID
    const nextId =
      quizzes.length > 0 ? Math.max(...quizzes.map((quiz) => quiz.id)) + 1 : 1;
  
    const newQuiz = {
      id: nextId, // Use the calculated ID
      name,
      category,
      duration,
      questions: questionsData.length,
      questionsData,
    };
  
    quizzes.push(newQuiz);
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
  
    Swal.fire({
      title: "Success!",
      text: "Quiz saved successfully.",
      icon: "success",
    }).then(() => {
      window.location.href = "./quizzes_manager.html";
    });
  };
