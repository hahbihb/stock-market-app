import View from "./View.js";

class StockQuoteView extends View {
  _parentElement = document.querySelector(".company-details");
  _loadParent = this._parentElement.querySelector(".normal-loading");
  _errorMessage = "Problem fetching Company Profile. Try refreshing the page";
  _toastNotif = document.querySelector(".quote-toast");

  _generateMarkup() {
    return `
        <div class="company-details flex">
          <div class="company-details-left flex-column">
            <div class="company-name flex align-center">
              <img
                src="${this._data.logo}"
                alt="${this._data.name} Logo"
                class="stock-logo"
              />
              <div class="flex-column margin-left">
                <h6 class="stock-name">${this._data.name}</h6>
                <p class="stock-ticker">${this._data.ticker}</p>
              </div>
              <button data-symbol="${this._data.ticker}" class="${
      this._data.watchlisted ? "watchlisted" : ""
    } watchlist-toggler cursor-pointer watchlist-toggle"><i  class="bx ${
      this._data.watchlisted ? "bxs-check" : "bx-plus"
    }-circle "></i></button>
            </div>
            <div class="categories flex">
              <div>${this._data.industry}</div>
              <div>${this._data.sector}</div>
            </div>
          </div>
          <div class="company-details-right flex">
            <div class="share-price">
              <h5>Share Price</h5>
              <p>$${this._data.currentPrice}</p>
            </div>
            <div class="market-cap">
              <h5>Market Cap</h5>
              <p>$${
                Math.round(this._data.marketCap) < 1000000
                  ? `${(Math.round(this._data.marketCap) / 1e3).toFixed(3)}B`
                  : `${(Math.round(this._data.marketCap) / 1e6).toFixed(3)}T`
              }</p>
            </div>
            <div class="Market-Traded">
              <h5>Traded As</h5>
              <p>${
                this._data.exchange.includes("NEW")
                  ? "NYSE"
                  : this._data.exchange.split(" ")[0]
              }</p>
            </div>
            <div class="company-ceo">
              <h5>CEO</h5>
              <p>${this._data.ceo}</p>
            </div>
            <div class="company-website">
              <h5>Website</h5>
              <a href="${this._data.website}" target="_blank"><p>${
      this._data.name.split(" ")[0]
    }.com</p></a>
            </div>
          </div>
        </div>
        
        `;
  }

  addHandlerWatchlist(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const button = e.target.closest(".watchlist-toggler");
      if (!button) return;

      handler(button, button.dataset.symbol);
    });
  }
}

export default new StockQuoteView();
