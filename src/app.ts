const ENDPOINT_URL = 'https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84';

const loader = document.querySelector('.loader')!;

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

let allUsersData = <UserResults[]>[];

const showLoader = (state: boolean) => {
	state
		? loader.classList.add('show_loader')
		: loader.classList.replace('show_loader', 'hide_loader');
}

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
    allUsersData.push(...users);
    return users;
  } catch (error) {
    console.error(error);
    return null
  } finally {
    showLoader(false);
  }
}

const showTableData = (data: UserResults[]) => {
  data?.forEach(element => {
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
  })
}

const getNext = async () => {
  const data = await fetchData(pageInView + 1);
  tbody.innerHTML = "";
  const newData = data?.slice(0, 5);
  if (newData) showTableData(newData);
  pageInView++;
  pageViewText.textContent = `Showing Page ${pageInView}`;
  prevBtn.removeAttribute("disabled");
}

const getPrevious = async () => {
  const data = await fetchData(pageInView - 1);
  tbody.innerHTML = "";
  const newData = data?.slice(0, 5);
  if (newData) showTableData(newData);
  pageInView--;
  pageViewText.textContent = `Showing Page ${pageInView}`;
  if (pageInView === 1) prevBtn.setAttribute("disabled", "true");
}

const startApp = async () => {
	const data = await fetchData();
  const newData = data?.slice(0, 5);
  if (newData) showTableData(newData);
  else {
    const tr = document.createElement("tr");
    tr.textContent = "No results found";
    tbody.appendChild(tr);
  }

  prevBtn.setAttribute("disabled", "true");
  pageViewText.textContent = `Showing Page ${pageInView}`;
  nextBtn.addEventListener("click", getNext);
  prevBtn.addEventListener("click", getPrevious);
};

document.addEventListener('DOMContentLoaded', startApp);
