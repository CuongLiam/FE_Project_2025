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
    quizzes = JSON.parse(quizzesData);
  } else {
    // Initialize with example data if no data exists in localStorage
    quizzes = [
      {
        id: 1,
        name: "Life Quizz",
        category: "Đời sống",
        questions: 15,
        duration: 10,
      },
      {
        id: 2,
        name: "Sports quizz",
        category: "Thể thao",
        questions: 20,
        duration: 15,
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
const addQuiz = () => {
  const name = document.getElementById("addQuizName").value.trim();
  const category = document.getElementById("addQuizCategory").value;
  const questions = parseInt(
    document.getElementById("addQuizQuestions").value.trim()
  );
  const duration = parseInt(
    document.getElementById("addQuizDuration").value.trim()
  );

  if (!name || !category || isNaN(questions) || isNaN(duration)) {
    Swal.fire({
      title: "Error!",
      text: "All fields are required.",
      icon: "error",
    });
    return;
  }

  const newQuiz = {
    id: quizzes.length + 1,
    name,
    category,
    questions,
    duration,
  };

  quizzes.push(newQuiz);
  saveToLocalStorage();
  renderQuizzesWithPagination();

  document.getElementById("addQuizName").value = "";
  document.getElementById("addQuizCategory").value = "";
  document.getElementById("addQuizQuestions").value = "";
  document.getElementById("addQuizDuration").value = "";

  const addModal = bootstrap.Modal.getInstance(
    document.getElementById("addQuizModal")
  );
  addModal.hide();

  Swal.fire({
    title: "Success!",
    text: "Quiz added successfully.",
    icon: "success",
  });
};

// Edit quiz
const editQuiz = () => {
  const id = parseInt(
    document.getElementById("editQuizModal").getAttribute("data-quiz-id")
  );
  const name = document.getElementById("editQuizName").value.trim();
  const category = document.getElementById("editQuizCategory").value;
  const questions = parseInt(
    document.getElementById("editQuizQuestions").value.trim()
  );
  const duration = parseInt(
    document.getElementById("editQuizDuration").value.trim()
  );

  if (!name || !category || isNaN(questions) || isNaN(duration)) {
    Swal.fire({
      title: "Error!",
      text: "All fields are required.",
      icon: "error",
    });
    return;
  }

  const quizIndex = quizzes.findIndex((quiz) => quiz.id === id);
  if (quizIndex !== -1) {
    quizzes[quizIndex] = { id, name, category, questions, duration };
    saveToLocalStorage();
    renderQuizzesWithPagination();

    const editModal = bootstrap.Modal.getInstance(
      document.getElementById("editQuizModal")
    );
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
      quizzes.forEach((quiz, index) => (quiz.id = index + 1));
      saveToLocalStorage();
      renderQuizzesWithPagination();

      Swal.fire({
        title: "Deleted!",
        text: "Quiz has been deleted.",
        icon: "success",
      });
    }
  });
};

// Add event listeners
document.getElementById("btn-submit-add").addEventListener("click", addQuiz);
document.getElementById("btn-submit-edit").addEventListener("click", editQuiz);

const addEditButtonListeners = () => {
  document.querySelectorAll(".btn-edit").forEach((button) => {
    button.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const id = parseInt(row.querySelector("th").textContent.trim());
      const quiz = quizzes.find((quiz) => quiz.id === id);

      if (quiz) {
        document.getElementById("editQuizName").value = quiz.name;
        document.getElementById("editQuizCategory").value = quiz.category;
        document.getElementById("editQuizQuestions").value = quiz.questions;
        document.getElementById("editQuizDuration").value = quiz.duration;
        document
          .getElementById("editQuizModal")
          .setAttribute("data-quiz-id", id);
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

document
  .getElementById("addQuizModal")
  .addEventListener("hidden.bs.modal", () => {
    document.getElementById("addQuizName").value = "";
    document.getElementById("addQuizCategory").value = "";
    document.getElementById("addQuizQuestions").value = "";
    document.getElementById("addQuizDuration").value = "";
    document.getElementById("add_category_error").innerText = "";
  });

document
  .getElementById("editQuizModal")
  .addEventListener("hidden.bs.modal", () => {
    document.getElementById("editQuizName").value = "";
    document.getElementById("editQuizCategory").value = "";
    document.getElementById("editQuizQuestions").value = "";
    document.getElementById("editQuizDuration").value = "";
    document.getElementById("edit_category_error").innerText = "";
  });
