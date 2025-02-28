import View from "./View.js";

class StockQuoteView extends View {
  _parentElement = document.querySelector(".related-stocks");
  _loadParent = this._parentElement.querySelector(".normal-loading");
  _errorMessage = "Problem fetching Company Profile. Try refreshing the page";

  _generateMarkup() {
    return this._data
      .map(
        (stock) => `
                <div class="related-stock-row flex align-center">
                <div class="stock-name-cont flex align-center">
                    <a href="stock_quote.html?symbol=${
                      stock.ticker
                    }" class="flex align-center">
                    <img
                    src="${stock.logo}"
                    alt="Alphabet Logo"
                    class="stock-logo"
                  />
                  <div class="flex-column">
                    <h6 class="stock-name">${stock.name}</h6>
                    <p class="stock-ticker">${stock.ticker}</p>
                  </div>
                </a>
              </div>
              <div class="stock-price-details flex">
                <div class="stock-price">$${stock.c}</div>
                <div class=${stock.dp > 0 ? "green" : "red"}>${stock.dp.toFixed(
          2
        )}%</div>
              </div>
            </div>
        `
      )
      .join("");
  }
}

export default new StockQuoteView();
