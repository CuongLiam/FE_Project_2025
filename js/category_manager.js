const saveToLocalStorage = () => {
  localStorage.setItem("categories", JSON.stringify(categories));
};

const loadFromLocalStorage = () => {
  const categoriesData = localStorage.getItem("categories");
  if (categoriesData) {
    categories = JSON.parse(categoriesData);
  } else {
    // Initialize with example data if no data exists in localStorage
    categories = [
      { id: 1, categoryName: "Đời sống", categoryEmoji: "🏠" },
      { id: 2, categoryName: "Thể thao", categoryEmoji: "⚽" },
      { id: 3, categoryName: "Giải trí", categoryEmoji: "🎮" },
      { id: 4, categoryName: "Công nghệ", categoryEmoji: "💻" },
      { id: 5, categoryName: "Du lịch", categoryEmoji: "✈️" },
      { id: 6, categoryName: "Sức khỏe", categoryEmoji: "🏥" },
    ];
    saveToLocalStorage(); // Save the example data to localStorage
  }
};

let categories = [
  // {
  //   id : 1,
  //   categoryName : "Đời sống",
  //   categoryEmoji : "🏠"
  // },
  // {
  //   id : 2,
  //   categoryName : "Thể thao",
  //   categoryEmoji : "⚽"
  // },
  // {
  //   id : 3,
  //   categoryName : "Giải trí",
  //   categoryEmoji : "🎮"
  // },
  // {
  //   id : 4,
  //   categoryName : "Công nghệ",
  //   categoryEmoji : "💻"
  // },
  // {
  //   id : 5,
  //   categoryName : "Du lịch",
  //   categoryEmoji : "✈️"
  // },
  // {
  //   id : 6,
  //   categoryName : "Sức khỏe",
  //   categoryEmoji : "🏥"
  // }
];
loadFromLocalStorage();

// render and pagination ============
let currentPage = 1;
const itemsPerPage = 5;

// Function to render categories and pagination into the table body
const renderCategoriesWithPagination = () => {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = ""; // Clear existing rows

  // Calculate start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the categories for the current page
  const categoriesToDisplay = categories.slice(startIndex, endIndex);
  
  // Render for the current page
  categoriesToDisplay.forEach((category) => {
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

  // Add event listeners for edit and delete buttons after rendering
  addEditButtonListeners();
  addDeleteButtonListeners();

  renderPaginationControls();
};

// Function to render pagination controls
const renderPaginationControls = () => {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = ""; // Clear existing pagination

  // check
  if (categories.length === 0) {
    return; // No pagination if there are no categories
  }

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Previous button
  const prevButton = document.createElement("li");
  prevButton.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevButton.innerHTML = `
    <a class="page-link" href="#" tabindex="-1" aria-label="Previous">&laquo;</a>
  `;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderCategoriesWithPagination();
    }
  });
  pagination.appendChild(prevButton);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `page-item ${currentPage === i ? "active" : ""}`;
    pageItem.innerHTML = `
      <a class="page-link" href="#" aria-label="Page ${i}">${i}</a>
    `;
    if (currentPage !== i) {
      pageItem.addEventListener("click", () => {
        currentPage = i;
        renderCategoriesWithPagination();
      });
    }
    pagination.appendChild(pageItem);
  }

  // Next button
  const nextButton = document.createElement("li");
  nextButton.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
  nextButton.innerHTML = `
    <a class="page-link" href="#" aria-label="Next">&raquo;</a>
  `;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCategoriesWithPagination();
    }
  });
  pagination.appendChild(nextButton);
};

// Call the render function on page load
document.addEventListener("DOMContentLoaded", () => {
  renderCategoriesWithPagination();
});

