import * as hidden from "../hidden.js";

export const TIMEOUT_SEC = 40;
export const FINNHUB_URL = "https://finnhub.io/api/v1/";
export const FINNHUB_API_KEY = "csubglhr01qgo8ni2dn0csubglhr01qgo8ni2dng";
export const RAPID_PROFILE_URL =
  "https://yahoo-finance166.p.rapidapi.com/api/stock/get-fundamentals?";
export const RAPID_PRICE_URL =
  "https://seeking-alpha.p.rapidapi.com/symbols/get-chart?";
export const RAPID_NEWS_URL =
  "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-newsfeed?";
export const RAPID_PROFILE_KEY = hidden.RAPID_PROFILE_KEY;
export const RAPID_PRICE1_KEY = hidden.RAPID_PRICE1_KEY;
export const RAPID_PRICE2_KEY = hidden.RAPID_PRICE2_KEY;
export const RAPID_NEWS1_KEY = hidden.RAPID_NEWS1_KEY;
export const RAPID_NEWS2_KEY = hidden.RAPID_NEWS2_KEY;
export const RAPID_PROFILE_HOST = "yahoo-finance166.p.rapidapi.com";
export const RAPID_PRICE_HOST = "seeking-alpha.p.rapidapi.com";
export const RAPID_NEWS_HOST = "apidojo-yahoo-finance-v1.p.rapidapi.com";
export const MAX_RELATED_STOCKS = 4;
export const SEARCH_SUGGESTIONS_AMT = 10;
export const COMPANY_NEWS_AMT = 3;
export const GLOBAL_NEWS_AMT = 4;
export const MINI_WATCHLIST_MAX = 3;
export const CATEGORIES = new Map([
  ["Technology", ["AAPL", "MSFT", "GOOGL", "AMZN"]],
  ["Automobiles", ["TSLA", "F", "GM", "NIO"]],
  ["Energy", ["XOM", "CVX", "BP", "SHEL"]],
  ["Media", ["META", "DIS", "NFLX", "VIAC", "CMCSA"]],
  ["Health Care", ["JNJ", "UNH", "MRK", "HIMS", "AMGN"]],
  ["Financial Services", ["MC", "BAC", "V", "GS", "MS"]],
  ["Consumer products", ["PG", "UL", "CLX", "K", "MO"]],
  ["Beverages", ["KO", "PEP", "SBUX", "MNST"]],
  ["Aerospace \u0026 Defense", ["BA", "LMT", "RTX", "NOC", "GD"]],
  ["Pharmaceuticals", ["GILD", "ABBV", "LLY", "BMY", "MRNA"]],
  ["Semiconductors", ["INTC", "NVDA", "AMD", "TXN", "QCOM"]],
  ["Banking", ["JPM", "BAC", "WFC", "GS", "MS"]],
  [
    "Hotels, Restaurants \u0026 Leisure",
    ["MCD", "SBUX", "YUM", "CMG", "QSR", "DPZ"],
  ],
  ["Textiles, Apparel \u0026 Luxury Goods", ["NKE", "LULU", "GAP", "RL", "M"]],
  ["Retail", ["WMT", "AMZN", "TGT", "COST", "HD"]],
]);
