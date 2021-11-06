class SearchForm {
  searchForm;
  constructor(searchForm) {
    this.searchForm = searchForm;
    this.createSearchForm();
  }

  createSearchForm() {
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("d-flex", "justify-content-center");
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("d-flex", "mb-3");
    const userInput = document.createElement("input");
    userInput.id = `userInput`;

    userInput.classList.add("form-control", "w-25", "d-flex");
    userInput.setAttribute("type", "search");
    userInput.placeholder = "Search Stock...";
    userInput.autocomplete = "on";
    const button = document.createElement("span");
    button.classList.add("btn");
    button.innerText = `Search`;
    button.id = `button`;

    inputContainer.append(inputGroup);
    inputContainer.append(userInput);
    inputContainer.append(button);
    this.searchForm.appendChild(inputContainer);
  }
}

// const searchNode = document.getElementById(`searchForm`);
// const searchForm = new SearchForm(searchNode);