// edit ==============
// Function to add event listeners to edit buttons
const addEditButtonListeners = () => {
  document.querySelectorAll(".btn-edit").forEach((button) => {
    button.addEventListener("click", (e) => {
      const row = e.target.closest("tr"); // Get the closest table row
      const categoryId = row.querySelector("th").textContent.trim(); // Get category ID
      const categoryName = row.querySelector("td:nth-child(2)").textContent.trim(); // Get category name
      const categoryEmoji = categoryName.split(" ")[0]; // Extract emoji (assuming it's the first part)

      // Populate modal fields
      document.getElementById("editCategoryName").value = categoryName
        .replace(categoryEmoji, "")
        .trim();
      document.getElementById("editCategoryEmoji").value = categoryEmoji;

      // Store the category ID in the modal's data attribute
      document.getElementById("editCategoryModal").setAttribute("data-category-id", categoryId);
    });
  });
};

// document.addEventListener("DOMContentLoaded", () => {
//   renderCategoriesWithPagination();
// });

const submitEditCategory = () => {
  const editCategoryName = document.getElementById("editCategoryName").value.trim();
  const editCategoryEmoji = document.getElementById("editCategoryEmoji").value.trim();
  const editNameError = document.getElementById("edit_name_error");
  const editEmojiError = document.getElementById("edit_emoji_error");

  let isValid = true;

  // Clear prev error messages
  editNameError.innerText = "";
  editEmojiError.innerText = "";

  // Validation: Ensure the category name is not empty
  if (!editCategoryName) {
    editNameError.innerText = "Tên danh mục không được để trống.";
    editNameError.style.color = "red";
    isValid = false;
  }

  // Validation: Ensure the category name is unique (excluding the current category being edited)
  const categoryId = document.getElementById("editCategoryModal").getAttribute("data-category-id");
  const isDuplicate = categories.some(
    (category) =>
      category.categoryName.toLowerCase() === editCategoryName.toLowerCase() &&
      category.id !== parseInt(categoryId)
  );
  if (isDuplicate) {
    editNameError.innerText = "Tên danh mục không được trùng nhau.";
    editNameError.style.color = "red";
    isValid = false;
  }

  // Validation: Ensure the category name has a minimum length
  if (editCategoryName.length < 3) {
    editNameError.innerText = "Tên danh mục phải có ít nhất 3 ký tự.";
    editNameError.style.color = "red";
    isValid = false;
  }

  // Validation: Ensure the emoji is not empty
  if (!editCategoryEmoji) {
    editEmojiError.innerText = "Emoji không được để trống.";
    editEmojiError.style.color = "red";
    isValid = false;
  }

  // Validation: Ensure the emoji has a minimum length
  if (editCategoryEmoji.length < 1) {
    editEmojiError.innerText = "Emoji phải có ít nhất 1 ký tự.";
    editEmojiError.style.color = "red";
    isValid = false;
  }

  if (isValid) {
    // Find the category to edit using the ID stored in the modal's data attribute
    const categoryIndex = categories.findIndex((category) => category.id === parseInt(categoryId));

    if (categoryIndex !== -1) {
      // Update the category in the array
      categories[categoryIndex].categoryName = editCategoryName;
      categories[categoryIndex].categoryEmoji = editCategoryEmoji;

      // Save to localStorage
      saveToLocalStorage();

      // Re-render the categories table
      renderCategoriesWithPagination();

      // Hide the modal
      const editModal = bootstrap.Modal.getInstance(document.getElementById("editCategoryModal"));
      editModal.hide();

      Swal.fire({
        title: "Success!",
        text: "Category edited successfully.",
        icon: "success",
      });
    }
  }
};

// Attach event listener to the "Save changes" button in the edit modal
document.getElementById("btn-submit-edit").addEventListener("click", submitEditCategory);

