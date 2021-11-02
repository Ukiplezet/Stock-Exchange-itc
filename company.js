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
const spinner = document.getElementById("stockSpinner");
let urlParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlParams.entries());
let symbol = params.symbol;
let xlabels = [];
let closingPrice = [];

grabCompanyProfile(symbol);

async function grabStockHistory(symbol) {
  const STOCK_HISTORY = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
  try {
    fetch(STOCK_HISTORY)
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
    if (!response.ok) throw new TypeError("Personalized Error");
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      spinner.classList.add(`d-none`);
      companyData.classList.remove(`d-none`);
    }, 1000);
  }
}

function append(data) {
  companyName.innerText = data.profile.companyName;
  companyIndustry.innerText = `(` + data.profile.industry + `)`;
  companyImage.src = data.profile.image;
  companyImage.onerror = function placeCage() {
    companyImage.src = "https://www.placecage.com/c/205/210";
  };
  companyImage.classList.add("rounded");
  companyImage.style = "height:130px; width:150px;";
  companyDescription.innerText = data.profile.description;
  companyLink.innerText = data.profile.companyName;
  companyLink.href = data.profile.website;
  stockPrice.innerText = `Stock price: $` + data.profile.price;
  stockChanges.innerText = `` + `` + data.profile.changes;
  let percentChange = data.profile.changesPercentage;
  goodOrBad(stockChanges);
  percentChange = Number(percentChange).toFixed(2);
  changePercent.innerText = `(` + percentChange + `%` + `)`;
}

function goodOrBad(percentChange) {
  if (percentChange.innerText > 0) {
    stockChanges.classList.add("text-success", "fw-bold");
    changePercent.classList.add("text-success");
  }
  if (stockChanges.innerText < 0) {
    stockChanges.classList.add("text-danger", "fw-bold");
    changePercent.classList.add("text-danger");
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
  });
}
