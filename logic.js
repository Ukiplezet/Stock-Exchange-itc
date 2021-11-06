// const spinner = document.getElementById("stockSpinner");
let button = document.getElementById(`button`);
// const header = document.getElementById(`header`);
// const companiesContent = document.getElementById(`companiesContent`);

button.addEventListener(`click`, async () => {
  let userInput = document.getElementById("userInput").value;
  let query = `search?query=${userInput}&${LIST_LIMIT}&${EXCHANGE}`;
  init(resultsOfCompany);
  let url = `${SERVER_BASE_URL}${SERVER_API}${query}`;
  let result = fetch(url)
    .then((response) => { 
      spinner.classList.remove("d-none");
      listOfCompanies.classList.add("d-none");
      return response.json();
    })
    .then((data) => {
      JSON.stringify(data);
      getTheProfile(data);
    })
    .finally(() => {
      setTimeout(() => {
        listOfCompanies.classList.add(
          "bg-light",
          "border",
          "border-1",
          "border-grey",
          "shadow-lg"
        );
        spinner.classList.add("d-none");
        listOfCompanies.classList.remove("d-none");
      }, 5000);
    });
});

function init() {
  const resultsOfCompany = document.getElementById("resultsOfCompany");
  while (resultsOfCompany.firstElementChild) {
    resultsOfCompany.removeChild(resultsOfCompany.firstElementChild);
  }
  listOfCompanies.classList.add("d-none");
  spinner.classList.remove("border");
}

async function getTheProfile(data) {
  for (let i = 0; i < 10; i++) {
    let symbol = data[i].symbol;
    let COMPANY_PROFILE = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
    const answer = await fetch(COMPANY_PROFILE);
    let profileData = await answer.json();
    let companyData = document.createElement("li");
    companyData.classList.add("d-flex", "flex-row");
    let companyList = document.getElementById(`resultsOfCompany`);
    let tagImg = document.createElement("img");
    tagImg.src = profileData.profile.image;
    tagImg.onerror = function placeCage() {
      tagImg.src = "https://www.placecage.com/c/200/200";
    };
    tagImg.classList.add("rounded", "mt-2", "mx-2", "pt-1");
    tagImg.style = "max-height:25px; max-width:25px;";
    let dailyChange = document.createElement("p");
    let percentChange = profileData.profile.changesPercentage;
    percentChange = Number(percentChange).toFixed(2);
    dailyChange.innerText = `(` + percentChange + `%` + `)`;
    if (percentChange > 0) dailyChange.classList.add("text-success");
    if (percentChange < 0) dailyChange.classList.add("text-danger");
    dailyChange.classList.add("me-1", "mt-2", "ms-3");
    let tagLink = document.createElement("a");
    tagLink.href = ``;
    companyData.classList.add(
      "border-bottom",
      "border-grey",
      "border-0",
      "px-2",
      "py-0"
    );
    let COMPANY_URL = "/company.html?symbol=" + data[i].symbol;
    tagLink.href = COMPANY_URL;
    let tag = document.createElement(`p`);
    tag.innerText = data[i].name + ` ` + " (" + data[i].symbol + ")";
    tag.classList.add("mt-2");
    tagLink.appendChild(tag);
    companyData.append(tagImg);
    companyData.append(tagLink);
    companyData.append(dailyChange);
    companyList.append(companyData);
    let urlParams = new URLSearchParams(COMPANY_URL);
    urlParams.get(symbol);
  }
}
