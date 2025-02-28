import * as config from "./config.js";
import * as utils from "./utils.js";

export const state = {
  search: {
    query: "",
    suggestions: [],
    results: [],
  },
  watchlist: [],
  stockInfo: {},
  popular: [],
  news: [],
};

function initStorage() {
  const storage = localStorage.getItem("watchlist");

  if (storage) {
    state.watchlist = JSON.parse(storage);
  }
}
initStorage();

const createCompanyProfile = function (data1, data2) {
  return {
    name: data1.name,
    marketCap: data1.marketCapitalization,
    ticker: data1.ticker,
    logo: data1.logo,
    industry: data1.finnhubIndustry,
    exchange: data1.exchange,
    currentPrice: data2.currentPrice,
    previousPrice: data2.previousDayPrice,
    prevMthPrice: data2.prevMthPrice,
    dailyPriceInc: data2.dailyPriceInc,
    mthPriceInc: data2.mthPriceInc,
    watchlisted: false,
  };
};

export const checkWatchlist = function (data) {
  if (state.watchlist.some((stock) => stock.ticker === data.ticker))
    data.watchlisted = true;
  else data.watchlisted = false;
};

export async function getSearchResults(query, exchange = "US") {
  try {
    const data = await utils.fetchApiData(
      `${config.FINNHUB_URL}search?q=${query}&exchange=${exchange}&token=${config.FINNHUB_API_KEY}`,
      "",
      "",
      "finnhub"
    );

    return data;
  } catch (err) {
    throw err;
  }
}

export async function getCompanyData(symbol) {
  try {
    const profileData = await utils.fetchApiData(
      `${config.FINNHUB_URL}stock/profile2?symbol=${symbol}&token=${config.FINNHUB_API_KEY}`,
      "",
      "",
      "finnhub"
    );
    const priceData = await getCurrentPriceData(symbol);
    const data = createCompanyProfile(profileData, priceData);

    //check if item's in watchlist and update accordingly
    checkWatchlist(data);

    return data;
  } catch (err) {
    throw err;
  }
}

export function getQueryParam(param) {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const persistWatchlist = function () {
  localStorage.setItem("watchlist", JSON.stringify(state.watchlist));
};

export async function addToWatchlist(stockSymbol) {
  const stock = await getCompanyData(stockSymbol);
  stock.watchlisted = true;
  state.watchlist.push(stock);

  persistWatchlist();
}

export function removeFromWatchlist(stockSymbol) {
  const index = state.watchlist.findIndex((el) => el.ticker === stockSymbol);

  if (index !== -1) {
    state.watchlist.splice(index, 1);
  }

  persistWatchlist();
}

export async function updateWatchlist(symbol) {
  try {
    const updatedStock = await getCompanyData(symbol);

    //Find and update watchlist price data
    const el = state.watchlist.find((el) => el.ticker === symbol);
    el.currentPrice = updatedStock.currentPrice;
    el.previousPrice = updatedStock.previousPrice;
    el.prevMthPrice = updatedStock.prevMthPrice;
    el.marketCap = updatedStock.marketCap;

    persistWatchlist();
  } catch (err) {
    throw err;
  }
}

const clearBookmarks = function () {
  localStorage.clear();
};
// clearBookmarks();

export async function initStocks() {
  const companies = ["AAPL", "TSLA", "MSFT", "GOOGL", "NVDA", "META"];
  const batchSize = 4;

  const popular = await utils.fetchInBatches(
    companies,
    batchSize,
    getCompanyData
  );

  return popular;
}

export function renderPopularFromStorage() {
  const popular = JSON.parse(localStorage.getItem("localStoragePopular"));

  const popularModified = popular.map((data) => {
    checkWatchlist(data);
    return data;
  });

  //set popular data state
  state.popular = [...popularModified];
}

export async function renderPopularStocks() {
  try {
    const popular = await initStocks();

    const popularModified = popular.map((data) => {
      checkWatchlist(data);
      return data;
    });

    //set popular data state
    state.popular = [...popularModified];
    utils.persistLocalItem("lastUpdated", Date.now());
    utils.persistLocalItem("localStoragePopular", state.popular);
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
}

export async function getGeneralNews() {
  try {
    const data = await utils.fetchApiData(
      `${config.RAPID_NEWS_URL}category=generalnews&region=US`,
      config.RAPID_NEWS1_KEY,
      config.RAPID_NEWS_HOST
    );

    const finalData = data.items.result.slice(0, 4);

    //set news data state
    state.news = [...finalData];
    utils.persistLocalItem("localStorageNews", state.news);
  } catch (err) {
    throw err;
  }
}

export async function getCurrentPriceData(symbol) {
  const priceDaata = {};
  try {
    const data = await utils.fetchApiData(
      `${config.RAPID_PRICE_URL}symbol=${symbol}&period=1Y`,
      config.RAPID_PRICE1_KEY,
      config.RAPID_PRICE_HOST
    );

    const priceData = data.attributes;
    const adjPriceData = Object.entries(priceData);

    //get price data properties
    const currentPrice = adjPriceData.at(-1)[1].close;
    const previousDayPrice = adjPriceData.at(-2)[1].close;
    const previousMonthPrice = adjPriceData.at(-23)[1].close;

    //set price data properties
    priceDaata.currentPrice = currentPrice;
    priceDaata.previousDayPrice = previousDayPrice;
    priceDaata.prevMthPrice = previousMonthPrice;
    priceDaata.dailyPriceInc = parseFloat(
      ((currentPrice - previousDayPrice) / previousDayPrice).toFixed(3)
    );
    priceDaata.mthPriceInc = parseFloat(
      ((currentPrice - previousMonthPrice) / previousMonthPrice).toFixed(3)
    );

    return priceDaata;
  } catch (err) {
    throw err;
  }
}
