import View from "./View.js";
import previewView from "./previewView.js";

class PopularStockView extends View {
  _parentElement = document.querySelector(".popular-table-body");
  _tableHeader = document.querySelector(".popular-table-head");
  _loadParent = this._parentElement.querySelector(".table-loading");
  _toastNotif = document.querySelector(".index-toast");
  _errorMessage = "Problem fetching Popular Stocks. Try refreshing the page";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new PopularStockView();
