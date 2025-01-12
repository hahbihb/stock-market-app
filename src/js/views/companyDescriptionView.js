import View from "./View.js";

class CompanyDescriptionView extends View {
  _parentElement = document.querySelector(".company-description");
  _loadParent = this._parentElement.querySelector(".normal-loading");

  _generateMarkup() {
    return `
        ${this._data.description}
        `;
  }
}

export default new CompanyDescriptionView();
