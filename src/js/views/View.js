export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this._clear();
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue?.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
        curEl.innerHTML = newEl.innerHTML;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear(parent = true) {
    parent === false
      ? (this._loadParent.innerHTML = "")
      : (this._parentElement.innerHTML = "");
  }

  addHandlerWatchlist(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const button = e.target.closest(".watchlist-toggler");
      if (!button) return;

      handler(button, button.dataset.id);
    });
  }

  addHandlerSort(handler) {
    this._tableHeader.addEventListener("click", function (e) {
      const headers = this.querySelectorAll(".table-header");
      const button = e.target.closest(".table-header");
      if (!button) return;

      headers.forEach((header) => header.classList.remove("active"));
      button.classList.add("active");
      handler(this, button.dataset.sort);
    });
  }
  renderSpinner() {
    const markup = `
      <dotlottie-player
        src="https://lottie.host/2e61f0ba-f276-4184-9457-650bc820eb71/kTJ3KC3sSs.lottie"
        background="transparent"
        speed="1"
        class="loading-spinner"
        loop
        autoplay
      ></dotlottie-player>
    `;
    this._loadParent.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <p>${message}</p>
      </div>
    `;
    this._clear(false);
    this._loadParent.insertAdjacentHTML("afterbegin", markup);
  }

  renderToast(func, message) {
    this._toastNotif.innerHTML = "";
    const markup = `
        <i class="bx bx-list-${func === "add" ? "check" : "minus"}"></i>
        <p>${message}</p>
        `;
    this._toastNotif.insertAdjacentHTML("afterbegin", markup);

    this._toastNotif.style.visibility = "visible";
    this._toastNotif.style.opacity = "1";
    setTimeout(() => {
      this._toastNotif.style.opacity = "0";
      this._toastNotif.style.visibility = "hidden";
    }, 1700);
  }

  renderSeeAllLink() {
    const markup = `
    <div class="view-all-wlist">
          <a href="watchlist.html" class="watchlist-link">See All</a>
    </div>
    `;
    document
      .querySelector(".mini-watchlist")
      .insertAdjacentHTML("beforeend", markup);
  }

  // This method removes the "See All" link from the mini-watchlist
  clearSeeAllLink() {
    const seeAllLink = document.querySelector(
      ".mini-watchlist .view-all-wlist"
    );
    if (seeAllLink) seeAllLink.remove();
  }
}
