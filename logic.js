const spinner = document.getElementById("stockSpinner");
const button = document.getElementById(`searchButton`);
const header = document.getElementById(`header`);
const marqueeWrap = document.getElementById(`marqueeWrap`);

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
      }, 5000);
    });
});

function init() {
  const resultsOfCompany = document.getElementById("resultsOfCompany");
  while (resultsOfCompany.firstElementChild) {
    resultsOfCompany.removeChild(resultsOfCompany.firstElementChild);
  }
  CurrentStockMarquee();
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
    tagImg.classList.add("rounded", "mt-2", "mx-4");
    tagImg.style = "max-height:50px; max-width:50px;";
    let dailyChange = document.createElement("p");
    let percentChange = profileData.profile.changesPercentage;
    percentChange = Number(percentChange).toFixed(2);
    dailyChange.innerText = `(` + percentChange + `%` + `)`;
    if (percentChange > 0) dailyChange.classList.add("text-success");
    if (percentChange < 0) dailyChange.classList.add("text-danger");
    dailyChange.classList.add("pt-3", "mx-3");
    let tagLink = document.createElement("a");
    tagLink.href = ``;
    companyData.classList.add(
      "border-bottom",
      "border-grey",
      "border-0",
      "d-inline-block",
      "px-2",
      "fs-5"
    );
    let COMPANY_URL = "/company.html?symbol=" + data[i].symbol;
    tagLink.href = COMPANY_URL;
    let tag = document.createElement(`p`);
    tag.innerText = data[i].name + ` ` + " (" + data[i].symbol + ")";
    tag.classList.add("pt-3", "mx-2");
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
  let marquee = `${SERVER_BASE_URL}${SERVER_API}${DATA_REAL_TIME}`;
  console.log(marquee);
  const response = await fetch(marquee);
  let banner = await response.json();
  console.log(banner);
  for (i = 0; i > banner.length; i++) {
    let symbol = banner[i].ticker;
    let change = banner[i].change;
    let price = banner[i].price;
    console.log(banner[0].price);
    let marqueeBanner = document.createElement("span");
    marqueeBanner.append(symbol);
    marqueeBanner.append(change);
    marqueeBanner.append(price);
    marqueeWrap.appendChile(marqueeBanner);
  }
}
