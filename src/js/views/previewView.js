import View from "./View.js";

class PreviewView extends View {
  _parentElement = "";

  _generateMarkup() {
    return `  
            <tr class="stock-row">
              <td class="stock-name-cont stock-quote-link data-src data-symbol="${
                this._data.ticker
              }">
                <a href="stock_quote.html?symbol=${
                  this._data.ticker
                }" class="flex align-center">
                  <img
                    src="${this._data.logo}"
                    alt="${this._data.name} Logo"
                    class="stock-logo"
                  />
                  <div class="flex-column">
                    <h6 class="stock-name">${this._data.name}</h6>
                    <p class="stock-ticker">${this._data.ticker}</p>
                  </div>
                </a>
              </td>
              <td><div>$${this._data.currentPrice}</div></td>
              <td class=${
                this._data.currentPrice > this._data.previousPrice
                  ? "green"
                  : "red"
              }>${this._calculatePercentageIncrease(
      this._data.previousPrice,
      this._data.currentPrice
    )}%</td>
              <td class=${
                this._data.currentPrice > this._data.prevMthPrice
                  ? "green"
                  : "red"
              }>${this._calculatePercentageIncrease(
      this._data.prevMthPrice,
      this._data.currentPrice
    )}%</td>
              <td>$${
                Math.round(this._data.marketCap) < 1000000
                  ? `${(Math.round(this._data.marketCap) / 1e3).toFixed(3)}B`
                  : `${(Math.round(this._data.marketCap) / 1e6).toFixed(3)}T`
              }</td>
              <td><button data-id="${this._data.ticker}" class="${
      this._data.watchlisted ? "watchlisted" : ""
    } watchlist-toggler cursor-pointer"><i  class="bx ${
      this._data.watchlisted ? "bxs-check" : "bx-plus"
    }-circle "></i></button></td>
            </tr>`;
  }

  _calculatePercentageIncrease(oldPrice, newPrice) {
    if (oldPrice === 0) {
      throw new Error(
        "Old price cannot be zero to calculate percentage change."
      );
    }
    const percentageChange = ((newPrice - oldPrice) / oldPrice) * 100;
    return percentageChange.toFixed(2);
  }
}

export default new PreviewView();
