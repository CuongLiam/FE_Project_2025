let currentPage = 1;
const itemsPerPage = 6;

const renderQuizzes = () => {
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const quizContainer = document.getElementById("quiz_cards");

  quizContainer.innerHTML = ""; // Clear existing content

  // Calculate the quizzes to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const quizzesToDisplay = quizzes.slice(startIndex, endIndex);

  quizzesToDisplay.forEach((quiz) => {
    const category = categories.find(
      (cat) => cat.categoryName === quiz.category
    );
    const categoryEmoji = category ? category.categoryEmoji : "❓";

    const quizCard = document.createElement("div");
    quizCard.classList.add("col");

    quizCard.innerHTML = `
      <div class="card h-100 border-0 shadow-sm">
        <div class="row g-0 align-items-center">
          <div class="col-auto">
            <img
              src="../assets/img/2683.webp"
              class="img-fluid rounded-start"
              alt="Quiz thumbnail"
              style="width: 100px; height: 100px; object-fit: cover"
            />
          </div>
          <div class="col px-3">
            <small class="text-muted">${categoryEmoji} ${quiz.category}</small>
            <h5 class="card-title mb-1">${quiz.name}</h5>
            <p class="card-text mb-0">
              <small class="text-muted">${quiz.questions} questions</small>
            </p>
          </div>
          <div class="col-auto pe-3">
            <button class="btn btn-warning btn-sm">Play</button>
          </div>
        </div>
      </div>
    `;

    quizContainer.appendChild(quizCard);
  });

  renderPaginationControls(quizzes.length);
};

const renderPaginationControls = (totalQuizzes) => {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = ""; // Clear existing pagination

  const totalPages = Math.ceil(totalQuizzes / itemsPerPage);

  // Previous button
  const prevButton = document.createElement("li");
  prevButton.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevButton.innerHTML = `<a class="page-link" href="#">&laquo;</a>`;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderQuizzes();
    }
  });
  pagination.appendChild(prevButton);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `page-item ${currentPage === i ? "active" : ""}`;
    pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageItem.addEventListener("click", () => {
      currentPage = i;
      renderQuizzes();
    });
    pagination.appendChild(pageItem);
  }

  // Next button
  const nextButton = document.createElement("li");
  nextButton.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  nextButton.innerHTML = `<a class="page-link" href="#">&raquo;</a>`;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderQuizzes();
    }
  });
  pagination.appendChild(nextButton);
};

document.addEventListener("DOMContentLoaded", () => {
  renderQuizzes();
});
