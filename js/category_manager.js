let categories = [
  {
    id : 1,
    categoryName : "Đời sống",
    categoryEmoji : "🏠"
  },
  {
    id : 2,
    categoryName : "Thể thao",
    categoryEmoji : "⚽"
  },
  {
    id : 3,
    categoryName : "Giải trí",
    categoryEmoji : "🎮"
  },
  {
    id : 4,
    categoryName : "Công nghệ",
    categoryEmoji : "💻"
  },
  {
    id : 5,
    categoryName : "Du lịch",
    categoryEmoji : "✈️"
  },
  {
    id : 6,
    categoryName : "Sức khỏe",
    categoryEmoji : "🏥"
  }
]

// Function to render categories into the table body
const renderCategories = () => {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = ""; // Clear existing rows

  categories.forEach((category) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row">${category.id}</th>
      <td>${category.categoryEmoji} ${category.categoryName}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-edit me-2" data-bs-toggle="modal" data-bs-target="#editCategoryModal">Edit</button>
        <button class="btn btn-sm btn-delete" data-bs-toggle="modal" data-bs-target="#deleteCategoryModal">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
};

// Load categories when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
});

// edit buttons
document.querySelectorAll(".btn-edit").forEach((button) => {
  button.addEventListener("click", (e) => {
    const row = e.target.closest("tr"); // Get the closest table row
    const categoryName = row
      .querySelector("td:nth-child(2)")
      .textContent.trim(); // Get category name
    const categoryEmoji = categoryName.split(" ")[0]; // Extract emoji (assuming it's the first part)

    console.log(categoryEmoji);
    // Populate modal fields
    document.getElementById("editCategoryName").value = categoryName
      .replace(categoryEmoji, "")
      .trim();
    document.getElementById("editCategoryEmoji").value = categoryEmoji;
    
  });
});

// //delete buttons
// let categoryToDelete = null;

// // Add event listener to all delete buttons
// document.querySelectorAll(".btn-delete").forEach((button) => {
//   button.addEventListener("click", (e) => {
//     const row = e.target.closest("tr"); // Get the closest table row
//     categoryToDelete = row; // Store the row to delete
//   });
// });

// // Handle delete confirmation
// document.getElementById("confirmDeleteButton").addEventListener("click", () => {
//   if (categoryToDelete) {
//     categoryToDelete.remove(); // Remove the row from the table
//     categoryToDelete = null; // Reset the variable
//     const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteCategoryModal"));
//     deleteModal.hide(); // Hide the modal
//   }
// });
