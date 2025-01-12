import View from "./View.js";
import previewNewsView from "./previewNewsView.js";
class CompanyNewsView extends View {
  _parentElement = document.querySelector(".company-news-cont");
  _loadParent = this._parentElement.querySelector(".normal-loading");
  _errorMessage = "Problem fetching Company News";

  _generateMarkup() {
    return this._data
      .map((result) => previewNewsView.render(result, false))
      .join("");
  }
}

export default new CompanyNewsView();
