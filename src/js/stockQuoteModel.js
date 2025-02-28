import * as model from "./model.js";
import * as utils from "./utils.js";
import * as config from "./config.js";

export const sqstate = {
  price: {},
  quoteData: {},
  quoteDataArray: [],
  stockNewsArray: [],
  stockNews: [],
  stockChartArray: [],
  related: [],
  categories: [],
};

const originalCategories = config.CATEGORIES;

const createCompanyQuote = function (data1, data2) {
  return {
    name: data1.name,
    marketCap: data1.marketCap,
    ticker: data1.ticker,
    logo: data1.logo,
    exchange: data1.exchange,
    currentPrice: data1.currentPrice,
    website: data2.website,
    description: data2.longBusinessSummary,
    ceo: data2.companyOfficers[0].name,
    finnhubIndustry: data1.industry,
    industry: data2.industry,
    sector: data2.sector,
    watchlisted: false,
  };
};

export async function getCompanyQuote(symbol) {
  try {
    //get data from API
    const data = await model.getCompanyData(symbol);
    const response2 = await utils.fetchApiData(
      `${config.RAPID_PROFILE_URL}region=US&symbol=${symbol}`,
      config.RAPID_PROFILE_KEY,
      config.RAPID_PROFILE_HOST
    );

    const dataYH = response2;
    const dataYahoo = dataYH.quoteSummary.result[0].assetProfile;
    const quoteData = createCompanyQuote(data, dataYahoo);

    //check if stock is watchlisted
    model.checkWatchlist(quoteData);

    //set quote data state
    sqstate.quoteData = { ...quoteData };

    //store quote data in local storage to manange API calls
    sqstate.quoteDataArray.push(quoteData);
    utils.persistLocalItem("localStorageQuoteData", sqstate.quoteDataArray);

    return quoteData;
  } catch (err) {
    console.log(`${err}💥💥💥`);
    throw err;
  }
}

export function getCompanyQuoteFromLocalStorage(symbol) {
  //get quote data from local storage
  const quote = sqstate.quoteDataArray.find((data) => data.ticker === symbol);

  //check if stock is watchlisted
  model.checkWatchlist(quote);

  //set quote data state
  sqstate.quoteData = { ...quote };
}

export async function getCompanyNews(symbol) {
  try {
    //get data from API
    const data = await utils.fetchApiData(
      `${config.RAPID_NEWS_URL}category=${symbol}&region=US`,
      config.RAPID_NEWS2_KEY,
      config.RAPID_NEWS_HOST
    );

    const finalData = data.items.result.slice(0, config.COMPANY_NEWS_AMT);

    //set news data state
    sqstate.stockNews = [...finalData];

    sqstate.stockNewsArray.push({ symbol: symbol, news: finalData });
    utils.persistLocalItem("localStorageCompanyNews", sqstate.stockNewsArray);

    return finalData;
  } catch (err) {
    throw err;
  }
}

export function getCompanyNewsFromLocalStorage(symbol) {
  //get news data from local storage
  const news = sqstate.stockNewsArray.find((data) => data.symbol === symbol);

  //set news data state
  sqstate.stockNews = [...news.news];
}

export async function getStockChart(symbol, period) {
  try {
    const data = await utils.fetchApiData(
      `${config.RAPID_PRICE_URL}symbol=${symbol}&period=${period}`,
      config.RAPID_PRICE2_KEY,
      config.RAPID_PRICE_HOST
    );
    const finnhubData = await getFinnhubPrice(symbol);

    const priceData = data.attributes;
    const adjustedPriceData = Object.entries(priceData);

    //get price data properties
    const priceChartData = adjustedPriceData.map((a) => a[1]);
    const priceLabels = adjustedPriceData.map((a) => a[0]);
    const currentPrice = adjustedPriceData.at(-1)[1].close;
    const previousDayPrice = finnhubData.pc;

    //set price data properties
    sqstate.price.priceData = priceChartData;
    sqstate.price.chartLabels = priceLabels;
    sqstate.price.period = period;
    sqstate.price.currentPrice = currentPrice;
    sqstate.price.previousDayPrice = previousDayPrice;
    sqstate.price.dailyPriceInc = parseFloat(
      (currentPrice - previousDayPrice).toFixed(3)
    );
    sqstate.price.high = finnhubData.h;
    sqstate.price.low = finnhubData.l;

    //store chart data in local storage to manange API calls
    sqstate.stockChartArray.push({
      symbol: symbol,
      data: sqstate.price,
    });
    // utils.persistLocalItem("localStorageChart", sqstate.stockChartArray);

    return adjustedPriceData;
  } catch (err) {
    throw err;
  }
}

