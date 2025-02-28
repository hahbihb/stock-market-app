import * as model from "./model.js";
import stockQuoteView from "./views/stockQuoteView.js";
import chartView from "./views/chartView.js";
import companyNewsView from "./views/companyNewsView.js";
import companyDescriptionView from "./views/companyDescriptionView.js";
import * as sqmodel from "./stockQuoteModel.js";
import * as utils from "./utils.js";
import relatedStocksView from "./views/relatedStocksView.js";
import searchView from "./views/searchView.js";
import searchSuggestionsView from "./views/searchSuggestionsView.js";
import * as config from "./config.js";

const localStorageqD = JSON.parse(
  localStorage.getItem("localStorageQuoteData")
);
const localStorageNews = JSON.parse(
  localStorage.getItem("localStorageCompanyNews")
);
const localStorageChart = JSON.parse(localStorage.getItem("localStorageChart"));

//LIGHT AND DARK MODE
const modeBtn = document.querySelector(".mode-btn");
const rootElement = document.documentElement;

const currentTheme = localStorage.getItem("theme") || "light";
if (currentTheme.includes("dark")) {
  rootElement.classList.add("dark-mode");
}

modeBtn.addEventListener("click", utils.toggleMode);

//MENU BTN
const menuBtn = document.querySelector(".menu-btn");
menuBtn.addEventListener("click", utils.menuToggler);

//INTERSECTION OBSERVER
const header = document.querySelector(".header");
const observer = document.querySelector(".observer");
utils.navObserver(header, observer);

//Search
const searchInput = document.querySelector(".search-input");
const searchSuggestions = document.querySelector(".search-suggestions");

searchInput.addEventListener("click", function () {
  searchSuggestions.classList.remove("hidden");
});

window.addEventListener("click", function (e) {
  if (!e.target.closest(".search-container")) {
    searchSuggestions.classList.add("hidden");
  }
});

//SEARCH SUGGESTIONS

const controlSearchSuggestions = async function () {
  //get query
  const input = searchView;
  const query = input.getQuery();
  if (!query) return;

  const results = await model.getSearchResults(query);

  //Render Search Suggestions
  searchSuggestionsView.render(
    results.result.slice(0, config.SEARCH_SUGGESTIONS_AMT)
  );
};

let quoteQuery = model.getQueryParam("symbol");

const controlStockQuote = async function (symbol) {
  try {
    //Render Spinner
    stockQuoteView.renderSpinner();
    companyDescriptionView.renderSpinner();

    //Check if quote data is in local storage
    if (
      localStorageqD &&
      localStorageqD.some((stock) => stock.ticker === symbol)
    ) {
      sqmodel.getCompanyQuoteFromLocalStorage(symbol);
    } else {
      await sqmodel.getCompanyQuote(symbol);
    }

    //Render Stock Quote
    stockQuoteView.render(sqmodel.sqstate.quoteData);
    companyDescriptionView.render(sqmodel.sqstate.quoteData);

    //Render Related Stocks
    controlRelatedStocks(sqmodel.sqstate.quoteData);
  } catch (err) {
    console.error(err);
    stockQuoteView.renderError(err.message);
  }
};

//CHART

const controlChartData = async function (symbol) {
  try {
    //Check if quote data is in local storage and get data accordingly
    if (
      localStorageChart &&
      localStorageChart.some((stock) => stock.symbol === symbol)
    ) {
      sqmodel.getStockChartFromLocalStorage(symbol);
    } else {
      await sqmodel.getStockChart(symbol, "1D");
    }
    //Get Chart Data for 1 day
    chartView.render(sqmodel.sqstate.price);
    const ctx = document.getElementById("myChart");

    //Create and Render Chart Accordingly
    utils.createChart(
      ctx,
      sqmodel.sqstate.price.priceData.map((a) => a.close),
      sqmodel.sqstate.price.chartLabels.map((a) =>
        a.split(" ").at(-1).slice(0, 5)
      )
    );
  } catch (err) {
    chartView.renderError(err.message);
  }
};

const controlChartChange = async function (period) {
  try {
    //Get Chart Data for selected period
    await sqmodel.getStockChart(quoteQuery, period);
    chartView.render(sqmodel.sqstate.price);
    chartView.adjustSelectedDropdown(period);
    const ctx = document.getElementById("myChart");

    //Create and Render Chart Accordingly
    utils.createChart(
      ctx,
      sqmodel.sqstate.price.priceData.map((a) => a.close),
      period === "1D"
        ? sqmodel.sqstate.price.chartLabels.map((a) =>
            a.split(" ").at(-1).slice(0, 5)
          )
        : sqmodel.sqstate.price.chartLabels.map((a) => a.slice(2, -3))
    );
  } catch (err) {
    chartView.renderError(err.message);
  }
};

const controlWatchlist = async function (btn, symbol) {
  utils.disableButton(btn);
  let func;
  let msg;

  //Check if item is watchlisted and add or remove from watchlist
  if (!btn.classList.contains("watchlisted")) {
    await model.addToWatchlist(symbol);
    func = "add";
    msg = "Added to Watchlist";
  } else {
    model.removeFromWatchlist(symbol);
    func = "remove";
    msg = "Removed from Watchlist";
  }

  //Get data and update views to show watchlisted status
  await sqmodel.getCompanyQuote(symbol);
  stockQuoteView.renderToast(func, msg);
  stockQuoteView.update(sqmodel.sqstate.quoteData);

  utils.enableButton(btn);
};

const controlCompanyNews = async function (symbol) {
  companyNewsView.renderSpinner();

  if (
    localStorageNews &&
    localStorageNews.some((stock) => stock.symbol === symbol)
  ) {
    sqmodel.getCompanyNewsFromLocalStorage(symbol);
  } else {
    await sqmodel.getCompanyNews(symbol);
  }

  //Render Company News
  companyNewsView.render(sqmodel.sqstate.stockNews);
};

const controlRelatedStocks = async function (stock) {
  try {
    //Render Spinner
    relatedStocksView.renderSpinner();

    //Get Related Stocks
    await sqmodel.getRelatedStocks(stock.category);

    //Render Related Stocks
    relatedStocksView.render(sqmodel.sqstate.related);
  } catch (err) {
    relatedStocksView.renderError(err);
    throw err;
  }
};

controlStockQuote(quoteQuery);
controlCompanyNews(quoteQuery);
controlChartData(quoteQuery);
stockQuoteView.addHandlerWatchlist(controlWatchlist);
chartView.addHandlerChangePeriod(controlChartChange);
searchView.addHandlerInput(controlSearchSuggestions);
