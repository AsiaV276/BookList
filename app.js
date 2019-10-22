// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {     //Static method calls are made directly on the class and are not callable on instances of the class. Static methods are often used to create utility functions.

        const books = Store.getBooks(); //will get books from local storage

        // loop through all books in the array and call method add book to list
        books.forEach((book => UI.addBookToList(book)));
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
        `;

        // append row to the list
        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove(); //removes the tr(the row), the parent of the parent
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;  //get the class of alert, danger or success
        div.appendChild(document.createTextNode(message)); //append the message into the div
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form); //parent element container, insert div before form
        
        //goes away in 5 seconds
        setTimeout(function() {
            document.querySelector('.alert').remove()}, 5000);
    }

    static clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Store Class: Handles Storage
// local storage stores key value pairs
// item called books will be a string version of entire array of books
// can't store objects in local storage so before a book is added it has to be stringified, when pulled 
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) { //check if there is a current book item in local storage, if there is no item of books
            books = [];                              // ...set books item to an empty array
        }
        else {
            books = JSON.parse(localStorage.getItem('books')); // books is stores as a string, JSON.parse to use as an array
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books)); //reset it to local storage, stringify books to add it to local storage

    }

    static deleteBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn) { //check if isbn matches the one passed in
                books.splice(index, 1); //index shows where to splice it, only splice one
            }
        });

        localStorage.setItem('books', JSON.stringify(books));    //reset local storage with the item removed
    }

}





// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks); // calls UI.dsiplay books when the DOM is loaded


// Event: Add a Book in UI and storage
document.getElementById('book-form').addEventListener('submit', function(e) {
    //prevent actual submit (the output flashed)
        e.preventDefault();

    //get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    //validate, make sure all fields are filled
    if(title ==='' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    }
    else {

    //instantiate a book
    const book = new Book(title, author, isbn);

    // add book to UI
    UI.addBookToList(book);

    // add book to storage
    Store.addBook(book);

    //show success message
    UI.showAlert('Book Added', 'success')

    //Clear fields
    UI.clearFields();
    }
});


// Event: Remove a Book in Ui and storage
document.getElementById('book-list').addEventListener('click', function(e) {
    
    //remove book from UI
    UI.deleteBook(e.target);

    //remove book from storage
    Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);
    
    UI.showAlert('Book Deleted', 'success');
})