const spinner = document.getElementById("stockSpinner");

button.addEventListener(`click`, () => {
  let userInput = document.getElementById("userInput").value;
  let query = `search?query=${userInput}&${LIST_LIMIT}&${EXCHANGE}`;

  init(resultsOfCompany);
  console.log(userInput);
  let url = `${SERVER_BASE_URL}${SERVER_API}${query}`;
  let result = fetch(url)
    .then((response) => {
      spinner.classList.remove("d-none");
      return response.json();
    })
    .then((data) => {
      JSON.stringify(data);
      for (let i = 0; i < 10; i++) {
        let tagLink = document.createElement("a");
        let COMPANY_URL = "/company.html?symbol=" + data[i].symbol;
        console.log(data[i].symbol);
        tagLink.href = COMPANY_URL;
        let tag = document.createElement(`li`);
        tag.innerText = data[i].name + " (" + data[i].symbol + ")";
        tagLink.appendChild(tag);
        tag.classList.add(
          "border-bottom",
          "border-grey",
          "border-0",
          "d-inline-block",
          "px-2",
          "pb-2",
          "mt-2",
          "mx-2",
          "fs-5"
        );
        document.getElementById(`resultsOfCompany`).appendChild(tagLink);
      }
    })
    .finally(() => {
      spinner.classList.add("d-none");
    });
});

function init() {
  const resultsOfCompany = document.getElementById("resultsOfCompany");
  while (resultsOfCompany.firstElementChild) {
    resultsOfCompany.removeChild(resultsOfCompany.firstElementChild);
  }
}
