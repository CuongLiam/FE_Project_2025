let quizzes = [];
const itemsPerPage = 5;
let currentPage = 1;

// Save quizzes to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
};

// Load quizzes from localStorage
const loadFromLocalStorage = () => {
  const quizzesData = localStorage.getItem("quizzes");
  if (quizzesData) {
    quizzes = JSON.parse(quizzesData).map((quiz) => {
      quiz.questionsData = quiz.questionsData.map((question) => {
        question.answers = question.answers.map((answer) =>
          typeof answer === "string"
            ? { answer, isCorrected: false } // Default `isCorrected` to false if missing
            : answer
        );
        return question;
      });
      return quiz;
    });
  } else {
    // Initialize with example data if no data exists in localStorage
    quizzes = [
      {
        id: 1,
        name: "Life Quizz",
        category: "Đời sống",
        questions: 2,
        duration: 10,
        questionsData: [
          {
            question: "hi?",
            answers: [
              { answer: "dc", isCorrected: true },
              { answer: "ko", isCorrected: false },
            ],
          },
          {
            question: "ba?",
            answers: [
              { answer: "ds", isCorrected: false },
              { answer: "ksdo", isCorrected: false },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Sports quizz",
        category: "Thể thao",
        questions: 2,
        duration: 15,
        questionsData: [
          {
            question: "hi?",
            answers: [
              { answer: "dc", isCorrected: false },
              { answer: "ko", isCorrected: false },
            ],
          },
          {
            question: "ba?",
            answers: [
              { answer: "dsdwes", isCorrected: false },
              { answer: "ksdo", isCorrected: false },
            ],
          },
        ],
      },
    ];
    saveToLocalStorage();
  }
};

// Render quizzes with pagination
const renderQuizzesWithPagination = () => {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const quizzesToDisplay = quizzes.slice(startIndex, endIndex);

  quizzesToDisplay.forEach((quiz) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row">${quiz.id}</th>
      <td>${quiz.name}</td>
      <td>${quiz.category}</td>
      <td>${quiz.questions}</td>
      <td>${quiz.duration} min</td>
      <td class="text-center">
        <button class="btn btn-sm btn-edit me-2" data-bs-toggle="modal" data-bs-target="#editQuizModal">Edit</button>
        <button class="btn btn-sm btn-delete">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  addEditButtonListeners();
  addDeleteButtonListeners();
  renderPaginationControls();
};

// Render pagination controls
const renderPaginationControls = () => {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  if (quizzes.length === 0) return;

  const totalPages = Math.ceil(quizzes.length / itemsPerPage);

  const prevButton = document.createElement("li");
  prevButton.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevButton.innerHTML = `<a class="page-link" href="#">&laquo;</a>`;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderQuizzesWithPagination();
    }
  });
  pagination.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `page-item ${currentPage === i ? "active" : ""}`;
    pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    if (currentPage !== i) {
      pageItem.addEventListener("click", () => {
        currentPage = i;
        renderQuizzesWithPagination();
      });
    }
    pagination.appendChild(pageItem);
  }

  const nextButton = document.createElement("li");
  nextButton.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  nextButton.innerHTML = `<a class="page-link" href="#">&raquo;</a>`;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderQuizzesWithPagination();
    }
  });
  pagination.appendChild(nextButton);
};

// Add quiz
// const addQuiz = () => {
//     const name = document.getElementById("addQuizName").value.trim();
//     const category = document.getElementById("addQuizCategory").value;
//     const questions = parseInt(document.getElementById("addQuizQuestions").value.trim());
//     const duration = parseInt(document.getElementById("addQuizDuration").value.trim());
  
//     if (!name || !category || isNaN(questions) || questions <= 0 || isNaN(duration)) {
//       Swal.fire({
//         title: "Error!",
//         text: "All fields are required, and the number of questions must be greater than 0.",
//         icon: "error",
//       });
//       return;
//     }
  
//     // Validation: Check for duplicate quiz name
//     const isDuplicate = quizzes.some((quiz) => quiz.name.toLowerCase() === name.toLowerCase());
//     if (isDuplicate) {
//       Swal.fire({
//         title: "Error!",
//         text: "Quiz name already exists. Please choose a different name.",
//         icon: "error",
//       });
//       return;
//     }
  
