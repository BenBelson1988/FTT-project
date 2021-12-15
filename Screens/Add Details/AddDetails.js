let licenseNumber = window.localStorage.getItem("loggedIn");
if (!licenseNumber) window.open("../Login/Login.html", "_self");
let index = window.localStorage.getItem("index");

let illness = 0;
const illnesses = [
  "Occult blood in stool",
  "Reflux",
  "Eating disorder",
  "Celiac",
  "Malabsorption",
  "Chronic infection",
  "Mood disorder",
];
let tempIlnesess = illnesses;

function addIlness() {
  if (illness === 7) return;
  illness++;
  let h5 = document.createElement("h5");
  h5.classList.add("h5Details");
  h5.innerText = "Illness" + illness;
  h5.setAttribute("id", "h5Ilness" + illness);
  let comboBox = document.createElement("select");
  comboBox.setAttribute("id", "Ilness" + illness);
  comboBox.setAttribute("class", "input-illness");
  let defaultOption = document.createElement("option");
  defaultOption.innerText = "Please select illness";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.hidden = true;
  comboBox.appendChild(defaultOption);
  for (let i = 0; i < tempIlnesess.length; i++) {
    let option = document.createElement("option");
    option.value = "i";
    option.innerText = tempIlnesess[i];
    comboBox.appendChild(option);
  }
  document.getElementById("illness-list").appendChild(h5);
  document.getElementById("illness-list").appendChild(comboBox);
}

function removeIlness() {
  let ilnessList = document.getElementById("illness-list");
  if (!ilnessList.hasChildNodes()) return;
  ilnessList.removeChild(document.getElementById("Ilness" + illness));
  ilnessList.removeChild(document.getElementById("h5Ilness" + illness));
  illness--;
}

function logOut() {
  let data = false;
  fetch(
    `https://fttell-default-rtdb.firebaseio.com/doctors/${index}/loggedIn.json`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  ).then(() => {
    window.localStorage.clear(), window.open("../Login/Login.html", "_self");
  });
}
