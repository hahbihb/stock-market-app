import * as utils from "./utils.js";
import * as model from "./model.js";
import searchView from "./views/searchView.js";
import searchSuggestionsView from "./views/searchSuggestionsView.js";
import popularStockView from "./views/popularStockView.js";
import watchlistView from "./views/watchlistView.js";
import homeNewsView from "./views/homeNewsView.js";

let loadedFromLocalStorage;
const lastUpdated = localStorage.getItem("lastUpdated");
const localstorageNews = JSON.parse(localStorage.getItem("localStorageNews"));
const localStoragePopular = JSON.parse(
  localStorage.getItem("localStoragePopular")
);

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
console.log("Somthing changed");
//SEARCH SUGGESTIONS

const controlSearchSuggestions = async function () {
  //get query
  const input = searchView;
  const query = input.getQuery();
  if (!query) return;

  const results = await model.getSearchResults(query);

  searchSuggestionsView.render(results.result.slice(0, 10));
};

const controlWatchlist = async function (btn, symbol) {
  utils.disableButton(btn);

  //Check if item is watchlisted
  if (!btn.classList.contains("watchlisted")) {
    await model.addToWatchlist(symbol);
    watchlistView.renderToast("add", "Added to Watchlist");
  } else {
    model.removeFromWatchlist(symbol);
    watchlistView.renderToast("remove", "Removed from Watchlist");
  }

  // Add watchlist header if watchlist is not empty
  if (
    model.state.watchlist.length > 0 &&
    !watchlistView.isWatchlistHeaderRendered()
  )
    watchlistView.renderWatchlistHeader();

  //Check if item was loaded from Local Storage
  loadedFromLocalStorage
    ? model.renderPopularFromStorage()
    : model.renderPopularStocks();

  //Update Views to show watchlisted status
  popularStockView.render(model.state.popular);
  watchlistView.render(model.state.watchlist.slice(0, 3));

  //Remove watchlist header  if watchlist is empty
  if (model.state.watchlist.length === 0) watchlistView.clearWatchlistHeader();

  //Add "see all" button if watchlist > 3
  if (model.state.watchlist.length > 3) watchlistView.renderSeeAllLink();
  else watchlistView.clearSeeAllLink();
};

const controlInitialWatchlistView = async function () {
  try {
    //Render Loading Screen
    watchlistView.renderSpinner();

    //Check if it's Weekend or If User Updated it last within an Hour
    if (utils.isWithinAnHour(lastUpdated) || utils.isWeekend()) {
      //get watchlist info from localStorage
      watchlistView.render(model.state.watchlist.slice(0, 3));
    } else {
      //get watchlist info dynamically
      await Promise.all(
        model.state.watchlist.map((el) => {
          model.updateWatchlist(el.ticker);
        })
      );

      //Render Watchlist
      watchlistView.render(model.state.watchlist.slice(0, 3));
    }
    //Remove watchlist header  if watchlist is empty
    if (model.state.watchlist.length === 0)
      watchlistView.clearWatchlistHeader();

    //Add "see all" button if watchlist > 3
    if (model.state.watchlist.length > 3) watchlistView.renderSeeAllLink();
  } catch (err) {
    watchlistView.renderError(err.message);
  }
};

const controlInitialNewsView = async function () {
  try {
    //Render Loading Screen
    homeNewsView.renderSpinner();

    // Check if it's Weekend or If User Updated it last within an Hour
    if (
      (utils.isWithinAnHour(lastUpdated) || utils.isWeekend()) &&
      localstorageNews
    ) {
      homeNewsView.render(localstorageNews);
      loadedFromLocalStorage = true;
    } else {
      await model.getGeneralNews();
      homeNewsView.render(model.state.news);
      loadedFromLocalStorage = false;
    }
  } catch (err) {
    homeNewsView.renderError(err.message);
  }
};

const controlInitialPopularView = async function () {
  try {
    //Render Loading Screen
    popularStockView.renderSpinner();

    //Check if it's Weekend or If User Updated it last within an Hour
    if (
      (utils.isWithinAnHour(lastUpdated) || utils.isWeekend()) &&
      localStoragePopular
    ) {
      model.renderPopularFromStorage();
    } else {
      await model.renderPopularStocks();

      //Remove QuoteData Array From Local Storage
      localStorage.removeItem("localStorageQuoteData");
    }

    //Render Popular Stocks
    popularStockView.render(model.state.popular);
  } catch (err) {
    console.error(err);
    popularStockView.renderError(err.message);
  }
};

const controlSort = function (header, sortProperty) {
  let array;
  let view;

  //Check what table is being sorted and update parameters accordingly
  if (header.classList.contains("watchlist-table-head")) {
    array = model.state.watchlist.slice(0, 3);
    view = watchlistView;
  } else if (header.classList.contains("popular-table-head")) {
    array = model.state.popular;
    view = popularStockView;
  }

  //Sort Array
  utils.sortTable(view, array, sortProperty);
};

controlInitialNewsView();
controlInitialPopularView();
controlInitialWatchlistView();
popularStockView.addHandlerSort(controlSort);
watchlistView.addHandlerSort(controlSort);
searchView.addHandlerInput(controlSearchSuggestions);
popularStockView.addHandlerWatchlist(controlWatchlist);
watchlistView.addHandlerWatchlist(controlWatchlist);
