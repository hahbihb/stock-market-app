import View from "./View.js";

class PreviewNewsView extends View {
  _parentElement = "";

  _generateMarkup() {
    return `  
           <a href="${this._data.link}" target="_blank" class="news-link">
              <div class="news flex align-center">
                <div class="news-image">
                  <img
                    src="${this._data.main_image?.original_url}"
                    alt=""
                    class="news-cover-img"
                  />
                </div>
                <div class="news-details">
                  <h4 class="news-title secondary-header margin-bottom">
                    ${this._data.title}
                  </h4>
                  <div class="flex src-and-date">
                    <p class="news-source">${this._data.publisher}</p>
                    <p class="news-date">${new Date(
                      this._data.published_at * 1000
                    ).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </a>`;
  }
}

export default new PreviewNewsView();
