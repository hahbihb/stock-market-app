import View from "./View.js";

class ChartView extends View {
  _parentElement = document.querySelector(".stock-chart-container");
  _loadParent = this._parentElement.querySelector(".normal-loading");
  _errorMessage = "Problem fetching Chart Data. Try refreshing the page";

  _generateMarkup() {
    return `<div class="stock-chart-header flex align-center">
              <div><h2>$${this._data.currentPrice}</h2></div>
              <div class="price-increase flex ${
                this._data.period === "1D"
                  ? this._data.dailyPriceInc > 0
                    ? "green"
                    : "red"
                  : this._data.priceData.at(-1).close >
                    this._data.priceData.at(0).open
                  ? "green"
                  : "red"
              }">
                <p>$${
                  this._data.period === "1D"
                    ? this._data.dailyPriceInc
                    : parseFloat(
                        this._data.priceData.at(-1).close -
                          this._data.priceData.at(0).close
                      ).toFixed(2)
                }(${
      this._data.period === "1D"
        ? this._calculatePercentageIncrease(
            this._data.previousDayPrice,
            this._data.currentPrice
          )
        : this._calculatePercentageIncrease(
            this._data.priceData.at(0).close,
            this._data.priceData.at(-1).close
          )
    }%) ${this._data.period}</p>
              </div></div>
              <div class="stock-chart">
                <canvas id="myChart"></canvas>
              </div>
              
              <div class="flex chart-bottom align-center">
                <div class="chart-period-selector">
                  <label for="dropdown"><h4>Period:</h4></label>
                  <select id="dropdown" name="dropdown">
                    <option value="1D" selected>1 Day</option>
                    <option value="5D">5 Days</option>
                    <option value="1M">1 Month</option>
                    <option value="6M">6 Months</option>
                    <option value="YTD">YTD</option>
                    <option value="1Y">1 Year</option>
                    <option value="5Y">5 Years</option>
                    <option value="MAX">Full</option>
                  </select>
                </div>
                <div class="price-high-low flex">
                  <p>Price high: <span>$${this._data.high}</span></p>
                  <p>Price low: <span>$${this._data.low}</span></p>
                </div>
              </div>
            `;
  }

  _calculatePercentageIncrease(oldPrice, newPrice) {
    if (oldPrice === 0) {
      throw new Error(
        "Old price cannot be zero to calculate percentage change."
      );
    }
    const percentageChange = ((newPrice - oldPrice) / oldPrice) * 100;
    return parseFloat(percentageChange.toFixed(3));
  }

  addHandlerChangePeriod(handler) {
    this._parentElement.addEventListener("change", function (e) {
      const dropdown = e.target.closest("#dropdown");
      if (!dropdown) return;

      handler(dropdown.value);
    });
  }

  adjustSelectedDropdown(value) {
    const dropdown = document.querySelector("#dropdown");
    const options = dropdown.options;

    for (let i = 0; i < options.length; i++) {
      options[i].selected = options[i].value === value;
    }
  }
}

export default new ChartView();
