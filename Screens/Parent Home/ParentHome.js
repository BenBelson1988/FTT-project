let parentID = window.localStorage.getItem("parent");
if (!parentID) window.open("../Login/Login.html", "_self");

fecthPatients().then(function (response) {
  let patients = response;
  const parentsList = fecthParents().then(function (response1) {
    for (let i = 0; i < parentsList.length; i++) {
      if (parentsList[i].ID === parentID) {
        const parent = parentsList[i];
        break;
      }
    }
  });
});

function parentLogOut() {
  localStorage.clear();
  window.open("../Login/Login.html", "_self");
}

async function fecthPatients() {
  document.getElementById("loader").classList.remove("display-none");
  const response = await fetch(
    `https://fttell-default-rtdb.firebaseio.com/patients.json`
  );
  const patients = await response.json();
  document.getElementById("loader").classList.add("display-none");
  return patients;
}

async function fecthParents() {
  const response = await fetch(
    `https://fttell-default-rtdb.firebaseio.com/parents.json`
  );
  const parents = await response.json();
  return parents;
}
