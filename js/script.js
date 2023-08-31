let library = [
    {
        title: "1984",
        author: "George Orwell",
        pages: "304",
        read: false,
    }
];
const hiddenBtn = document.querySelector(".btn");
const addBook = document.querySelector(".newbook");
const table = document.querySelector(".table");
const tbody = document.querySelector("tbody");
//a div tag wrap form element
const form = document.querySelector(".form");
const titleData = document.querySelector("#title");
const authorData = document.querySelector("#author");
const pagesData = document.querySelector("#pages");
const submitBtn = document.querySelector("#submit");
const returnBtn = document.querySelector("#return");

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(book) {
    let title = titleData.value;
    let author = authorData.value;
    let pages = pagesData.value;
    let read = getReadValue();
    let newbook = new Book(title, author, pages, read);
    library.push(newbook);
}

const getReadValue = () => {
    let readValue = document.querySelector("input[name='read']:checked").value;
    return readValue === 'yes';
};

const setStorage = () =>
    localStorage.setItem('library', JSON.stringify(library));

const getStorage = () => 
    library = JSON.parse(localStorage.getItem('library'));

const toggleHiddenElements = () => {
    form.classList.toggle("hidden");
    table.classList.toggle("hidden");
    hiddenBtn.classList.toggle("hidden");
};

const addError = (e) => {
    let div = document.createElement("div");
    div.textContent = `Please fill out this ${e.id}`;
    div.id = `${e.id}Error`;
    div.classList.add("error");
    form.insertBefore(div, e.nextSibling);
    e.classList.add("errorInput");
    e.addEventListener('input', removeError);
};

const removeError = (e) => {
    if (e.target.value != "") {
        e.target.removeEventListener('input', removeError);
        e.target.classList.remove('errorInput');
        document.querySelector(`#${e.target.id}Error`).remove();
    }
}


const validateForm = () => {
    if (titleData.value === '' && document.querySelector('#titleError') === null)
        addError(titleData);
    if (authorData.value === '' && document.querySelector('#authorError') === null)
        addError(authorData);
    if (pagesData.value === '' && document.querySelector('#pagesError') === null)
        addError(pagesData);
    return !(titleData.value === '' || authorData.value === '' || pagesData.value === '');
};


const clearForm = () => {
    titleData.value = '';
    authorData.value = '';
    pagesData.value = '';
};

const updateTable = () => {
    tbody.textContent = "";

    library.forEach((book, index) => {
        let row = document.createElement("tr"); 
        Object.keys(book).forEach(key => {
            let newTd = document.createElement("td");
            newTd.textContent = book[key];
            if (key == 'read')
                newTd.textContent = book[key] ? 'Read' : 'Not read';
            row.appendChild(newTd);
        
        });
        
        row.appendChild(setReadButton(book));
        row.appendChild(setEditButton(book));
        row.appendChild(setDeleteButton(index));
        tbody.appendChild(row);
    });
    setStorage();
};

const setReadButton = (book) => {
    let readStatusTd = document.createElement("td");
    let readStatusBtn = document.createElement("button");
    readStatusBtn.textContent = 'Change read status';
    readStatusBtn.addEventListener('click', ()=> {
        book.read = !book.read;
        updateTable();
    });
    readStatusTd.appendChild(readStatusBtn);
    return readStatusTd;
};

const removeFromLibrary = (index) => {
    library.splice(index, 1);
    submitBtn.removeEventListener('click', removeFromLibrary);
    updateTable();
};


const setEditButton = (book) => {
    let editTd = document.createElement("td");
    let editBtn = document.createElement("button");
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
        titleData.value = book.title;
        authorData.value = book.author;
        pagesData.value = book.pages;
        if (book.read)
            document.querySelector("input[value='yes']").checked = true;
        else
            document.querySelector("input[value='no']").checked = true;
        toggleHiddenElements();
        submitBtn.addEventListener('click', removeFromLibrary);
    });
    editTd.appendChild(editBtn);
    return editTd;
};

const setDeleteButton = (index) => {
    let deleteTd = document.createElement("td");
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        removeFromLibrary(index);
    });
    deleteTd.appendChild(deleteBtn);
    return deleteTd;
}

document.addEventListener("DOMContentLoaded", () => {
    pagesData.addEventListener('input', () => {
        if(!pagesData.validity.valid)
            pagesData.value = '';
    });
    addBook.addEventListener('click', toggleHiddenElements);
    submitBtn.addEventListener('click', () => {
        if (validateForm()) {
            addBookToLibrary();
            updateTable();
            toggleHiddenElements();
            setStorage();
            clearForm();
        } else {
            return false;
        }
    });

    returnBtn.addEventListener('click', () => {
        toggleHiddenElements();
        clearForm();
    });

    if (localStorage.getItem('library')){
        getStorage();
    } else {
        setStorage();
    }

    updateTable();
});