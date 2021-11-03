const spinner = document.getElementById("stockSpinner");
const button = document.getElementById(`searchButton`);
const header = document.getElementById(`header`);
const marqueeWrap = document.getElementById(`marqueeWrap`);
const companiesContent = document.getElementById(`companiesContent`);

CurrentStockMarquee();

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
        spinner.classList.add("d-none");
        listOfCompanies.classList.remove("d-none");
        companiesContent.classList.add(
          "bg-light",
          "border",
          "border-1",
          "border-grey"
        );
      }, 5000);
    });
});

function init() {
  const resultsOfCompany = document.getElementById("resultsOfCompany");
  while (resultsOfCompany.firstElementChild) {
    resultsOfCompany.removeChild(resultsOfCompany.firstElementChild);
  }
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
      tagImg.src = "https://www.placecage.com/c/205/210";
    };
    tagImg.classList.add("rounded", "mt-2", "me-2");
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
      "d-inline-block",
      "px-2"
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

async function CurrentStockMarquee() {
  let marquee_url = `${SERVER_BASE_URL}${SERVER_API}${DATA_REAL_TIME}`;
  const response = await fetch(marquee_url);
  let banner = await response.json();
  console.log(marquee_url);
  for (i = 0; i < banner.length; i++) {
    let companyTicker = document.createElement("p");
    companyTicker.innerHTML = banner[i].ticker;
    let currentChange = document.createElement("p");
    currentChange.innerHTML = banner[i].changesPercentage;
    let currentPrice = document.createElement("p");
    currentPrice.innerHTML = banner[i].price + `$`;
    if (currentChange.innerText > 0)
      currentChange.classList.add("text-success");
    if (currentChange.innerText < 0) currentChange.classList.add("text-danger");
    let marqueeBanner = document.createElement("span");
    companyTicker.classList.add("ms-3", "flex-row-nowrap");
    currentChange.classList.add("mx-1", "flex-row-nowrap");
    currentPrice.classList.add("ms-1", "me-1", "flex-row-nowrap");
    marqueeBanner.classList.add("d-flex", "flex-row-nowrap");
    marqueeBanner.append(companyTicker);
    marqueeBanner.append(currentChange);
    marqueeBanner.append(currentPrice);
    marqueeWrap.appendChild(marqueeBanner);
  }
}
