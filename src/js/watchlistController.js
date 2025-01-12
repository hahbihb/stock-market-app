import * as utils from "./utils.js";
import * as model from "./model.js";
import searchView from "./views/searchView.js";
import searchSuggestionsView from "./views/searchSuggestionsView.js";
import watchlistView from "./views/watchlistView.js";
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
  if (!btn.classList.contains("watchlisted")) {
    await model.addToWatchlist(symbol);
    watchlistView.renderToast("add", "Added to Watchlist");
  } else {
    model.removeFromWatchlist(symbol);
    watchlistView.renderToast("remove", "Removed from Watchlist");
  }

  watchlistView.render(model.state.watchlist);
};

const controlInitialWatchlistView = async function () {
  try {
    watchlistView.renderSpinner();
    watchlistView.render(model.state.watchlist);
  } catch (err) {
    watchlistView.renderError(err.message);
  }
};

const controlSort = function (header, sortProperty) {
  const array = model.state.watchlist;
  const view = watchlistView;

  utils.sortTable(view, array, sortProperty);
};

controlInitialWatchlistView();
watchlistView.addHandlerSort(controlSort);
searchView.addHandlerInput(controlSearchSuggestions);
watchlistView.addHandlerWatchlist(controlWatchlist);
