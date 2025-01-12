import View from "./View.js";
import previewNewsView from "./previewNewsView.js";
class HomeNewsView extends View {
  _parentElement = document.querySelector(".home-news-container");
  _loadParent = this._parentElement.querySelector(".normal-loading");
  _errorMessage = "Problem fetching News";

  _generateMarkup() {
    return this._data
      .map((result) => previewNewsView.render(result, false))
      .join("");
  }
}

export default new HomeNewsView();
