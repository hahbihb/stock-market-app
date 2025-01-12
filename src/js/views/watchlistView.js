import View from "./View.js";
import previewView from "./previewView.js";

class WatchlistView extends View {
  _parentElement = document.querySelector(".watchlist-table-body");
  _tableHeader =
    document.querySelector(".watchlist-table-head") ||
    document.querySelector(".full-watchlist-table-head");
  _loadParent = this._parentElement.querySelector(".table-loading");
  _errorMessage = "No Items In Watchlist";
  _toastNotif = document.querySelector(".index-toast");

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new WatchlistView();
