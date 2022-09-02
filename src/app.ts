const ENDPOINT_URL = 'https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84';

const loader = document.querySelector('.loader')!;

const prevBtn = document.querySelector("[data-prevbtn]")!;
const nextBtn = document.querySelector("[data-nextbtn]")!;
const pageView = document.querySelector("[data-pageview]")!;
const tbody = document.querySelector("tbody")!;

interface UserResults {
	id: string;
	age: string;
	gender: string;
	row: string;
}

let pageInView = 1;
let pointer = 5;
let savedPages = 2;

let allUsersData = <UserResults[]>[];

const showLoader = (state: boolean) => {
	state
		? loader.classList.add('show_loader')
		: loader.classList.replace('show_loader', 'hide_loader');
}

const fetchData = async (page = 1) => {
  showLoader(true);
  const url = page === 1 ? ENDPOINT_URL : `${ENDPOINT_URL}&page=${page}`;
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
  if (pageInView % 2 === 0 && pageInView + 1 > savedPages) {
    showLoader(true);
    const data = await fetchData(savedPages + 1);
    tbody.innerHTML = "";
    const newData = data?.slice(0, 5);
    if (newData) showTableData(newData);
    pointer += 5;
    savedPages += 2;
    pageInView++;
    showLoader(false);
    return;
  }
  tbody.innerHTML = "";
  const startPointer = pointer;
  pointer += 5;
  const newData = allUsersData.slice(startPointer, pointer);
  showTableData(newData);
  pageInView++;
  prevBtn.removeAttribute("disabled");
}

const getPrevious = () => {
  tbody.innerHTML = "";
  pointer -= 5;
  const startPointer = pointer - 5;
  const newData = allUsersData.slice(startPointer, pointer);
  showTableData(newData);
  pageInView--;
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

  nextBtn.addEventListener("click", getNext);
  prevBtn.addEventListener("click", getPrevious);
};

document.addEventListener('DOMContentLoaded', startApp);
