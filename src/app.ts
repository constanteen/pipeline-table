const ENDPOINT_URL = "https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84";
const loader = document.querySelector(".loader")!;
const prevBtn = document.querySelector("[data-prevbtn]")!;
const nextBtn = document.querySelector("[data-nextbtn]")!;
const pageViewText = document.querySelector("[data-pageview]")!;
const tbody = document.querySelector("tbody")!;

interface UserResults {
	id: string;
	age: string;
	gender: string;
	row: string;
}

let pageInView = 1;

const showLoader = (state: boolean) => {
	state
		? loader.classList.replace("hide_loader", "show_loader")
		: loader.classList.replace("show_loader", "hide_loader");
};

const fetchData = async (page = 1) => {
  showLoader(true);
  const url = `${ENDPOINT_URL}&page=${page}`;
  const users = <UserResults[]>[];
  try {
    const response = await fetch(url);
    const data = await response.json();
    for (let result in data.results[0]) {
      if (result === "paging") break; // we don't need this data
      users.push(...data.results[0][result]);
    }
    return users;
  } catch (error) {
    console.error(error);
    const tr = document.createElement("tr");
    tr.textContent = "No results found";
    tbody.appendChild(tr);
  } finally {
    showLoader(false);
  }
};

const updateTable = (data: UserResults[]) => {
  tbody.innerHTML = "";
  data.forEach((element) => {
    const row = document.createElement("tr");
    row.setAttribute("data-entryid", element.id);

    const idCell = document.createElement("td");
    idCell.textContent = element.row;
    const genderCell = document.createElement("td");
    genderCell.textContent = element.gender;
    const ageCell = document.createElement("td");
    ageCell.textContent = element.age;

    row.appendChild(idCell);
    row.appendChild(genderCell);
    row.appendChild(ageCell);

    tbody.appendChild(row);
  });
  pageViewText.textContent = `Showing Page ${pageInView}`;
};

const getNextPage = async () => {
  pageInView++;
  const data = await fetchData(pageInView);
  if (data) {
    const newData = data?.slice(0, 5);
    updateTable(newData);
    if (pageInView >= 2) prevBtn.removeAttribute("disabled");
  }
};

const getPreviousPage = async () => {
  pageInView--;
  const data = await fetchData(pageInView);
  if (data) {
    const newData = data?.slice(0, 5);
    updateTable(newData);
    if (pageInView === 1) prevBtn.setAttribute("disabled", "true");
  }
};

const startApp = async () => {
  pageViewText.textContent = `Showing Page ${pageInView}`;
  nextBtn.addEventListener("click", getNextPage);
  prevBtn.addEventListener("click", getPreviousPage);
  prevBtn.setAttribute("disabled", "true");

	const data = await fetchData();
  if (data) {
    const newData = data?.slice(0, 5);
    updateTable(newData);
  }
};

document.addEventListener("DOMContentLoaded", startApp);
