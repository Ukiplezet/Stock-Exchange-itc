class SearchResults {
  results;
  static appendedResultCount = 0;
  // compnies;
  constructor(results) {
    this.results = results;
    this.init();
    SearchResults.appendedResultCount += 1;
  }

  createSearchResults(companies) {
    const spinner = document.createElement("stockSpinner");
    spinner.id = `stockSpinner`;
    spinner.classList.add(
      "spinner-grow",
      "text-primary",
      "d-none",
      "justify-content-center",
      "my-5",
      "me-5",
      "px-5",
      "py-5"
    );
    const searchResult = document.createElement("div");
    searchResult.id = `searchRsult`;
    searchResult.classList.add("d-flex", "justify-content-center", "flex-row");
    const companiesContent = document.createElement("div");
    companiesContent.id = `companiesContent`;

    companiesContent.classList.add("d-flex", "rounded");

    const listOfCompanies = document.createElement("div");
    listOfCompanies.id = `listOfCompanies`;
    listOfCompanies.classList.add(
      "d-flex",
      "flex-row",
      "bg-light",
      "border",
      "border-1",
      "border-grey",
      "shadow-lg",
      "justify-content-center"
    );
    const resultsOfCompany = document.createElement("ul");
    resultsOfCompany.id = `resultsOfCompany`;
    resultsOfCompany.classList.add("d-flex", "flex-column", "list-unstyled");
    this.results.appendChild(searchResult);
    searchResult.append(spinner);
    searchResult.append(companiesContent);
    companiesContent.append(listOfCompanies);
    listOfCompanies.append(resultsOfCompany);
    fetchCompanies(companies);
  }
  init() {
    if (this.appendedResultCount < 1) {
      const searchResult = document.getElementById(`searchResult`);
      console.log(appendedResultCount);

      this.results.removeChild(this.results.firstElementChild);
    }
    //   listOfCompanies.classList.add("d-none");
    //   const spinner = document.getElementById(`stockSpinner`);
    //   spinner.classList.remove("border");
  }
}

// const resultsNode = document.getElementById(`results`);
// const results = new SearchResults(resultsNode);

async function fetchCompanies() {
  const spinner = document.getElementById(`stockSpinner`);
  spinner.classList.remove("d-none");
  listOfCompanies.classList.add("d-none");
  let userInput = document.getElementById(`userInput`).value;
  let query = `search?query=${userInput}&${LIST_LIMIT}&${EXCHANGE}`;
  let url = `${SERVER_BASE_URL}${SERVER_API}${query}`;
  try {
    const result = await fetch(url);
    const companies = await result.json();

    await getTheProfile(companies);
  } catch (e) {
    console.log(`error on fetching data`);
  } finally {
    spinner.classList.add("d-none");
    listOfCompanies.classList.remove("d-none");
  }
}

async function getTheProfile(companies) {
  for (let i = 0; i < 10; i++) {
    let symbol = companies[i].symbol;
    let COMPANY_PROFILE = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
    const answer = await fetch(COMPANY_PROFILE);
    let profileData = await answer.json();
    let companyData = document.createElement("li");
    companyData.classList.add("d-flex", "flex-row");
    //   let companyList = document.getElementById(`resultsOfCompany`);
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
    let COMPANY_URL = "/company.html?symbol=" + companies[i].symbol;
    tagLink.href = COMPANY_URL;
    let tag = document.createElement(`p`);
    tag.innerText = companies[i].name + ` ` + " (" + companies[i].symbol + ")";
    tag.classList.add("mt-2");
    tagLink.appendChild(tag);
    companyData.append(tagImg);
    companyData.append(tagLink);
    companyData.append(dailyChange);
    resultsOfCompany.append(companyData);
    let urlParams = new URLSearchParams(COMPANY_URL);
    urlParams.get(symbol);
  }
}
