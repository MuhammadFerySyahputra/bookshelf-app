// Function to generate unique ID
function generateID() {
  return Math.random().toString(36).substr(2, 9);
}

// Function to render books on shelves
function renderBooks(books, shelfId) {
  const shelf = document.getElementById(shelfId);
  shelf.innerHTML = "";
  books.forEach((book) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item mt-3";
    listItem.innerHTML = `
          <h5>Judul Buku = <strong>${book.title}</strong></h5>
          <h5>Penulis = <strong>${book.author}</strong></h5>
          <h5>Tahin Terbit = <strong>${book.year}</strong></h5>
          <button type="button" class="btn btn-danger btn-sm float-right delete-btn" data-id="${
            book.id
          }">Delete</button>
          <button type="button" class="btn btn-primary btn-sm float-right move-btn" data-id="${
            book.id
          }" data-status="${!book.isComplete}">${
      book.isComplete ? "Move to Unfinished" : "Move to Finished"
    }</button>

        `;
    shelf.appendChild(listItem);
  });
}

// Function to get books from localStorage
function getBooksFromStorage() {
  const booksJSON = localStorage.getItem("books");
  return booksJSON ? JSON.parse(booksJSON) : { unfinished: [], finished: [] };
}

// Function to save books to localStorage
function saveBooksToStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

// Initial render
const books = getBooksFromStorage();
renderBooks(books.unfinished, "unfinishedBooks");
renderBooks(books.finished, "finishedBooks");

// Form submit event to add a new book
const addBookForm = document.getElementById("addBookForm");
addBookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = parseInt(document.getElementById("year").value);
  const isComplete = document.getElementById("isComplete").value === "true";
  const newBook = {
    id: generateID(),
    title,
    author,
    year,
    isComplete,
  };
  books[isComplete ? "finished" : "unfinished"].push(newBook);
  saveBooksToStorage(books);
  renderBooks(books.unfinished, "unfinishedBooks");
  renderBooks(books.finished, "finishedBooks");
  addBookForm.reset();
});

// Event delegation for move and delete buttons
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("move-btn")) {
    const bookId = event.target.getAttribute("data-id");
    const newStatus = event.target.getAttribute("data-status") === "true";
    const shelfKey = newStatus ? "finished" : "unfinished";
    const oppositeShelfKey = newStatus ? "unfinished" : "finished";
    const bookIndex = books[oppositeShelfKey].findIndex(
      (book) => book.id === bookId
    );
    const movedBook = books[oppositeShelfKey].splice(bookIndex, 1)[0];
    movedBook.isComplete = newStatus;
    books[shelfKey].push(movedBook);
    saveBooksToStorage(books);
    renderBooks(books.unfinished, "unfinishedBooks");
    renderBooks(books.finished, "finishedBooks");
  } else if (event.target.classList.contains("delete-btn")) {
    const bookId = event.target.getAttribute("data-id");
    for (const shelf of Object.keys(books)) {
      const bookIndex = books[shelf].findIndex((book) => book.id === bookId);
      if (bookIndex !== -1) {
        books[shelf].splice(bookIndex, 1);
        break;
      }
    }
    saveBooksToStorage(books);
    renderBooks(books.unfinished, "unfinishedBooks");
    renderBooks(books.finished, "finishedBooks");
  }
});

// **Inisialisasi**
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("submitButton");

// **Fungsi untuk menampilkan alert**
function showAlert(message) {
  alert(message);
}

// **Fungsi untuk mencari buku**
function searchBook() {
  const searchTerm = searchInput.value.toLowerCase();
  const books = getBooksFromStorage();

  // **Mencari di rak buku "unfinished" dan "finished"**
  for (const shelf of Object.keys(books)) {
    for (const book of books[shelf]) {
      const title = book.title.toLowerCase();
      if (title.includes(searchTerm)) {
        showAlert(
          `Judul Buku: ${book.title}\nPenulis: ${book.author}\nTahun Terbit: ${book.year}`
        );
        return;
      }
    }
  }

  // **Menampilkan alert jika tidak ditemukan**
  showAlert("Judul yang Anda cari tidak ditemukan");
}

// **Event listener untuk tombol submit**
searchButton.addEventListener("click", searchBook);