//     const questionsData = [];
//     for (let i = 1; i <= questions; i++) {
//       const questionText = document.getElementById(`question_${i}`).value.trim();
//       const answers = Array.from(document.querySelectorAll(`#answersContainer_${i} .d-flex`)).map(
//         (answerDiv) => {
//           const answerText = answerDiv.querySelector("input[type='text']").value.trim();
//           const isCorrected = answerDiv.querySelector("input[type='checkbox']").checked;
//           return { answer: answerText, isCorrected };
//         }
//       );
  
//       if (!questionText || answers.length === 0) {
//         Swal.fire({
//           title: "Error!",
//           text: `Question ${i} and its answers cannot be empty.`,
//           icon: "error",
//         });
//         return;
//       }
  
//       questionsData.push({
//         question: questionText,
//         answers,
//       });
//     }
  
//     const newQuiz = {
//       id: quizzes.length + 1,
//       name,
//       category,
//       questions: questionsData.length,
//       duration,
//       questionsData,
//     };
  
//     quizzes.push(newQuiz);
//     saveToLocalStorage();
//     renderQuizzesWithPagination();
  
//     // Clear input fields and dynamically generated questions
//     document.getElementById("addQuizName").value = "";
//     document.getElementById("addQuizCategory").value = "";
//     document.getElementById("addQuizQuestions").value = "";
//     document.getElementById("addQuizDuration").value = "";
//     document.getElementById("questionsContainer").innerHTML = "";
  
//     const addModal = bootstrap.Modal.getInstance(document.getElementById("addQuizModal"));
//     addModal.hide();
  
//     Swal.fire({
//       title: "Success!",
//       text: "Quiz added successfully.",
//       icon: "success",
//     });
//   };
//   document.getElementById("btn-submit-add").addEventListener("click", addQuiz);

document.getElementById("addQuizBtn").addEventListener("click", () => {
  window.location.href = "./questions_quizzes_manager.html";
});

// Edit quiz
const editQuiz = () => {
  const id = parseInt(document.getElementById("editQuizModal").getAttribute("data-quiz-id"));
  const name = document.getElementById("editQuizName").value.trim();
  const category = document.getElementById("editQuizCategory").value;
  const questions = parseInt(document.getElementById("editQuizQuestions").value.trim());
  const duration = parseInt(document.getElementById("editQuizDuration").value.trim());

  if (!name || !category || isNaN(questions) || isNaN(duration)) {
    Swal.fire({
      title: "Error!",
      text: "All fields are required.",
      icon: "error",
    });
    return;
  }

  const questionsData = [];
  for (let i = 1; i <= questions; i++) {
    const questionText = document.getElementById(`editQuestionText_${i}`).value.trim();
    const answers = Array.from(document.querySelectorAll(`#editAnswersContainer_${i} .d-flex`)).map(
      (answerDiv) => {
        const answerText = answerDiv.querySelector("input[type='text']").value.trim();
        const isCorrected = answerDiv.querySelector("input[type='checkbox']").checked;
        return { answer: answerText, isCorrected };
      }
    );

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

  const quizIndex = quizzes.findIndex((quiz) => quiz.id === id);
  if (quizIndex !== -1) {
    quizzes[quizIndex] = { id, name, category, questions: questionsData.length, duration, questionsData };
    saveToLocalStorage();
    renderQuizzesWithPagination();

    const editModal = bootstrap.Modal.getInstance(document.getElementById("editQuizModal"));
    editModal.hide();

    Swal.fire({
      title: "Success!",
      text: "Quiz edited successfully.",
      icon: "success",
    });
  }
};

// Delete quiz
const deleteQuiz = (id) => {
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
      quizzes = quizzes.filter((quiz) => quiz.id !== id);
      quizzes.forEach((quiz, index) => (quiz.id = index + 1));// Reassign IDs
      saveToLocalStorage();
      renderQuizzesWithPagination();

      renderPaginationControls(); // Ensure pagination updates
      Swal.fire({
        title: "Deleted!",
        text: "Quiz has been deleted.",
        icon: "success",
      });
    }
  });
};

