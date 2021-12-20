let licenseNumber = window.localStorage.getItem("loggedIn");
if (!licenseNumber) window.open("../Login/Login.html", "_self");
let index = window.localStorage.getItem("index");

function searchAddPatient(type) {
  let searchError = document.getElementById(type + "Error");
  let searchInput = document.getElementById(type).value;
  if (searchInput === "" || searchInput.length !== 9) {
    searchError.innerText = "Please enter a valid ID (9 digits long).";
    return;
  } else searchError.innerText = "";
  type === "exsistPatientID"
    ? console.log("get exsistPatientID from data")
    : console.log("add new patientID");
}

function onChangeHandler(type) {
  document.getElementById(type + "Error").innerText = "";
}

function openFullList() {
  document.getElementById("loader").classList.remove("display-none");

  fetch(
    `https://fttell-default-rtdb.firebaseio.com/doctors/${index}/patientsList.json`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (patients) {
      document.getElementById("loader").classList.add("display-none");
      if (!patients)
        document.getElementById("listError").innerHTML =
          "There are current no patients under care.";
      else window.open("../Full Patients List/FullPatientsList.html", "_self");
    });
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
