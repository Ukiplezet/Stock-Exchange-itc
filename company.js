const companyProfile = document.getElementById(`companyProfile`);
const companyImage = document.getElementById(`companyImage`);
const companyName = document.getElementById(`companyName`);
const companyDescription = document.getElementById(`companyDescription`);
const companyLink = document.getElementById(`companyLink`);
const stockPrice = document.getElementById(`stockPrice`);
const stockChanges = document.getElementById(`stockChanges`);
const companyIndustry = document.getElementById(`companyIndustry`);
const changePercent = document.getElementById(`changePercent`);
const companyData = document.getElementById(`companyData`);
const spinner = document.getElementById(`stockSpinner`);
const chart = document.getElementById(`chart`);
const companyDescrpitionWrapper = document.getElementById(
  `companyDescrpitionWrapper`
);
const priceAndChangeAndLink = document.getElementById(`priceAndChangeAndLink`);

let urlParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlParams.entries());
let symbol = params.symbol;
let xlabels = [];
let closingPrice = [];

grabCompanyProfile(symbol);

async function grabStockHistory(symbol) {
  const STOCK_HISTORY = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
  try {
   await fetch(STOCK_HISTORY)
      .then((response) => {
        if (!response.ok) throw new TypeError("Personalized Error");
        return response.json();
      })
      .then((graph) => {
        for (let i in graph.historical) {
          xlabels.push(graph.historical[i].date);
          closingPrice.push(graph.historical[i].close);
        }
        getChart(graph);
      });
  } catch (e) {
    console.log(e);
  }
}

async function grabCompanyProfile(symbol) {
  const COMPANY_PROFILE = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
  try {
    const response = await fetch(COMPANY_PROFILE);
    const data = await response.json();
    spinner.classList.remove(`d-none`);
    companyData.classList.add(`d-none`);
    companyData.classList.add(`d-none`);
    await grabStockHistory(symbol);
    append(data);
    if (!response.ok)
      throw new TypeError("Error: something went terribly wrong!");
  } catch (e) {
    console.log(e);
  } finally {
    spinner.classList.add(`d-none`);
    companyData.classList.remove(`d-none`);
  }
}

function append(data) {
  companyName.innerText = data.profile.companyName;
  companyIndustry.innerText = `(` + data.profile.industry + `)`;
  companyImage.src = data.profile.image;
  companyImage.style = "max-height:70px; max-width:70px;";
  companyImage.onerror = function placeCage() {
    companyImage.src = "https://www.placecage.com/c/205/210";
  };
  companyImage.classList.add("rounded");
  companyDescription.innerText = data.profile.description;
  companyDescription.classList.add("bg-light", "rounded", "shadow-lg", "px-1");
  priceAndChangeAndLink.classList.add("me-4");
  companyDescrpitionWrapper.classList.add("border-start", "border-1", "ps-4");
  companyLink.innerText = `Website:  ` + data.profile.companyName;
  companyLink.href = data.profile.website;
  stockPrice.innerText = `Stock price: $` + data.profile.price;
  stockChanges.innerText = `` + `` + Number(data.profile.changes).toFixed(2);
  let percentOfChange = data.profile.changesPercentage;
  percentOfChange = Number(percentOfChange).toFixed(2);
  goodOrBad(percentOfChange);
  companyData.classList.add("border", "border-1", "shadow", "pb-2");
}

function goodOrBad(percentOfChange) {
  if (percentOfChange > 0) {
    stockChanges.classList.add("text-success", "fw-bold");
    changePercent.classList.add("text-success");
    changePercent.innerText = `(` + percentOfChange + `%` + `)`;
  }
  if (percentOfChange < 0) {
    stockChanges.classList.add("text-danger", "fw-bold");
    changePercent.classList.add("text-danger");
    changePercent.innerText = `(` + percentOfChange + `%` + `)`;
  }
}

function getChart(graph) {
  Chart.defaults.elements.line.borderWidth = 0;
  Chart.defaults.elements.point.radius = 2;
  Chart.defaults.elements.pointStyle = `line`;
  Chart.defaults.elements.line.stepped = true;
  Chart.defaults.elements.line.tension = 0;
  const ctx = document.getElementById(`chart`).getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xlabels.reverse(),
      datasets: [
        {
          label: graph.symbol,
          data: closingPrice.reverse(),
          backgroundColor: "rgba(169, 69, 69)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 0,
          borderRadius: 0,
        },
      ],
    },
    options: { responsive: true },
  });
  chart.classList.add("border", "border-2", "bg-light", "rounded", "shadow");
  chart.style = "max-height=800px; max-width=600px;";
}
