import View from "./View.js";

class SearchSuggestionsView extends View {
  _parentElement = document.querySelector(".search-suggestions");
  _errorMessage = "No matches found...";
  _loadParent = this._parentElement;

  _generateMarkup() {
    return this._data.map(this._generatePreviewMarkup).join("");
  }

  _generatePreviewMarkup(suggestion) {
    return `<a href="stock_quote.html?symbol=${suggestion.symbol}">
              <div>
                 <h2>${suggestion.description}</h2>
                 <p>${suggestion.symbol}</p>
              </div>
            </a>`;
  }
}

export default new SearchSuggestionsView();
