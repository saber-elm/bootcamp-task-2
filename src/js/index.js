const getInfoBtn = document.querySelector(".getinfo");
const contentTable = document.querySelector(".content_table");
const searchInput = document.querySelector("#search");
const transactionsSection = document.querySelector(".content_table_items");
const sortBtns = document.querySelectorAll(".fa-chevron-down");

// -------- Get Data and show in DOM
const options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};
getInfoBtn.addEventListener("click", getData);

const app = axios.create({
  baseURL: "http://localhost:3000",
});

function createDomItems(restUrl) {
  app
    .get(`${restUrl}`)
    .then(({ data }) => {
      for (const item of data) {
        const transactionItem = document.createElement("div");
        transactionItem.classList.add("table_items");
        transactionItem.innerHTML = `
        <div class="items">${item.id}</div>
        <div class="items">${item.type}</div>
        <div class="items">${item.price} ریال</div>
        <div class="items">${item.refId}</div>
        <div class="items">${new Date(item.date).toLocaleDateString(
          "fa-IR",
          options
        )}</div>
        `;
        transactionsSection.appendChild(transactionItem);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getData() {
  getInfoBtn.style.display = "none";
  contentTable.style.display = "block";
  searchInput.style.display = "block";
  createDomItems("/transactions");
}

// -------------- Search Data

searchInput.addEventListener("input", filterData);

function filterData(e) {
  const refId = `?refId_like=${e.target.value}`;
  transactionsSection.innerHTML = "";
  createDomItems(`/transactions${refId}`);
}

// ------------------ Sort Data by price and date

sortBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("asc")) {
      btn.classList.remove("asc");
    } else {
      btn.classList.add("asc");
    }
  });
});

sortBtns.forEach((btn) => {
  btn.addEventListener("click", sortData);
});

function sortData(e) {
  let query = "";
  if (e.target.classList.value.includes("price")) {
    query = "price";
  } else {
    query = "date";
  }
  let sort = "";
  if (e.target.classList.value.includes("asc")) {
    sort = "asc";
  } else {
    sort = "desc";
  }

  transactionsSection.innerHTML = "";
  createDomItems(`/transactions?_sort=${query}&_order=${sort}`);
}