// export function getStockChartFromLocalStorage(symbol) {
//   //get chart data from local storage
//   const chart = sqstate.stockChartArray.find((data) => data.symbol === symbol);

//   //set chart data state
//   sqstate.price = { ...chart.data };
// }

function initStockQuote() {
  const stockQuoteArray = JSON.parse(
    localStorage.getItem("localStorageQuoteData")
  );
  const stockNewsArray = JSON.parse(
    localStorage.getItem("localStorageCompanyNews")
  );
  const stockChartArray = JSON.parse(localStorage.getItem("localStorageChart"));
  const categories = new Map(JSON.parse(localStorage.getItem("categories")));

  //set state
  if (categories) sqstate.categories = categories;
  if (stockQuoteArray) sqstate.quoteDataArray = [...stockQuoteArray];
  if (stockNewsArray) sqstate.stockNewsArray = [...stockNewsArray];
  if (stockChartArray) sqstate.stockChartArray = [...stockChartArray];
}
initStockQuote();

export async function getFinnhubPrice(symbol) {
  try {
    const finnhubData = await utils.fetchApiData(
      `${config.FINNHUB_URL}quote?symbol=${symbol}&token=${config.FINNHUB_API_KEY}`,
      "",
      "",
      "finnhub"
    );

    return finnhubData;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
}

async function getFinnhubProfile(symbol) {
  try {
    const data = await utils.fetchApiData(
      `${config.FINNHUB_URL}stock/profile2?symbol=${symbol}&token=${config.FINNHUB_API_KEY}`,
      "",
      "",
      "finnhub"
    );

    return data;
  } catch (err) {
    throw err;
  }
}

export async function getRelatedStocks(category) {
  category = sqstate.quoteData.finnhubIndustry;
  const ticker = sqstate.quoteData.ticker;
  const relatedStocks = [];

  //get appropriate category from state
  const categoryStocks = sqstate.categories.get(category) || [];

  //check if current category is already stored in state
  if (categoryStocks.length < 4 && !categoryStocks.includes(ticker)) {
    //Set category in state for future use
    sqstate.categories.set(category, [
      ...categoryStocks,
      sqstate.quoteData.ticker,
    ]);

    //store category in local storage
    utils.persistLocalItem("categories", [
      ...originalCategories,
      ...sqstate.categories,
    ]);
  }

  //check if there are related stocks
  if (
    categoryStocks.length === 0 ||
    (categoryStocks.length === 1 && categoryStocks.includes(ticker))
  ) {
    throw new Error("Sorry. No Related Stocks Stored Yet :(. Try again Later");
  }

  //get related stocks data
  for (let i = 0; i < config.MAX_RELATED_STOCKS; i++) {
    if (categoryStocks[i] === ticker) continue;
    if (!categoryStocks[i]) break;

    //get company profile
    const data = await getFinnhubProfile(categoryStocks[i]);

    //get company price
    const priceData = await getFinnhubPrice(categoryStocks[i]);
    const completeData = { ...data, ...priceData };
    relatedStocks.push(completeData);
  }
  //push into state
  sqstate.related = [...relatedStocks];

  //store category in local storage
  utils.persistLocalItem("categories", [
    ...originalCategories,
    ...sqstate.categories,
  ]);

  return relatedStocks;
}
