class Marquee {
  marquee;
  marqueeWrap;
  marquee_url;

  // Unique properties through the constructor
  constructor(marquee) {
    this.marquee = marquee;
    this.getAllConsts();
    this.CurrentStockMarquee();
    // this.appendMarquee();
  }

  // Shared methods, THE PROTOTYPE!!!
  getAllConsts() {
    this.marquee = document.getElementById(`marquee`);
    this.marquee_url = `${SERVER_BASE_URL}${SERVER_API}${DATA_REAL_TIME}`;
  }
  async CurrentStockMarquee() {
    const response = await fetch(this.marquee_url);
    let banner = await response.json();
    let marqueeWrap = document.createElement("div");
    let marqueeBanner = document.createElement("span");
    marqueeWrap.classList.add("marqueeWrap");
    marqueeWrap.appendChild(marqueeBanner);
    this.marquee.append(marqueeWrap);

    for (let i = 0; i < banner.length; i++) {
      let companyTicker = document.createElement("p");
      companyTicker.innerHTML = banner[i].ticker;
      let currentChange = document.createElement("p");
      let currentPrice = document.createElement("p");
      currentPrice.innerHTML = banner[i].price + `$`;
      currentChange.innerHTML = Number(banner[i].changesPercentage).toFixed(2);
      if (currentChange.innerText > 0) {
        currentChange.innerHTML =
          `+` + Number(banner[i].changesPercentage).toFixed(2) + `%`;
        currentChange.classList.add("text-success");
      }
      if (currentChange.innerText < 0) {
        currentChange.innerHTML =
          Number(banner[i].changesPercentage).toFixed(2) + `%`;
        currentChange.classList.add("text-danger");
      }
      companyTicker.classList.add("ms-3", "flex-row-nowrap");
      currentChange.classList.add("mx-1", "flex-row-nowrap");
      currentPrice.classList.add("ms-1", "me-1", "flex-row-nowrap");
      marqueeBanner.classList.add("d-flex", "flex-row-nowrap");
      marqueeBanner.append(companyTicker);
      marqueeBanner.append(currentChange);
      marqueeBanner.append(currentPrice);
    }
  }
}
const marqueeNode = document.getElementById(`marquee`);
const marquee = new Marquee(marqueeNode);
