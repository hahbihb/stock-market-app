import { TIMEOUT_SEC } from "./config.js";

//Menu Toggler
const menuIcon = document.querySelector(".bx-menu");
const closeIcon = document.querySelector(".bx-x");
const navLinks = document.querySelector(".nav-links");

export const menuToggler = function () {
  menuIcon.classList.toggle("hidden");
  closeIcon.classList.toggle("hidden");
  navLinks.classList.toggle("active");
};

//Dark Mode Toggler
const darkMode = document.querySelector(".dark-md");
const lightMode = document.querySelector(".light-md");
const rootElement = document.documentElement;

const toggleDarkMode = function () {
  // Toggle the "dark-mode" class
  rootElement.classList.toggle("dark-mode");
  lightMode.classList.toggle("hidden");
  darkMode.classList.toggle("hidden");
};

export const toggleMode = function () {
  toggleDarkMode();

  // Save current theme in localStorage
  const newTheme = rootElement.classList.contains("dark-mode")
    ? "dark"
    : "light";
  persistLocalItem("theme", newTheme);
};

//Update Local Storage
export const persistLocalItem = function (objectName, object) {
  if (object.length === 0) {
    localStorage.setItem(`${objectName}`, JSON.stringify([]));
  } else {
    localStorage.setItem(`${objectName}`, JSON.stringify(object));
  }
};

//nav Observer

export const navObserver = function (header, observer, threshold = 0) {
  const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: threshold,
  });

  headerObserver.observe(observer);
};

//Sort Table
export function sortTable(view, array, sortProperty) {
  if (sortProperty === "marketCap") {
    view.render(array.sort((a, b) => b.marketCap - a.marketCap));
  } else if (sortProperty === "currentPrice") {
    view.render(array.sort((a, b) => b.currentPrice - a.currentPrice));
  } else if (sortProperty === "incDay") {
    view.render(array.sort((a, b) => b.dailyPriceInc - a.dailyPriceInc));
  } else if (sortProperty === "incMonth") {
    view.render(array.sort((a, b) => b.mthPriceInc - a.mthPriceInc));
  } else if (sortProperty === "name") {
    view.render(array.sort((a, b) => a.name.localeCompare(b.name)));
  }
}

//Check if user logs in within an hour of previous log in
export function isWithinAnHour(lastUpdated) {
  if (!lastUpdated) return false; // No last updated time stored

  const lastUpdatedTime = new Date(lastUpdated).getTime();
  const currentTime = Date.now();

  // Check if less than 1 hour (60 * 60 * 1000 milliseconds) have passed
  return currentTime - lastUpdatedTime < 20 * 60 * 60 * 1000;
}

//Check if user logs in on a weekend
export function isWeekend() {
  const today = new Date();
  return today.getDay() === 6 || today.getDay() === 0;
}

//Fetch In batches
export async function fetchInBatches(items, batchSize, func) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const data = await Promise.all(batch.map(func));
    results.push(...data);
  }
  return results;
}

//timeout function
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds :(`));
    }, s * 1000);
  });
};

//make button unclickable
export const disableButton = function (btn) {
  btn.style.cursor = "not-allowed";
  btn.disabled = "true";
};

export const enableButton = function (btn) {
  btn.style.cursor = "pointer";
  btn.disabled = "false";
};

//Fetch Yahoo API Data
export const fetchApiData = async function name(url, key, host, api = "rapid") {
  const fetchedData =
    api === "rapid"
      ? fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-key": key,
            "x-rapidapi-host": host,
          },
        })
      : fetch(url);

  const response = await Promise.race([fetchedData, timeout(TIMEOUT_SEC)]);
  const data = await response.json();

  if (!response.ok) throw new Error(`${data.message} (${response.status})`);

  return data;
};

//create chart function
export function createChart(chart, data, labels) {
  new Chart(chart, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          borderWidth: 1,
          fill: "start",
          pointStyle: false,
          borderColor: data[0] < data[data.length - 1] ? "green" : "red",
          backgroundColor:
            data[0] < data[data.length - 1]
              ? "hsla(134, 61%, 41%, 0.233)"
              : "hsla(354, 70%, 54%, 0.233)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
    },
  });
}
