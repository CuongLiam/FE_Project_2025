const renderQuizzes = () => {
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    // const quizContainer = document.querySelector(".row.row-cols-1.row-cols-md-2.g-3");
    const quizContainer = document.getElementById("quiz_cards");
  
    quizContainer.innerHTML = ""; // Clear existing content
  
    quizzes.forEach((quiz) => {
      const category = categories.find((cat) => cat.categoryName === quiz.category);
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
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    renderQuizzes();
  });