// Add event listeners
// document.getElementById("btn-submit-add").addEventListener("click", addQuiz);
document.getElementById("btn-submit-edit").addEventListener("click", editQuiz);

const addEditButtonListeners = () => {
  document.querySelectorAll(".btn-edit").forEach((button) => {
    button.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const id = parseInt(row.querySelector("th").textContent.trim());
      const quiz = quizzes.find((quiz) => quiz.id === id);

      if (quiz) {
        // Populate basic quiz details
        document.getElementById("editQuizName").value = quiz.name;
        document.getElementById("editQuizCategory").value = quiz.category;
        document.getElementById("editQuizQuestions").value = quiz.questions;
        document.getElementById("editQuizDuration").value = quiz.duration;
        document.getElementById("editQuizModal").setAttribute("data-quiz-id", id);

        // Populate questions and answers
        const editQuestionsContainer = document.getElementById("editQuestionsContainer");
        editQuestionsContainer.innerHTML = ""; // Clear previous content

        quiz.questionsData.forEach((question, index) => {
          const questionDiv = document.createElement("div");
          questionDiv.classList.add("mb-3");
          questionDiv.setAttribute("id", `editQuestion_${index + 1}`);
        
          questionDiv.innerHTML = `
            <label for="editQuestionText_${index + 1}" class="form-label">Question ${index + 1}</label>
            <input type="text" class="form-control mb-2" id="editQuestionText_${index + 1}" value="${question.question}">
            <div id="editAnswersContainer_${index + 1}" class="mb-3">
              <label class="form-label">Answers</label>
              ${question.answers
                .map(
                  (answer, answerIndex) => `
                  <div class="d-flex align-items-center mb-2">
                    <input type="text" class="form-control me-2" value="${answer.answer || ""}">
                    <input type="checkbox" class="form-check-input me-2" title="Mark as correct" ${
                      answer.isCorrected ? "checked" : ""
                    }>
                    <button type="button" class="btn btn-danger btn-sm remove-answer">Remove</button>
                  </div>
                `
                )
                .join("")}
            </div>
            <button type="button" class="btn btn-info btn-sm add-answer" data-question-id="${index + 1}">Add Answer</button>
          `;
        
          editQuestionsContainer.appendChild(questionDiv);
        
          // Add event listeners for "Add Answer" and "Remove Answer"
          questionDiv.querySelector(".add-answer").addEventListener("click", (e) => {
            const questionId = e.target.getAttribute("data-question-id");
            const answersContainer = document.getElementById(`editAnswersContainer_${questionId}`);
        
            const answerDiv = document.createElement("div");
            answerDiv.classList.add("d-flex", "align-items-center", "mb-2");
        
            answerDiv.innerHTML = `
              <input type="text" class="form-control me-2" placeholder="Enter answer">
              <input type="checkbox" class="form-check-input me-2" title="Mark as correct">
              <button type="button" class="btn btn-danger btn-sm remove-answer">Remove</button>
            `;
        
            answersContainer.appendChild(answerDiv);
        
            answerDiv.querySelector(".remove-answer").addEventListener("click", () => {
              answerDiv.remove();
            });
          });
        
          questionDiv.querySelectorAll(".remove-answer").forEach((button) => {
            button.addEventListener("click", (e) => {
              e.target.closest(".d-flex").remove();
            });
          });
        });
      }
    });
  });
};

const addDeleteButtonListeners = () => {
  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const id = parseInt(row.querySelector("th").textContent.trim());
      deleteQuiz(id);
    });
  });
};

const populateCategoryOptions = () => {
  const categoriesData = localStorage.getItem("categories");
  if (!categoriesData) return;

  const categories = JSON.parse(categoriesData);

  const addQuizCategorySelect = document.getElementById("addQuizCategory");
  const editQuizCategorySelect = document.getElementById("editQuizCategory");

  // Clear existing options
  addQuizCategorySelect.innerHTML =
    '<option value="" selected disabled>Select a category</option>';
  editQuizCategorySelect.innerHTML =
    '<option value="" selected disabled>Select a category</option>';

  // Populate options
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.categoryName;
    option.textContent = category.categoryName;

    // Add to both add and edit select elements
    addQuizCategorySelect.appendChild(option);
    editQuizCategorySelect.appendChild(option.cloneNode(true));
  });
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  renderQuizzesWithPagination();

  populateCategoryOptions(); // Populate category options
});

