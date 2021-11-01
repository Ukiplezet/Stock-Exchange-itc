const companyProfile = document.getElementById(`companyProfile`);
const companyImage = document.getElementById(`companyImage`);
const companyName = document.getElementById(`companyName`);
const companyDescription = document.getElementById(`companyDescription`);
const companyLink = document.getElementById(`companyLink`);
const stockPrice = document.getElementById(`stockPrice`);
const stockChanges = document.getElementById(`stockChanges`);
const companyIndustry = document.getElementById(`companyIndustry`);
const changePercent = document.getElementById(`changePercent`);

const spinner = document.getElementById("stockSpinner");
let urlParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlParams.entries());
let symbol = params.symbol;

function grabCompanyProfile(symbol) {
  const COMPANY_PROFILE = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
  fetch(COMPANY_PROFILE)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      companyName.innerText = data.profile.companyName;
      companyIndustry.innerText = `(` + data.profile.industry + `)`;
      companyImage.src = data.profile.image;
      companyDescription.innerText = data.profile.description;
      companyLink.innerText = data.profile.website;
      companyLink.innerHTML = data.profile.companyName;
      companyLink.href = companyLink.innerText;
      stockPrice.innerText = `Stock price: $` + data.profile.price;
      stockChanges.innerText = `` + `` + data.profile.changes;
      changePercent.innerText = `(` + data.profile.changesPercentage + `)`;
      goodOrBad(stockChanges);
    });
}
function goodOrBad(stockChanges) {
  if (stockChanges.innerText > 0) {
    stockChanges.classList.add("text-success", "fw-bold");
    changePercent.classList.add("text-success");
  }
  if (stockChanges.innerText < 0) {
    stockChanges.classList.add("text-danger", "fw-bold");
    changePercent.classList.add("text-danger");
  }
}
function grabStockHistory(symbol) {
  const STOCK_HISTORY = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
  try {
    fetch(STOCK_HISTORY)
      .then((response) => {
        if (!response.ok) throw new TypeError("Personalized Error");
        return response.json();
      })
      .then((graph) => {
        console.log(graph);
        for (let i = 0; i < graph.historical.length; i++) {
          const labels = graph.historical[i].date;
          const data = {
            labels: graph.historical[i].date,
            datasets: [
              {
                label: graph.symbol,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: [
                  0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600,
                  650, 700, 750, 800, 850, 900, 950, 1000,
                ],
              },
            ],
          };
        }
        const config = {
          type: "line",
          data: graph,
          options: {},
        };

        const myChart = new Chart(document.getElementById("myChart"), config);
      });
  } catch (e) {
    console.log(e);
  }
}

grabCompanyProfile(symbol);
grabStockHistory(symbol);