//delete categoroy ================
const deleteCategory = () => {
  // Get the category ID stored in the modal's data attribute
  const categoryId = document.getElementById("deleteCategoryModal").getAttribute("data-category-id");
  const categoryIndex = categories.findIndex((category) => category.id === parseInt(categoryId));

  if (categoryIndex !== -1) {
    categories.splice(categoryIndex, 1);

    // Reassign IDs to ensure they are sequential
    categories.forEach((category, idx) => {
      category.id = idx + 1; // IDs start from 1
    });

    // Save to localStorage
    saveToLocalStorage();
    
    renderCategoriesWithPagination();

    const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteCategoryModal"));
    deleteModal.hide();

    Swal.fire({
      title: "Deleted!",
      text: "Category has been deleted.",
      icon: "success"
    });
  }
};

const addDeleteButtonListeners = () => {
  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const categoryId = row.querySelector("th").textContent.trim();

      // Store the category ID in the modal's data attribute
      document.getElementById("deleteCategoryModal").setAttribute("data-category-id", categoryId);
    });
  });
};

document.getElementById("confirmDeleteBtn").addEventListener("click", deleteCategory);

// add =================
const addCategory = () => {
  const addCategoryName = document.getElementById("addCategoryName").value.trim();
  const addCategoryEmoji = document.getElementById("addCategoryEmoji").value.trim();
  const addNameError = document.getElementById("add_name_error");
  const addEmojiError = document.getElementById("add_emoji_error");

  let isValid = true;

  // Clear previous error messages
  addNameError.innerText = "";
  addEmojiError.innerText = "";

  // Validation: Ensure the category name is not empty
  if (!addCategoryName) {
    addNameError.innerText = "Tên danh mục không được để trống.";
    addNameError.style.color = "red";
    isValid = false;
  }

  // Validation: Ensure the category name is unique
  const isDuplicate = categories.some(
    (category) => category.categoryName.toLowerCase() === addCategoryName.toLowerCase()
  );
  if (isDuplicate) {
    addNameError.innerText = "Tên danh mục không được trùng nhau.";
    addNameError.style.color = "red";
    isValid = false;
  }

  // Validation: Ensure the category name has a minimum length
  if (addCategoryName.length < 3) {
    addNameError.innerText = "Tên danh mục phải có ít nhất 3 ký tự.";
    addNameError.style.color = "red";
    isValid = false;
  }

  // Validation: Ensure the emoji is not empty
  if (!addCategoryEmoji) {
    addEmojiError.innerText = "Emoji không được để trống.";
    addEmojiError.style.color = "red";
    isValid = false;
  }

  // Validation: Ensure the emoji has a minimum length
  if (addCategoryEmoji.length < 1) {
    addEmojiError.innerText = "Emoji phải có ít nhất 1 ký tự.";
    addEmojiError.style.color = "red";
    isValid = false;
  }

  if (isValid) {
    // Create a new category object
    const newCategory = {
      id: categories.length + 1, // Assign the next ID
      categoryName: addCategoryName,
      categoryEmoji: addCategoryEmoji,
    };

    // Push the new category to the array
    categories.push(newCategory);

    // Save to localStorage
    saveToLocalStorage();

    // Re-render the categories table
    renderCategoriesWithPagination();

    // Clear the input fields
    document.getElementById("addCategoryName").value = "";
    document.getElementById("addCategoryEmoji").value = "";

    // Hide the modal
    const addModal = bootstrap.Modal.getInstance(document.getElementById("addCategoryModal"));
    addModal.hide();

    // Show success alert
    Swal.fire({
      title: "Success!",
      text: "Category added successfully.",
      icon: "success",
    });
  }
};

document.getElementById("btn-submit-add").addEventListener("click", addCategory);

// Clear error messages when the "Add Category" modal is closed
document.getElementById("addCategoryModal").addEventListener("hidden.bs.modal", () => {
  document.getElementById("add_name_error").innerText = "";
  document.getElementById("add_emoji_error").innerText = "";
});

// Clear error messages when the "Edit Category" modal is closed
document.getElementById("editCategoryModal").addEventListener("hidden.bs.modal", () => {
  document.getElementById("edit_name_error").innerText = "";
  document.getElementById("edit_emoji_error").innerText = "";
});