// document.getElementById("addQuizModal").addEventListener("hidden.bs.modal", () => {
//     document.getElementById("addQuizName").value = "";
//     document.getElementById("addQuizCategory").value = "";
//     document.getElementById("addQuizQuestions").value = "";
//     document.getElementById("addQuizDuration").value = "";

//     document.getElementById("questionsContainer").innerHTML = ""; // Clear dynamically generated questions
  
//     const addCategoryError = document.getElementById("add_category_error");
//     if (addCategoryError) {
//       addCategoryError.innerText = "";
//     }
//   });

document.getElementById("editQuizModal").addEventListener("hidden.bs.modal", () => {
  document.getElementById("editQuizName").value = "";
  document.getElementById("editQuizCategory").value = "";
  document.getElementById("editQuizQuestions").value = "";
  document.getElementById("editQuizDuration").value = "";
  document.getElementById("editQuestionsContainer").innerHTML = ""; // Clear questions
});

  //add quizz questions
  // document.getElementById("addQuizQuestions").addEventListener("input", (e) => {
  //   const numberOfQuestions = parseInt(e.target.value.trim());
  //   const questionsContainer = document.getElementById("questionsContainer");
  
  //   // Clear previous questions
  //   questionsContainer.innerHTML = "";
  
  //   if (isNaN(numberOfQuestions) || numberOfQuestions <= 0) {
  //     return;
  //   }
  
  //   // Generate questions and answers form
  //   for (let i = 1; i <= numberOfQuestions; i++) {
  //     const questionDiv = document.createElement("div");
  //     questionDiv.classList.add("mb-3");
  
  //     questionDiv.innerHTML = `
  //       <label for="question_${i}" class="form-label">Question ${i}</label>
  //       <input type="text" class="form-control mb-2" id="question_${i}" placeholder="Enter question ${i}">
  //       <div id="answersContainer_${i}" class="mb-3">
  //         <label class="form-label">Answers for Question ${i}</label>
  //         <div class="d-flex align-items-center mb-2">
  //           <input type="text" class="form-control me-2" placeholder="Enter answer">
  //           <input type="checkbox" class="form-check-input me-2" title="Mark as correct">
  //           <button type="button" class="btn btn-danger btn-sm remove-answer">Remove</button>
  //         </div>
  //       </div>
  //       <button type="button" class="btn btn-info btn-sm add-answer" data-question-id="${i}">Add Answer</button>
  //     `;
  
  //     questionsContainer.appendChild(questionDiv);
  //   }
  
  //   // Add event listeners for "Add Answer" buttons
  //   document.querySelectorAll(".add-answer").forEach((button) => {
  //     button.addEventListener("click", (e) => {
  //       const questionId = e.target.getAttribute("data-question-id");
  //       const answersContainer = document.getElementById(`answersContainer_${questionId}`);
  
  //       const answerDiv = document.createElement("div");
  //       answerDiv.classList.add("d-flex", "align-items-center", "mb-2");
  
  //       answerDiv.innerHTML = `
  //         <input type="text" class="form-control me-2" placeholder="Enter answer">
  //         <input type="checkbox" class="form-check-input me-2" title="Mark as correct">
  //         <button type="button" class="btn btn-danger btn-sm remove-answer">Remove</button>
  //       `;
  
  //       answersContainer.appendChild(answerDiv);
  
  //       // Add event listener for "Remove Answer" button
  //       answerDiv.querySelector(".remove-answer").addEventListener("click", () => {
  //         answerDiv.remove();
  //       });
  //     });
  //   });
  
  //   // Add event listeners for "Remove Answer" buttons
  //   document.querySelectorAll(".remove-answer").forEach((button) => {
  //     button.addEventListener("click", (e) => {
  //       e.target.closest(".d-flex").remove();
  //     });
  //   });
  // });