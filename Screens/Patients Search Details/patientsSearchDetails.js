let licenseNumber = window.localStorage.getItem("loggedIn");
if (!licenseNumber) window.open("../Login/Login.html", "_self");
let index = window.localStorage.getItem("index");

document.getElementById("welcome").innerHTML =
  "Welcome back, " + window.localStorage.getItem("name");
let tempPatientID = 0;

function searchAddPatient(type) {
  let searchError = document.getElementById(type + "Error");
  let searchInput = document.getElementById(type).value;
  if (searchInput === "" || searchInput.length !== 9) {
    searchError.innerText = "Please enter a valid ID (9 digits long).";
    return;
  } else searchError.innerText = "";
  type === "exsistPatientID"
    ? searchForPatient(searchInput)
    : addNewPatient(searchInput);
}

function onChangeHandler(type) {
  document.getElementById(type + "Error").innerText = "";
}

async function searchForPatient(id) {
  let [patients, doctorPatients] = await Promise.allSettled([
    fecthPatients(),
    fecthDoctorPatients(),
  ]);
  patients = patients.value.filter((patient) => {
    return doctorPatients.value.includes(patient.id);
  });
  for (let i = 0; i < patients.length; i++)
    if (patients[i].id === id) {
      tempPatientID = id;
      showDetails(patients[i]);
      return;
    }
  document.getElementById("exsistPatientIDError").innerHTML =
    "User does not exist.";
  document.getElementById("patients-details-div").classList.add("display-none");
}

async function addNewPatient(id) {
  let patients = await fecthPatients();
  console.log(patients);
  //change to regular for and break
  for (let tempPatient = 0; tempPatient < patients.length; tempPatient++) {
    if (patients[tempPatient].id === id) {
      document.getElementById("newPatientIDError").innerHTML =
        "ID already exist.";
      return;
    }
  }

  window.open("../Add Details/AddDetails.html?id=" + id, "_self");
}

function showDetails(patient) {
  let rightDiv = document.getElementById("patients-details-div");
  rightDiv.classList.remove("display-none");
  rightDiv.classList.add("patients-details");
  document.getElementById("patientFullName").innerHTML = patient.fullName;
  document.getElementById("patientAge").innerHTML = birthToAge(
    patient.birthDate
  );
  document.getElementById("medicalDiagnosis").innerHTML =
    patient.medicalDiagnose;
  let medicineList = document.getElementById("medicinesTaken");
  medicineList.innerHTML = "";
  for (const [key, value] of Object.entries(patient.medicineTaken)) {
    let medicineItem = document.createElement("div");
    medicineItem.classList.add("medicine-item");
    medicineItem.innerHTML += `${key} - ${value}` + "\n";
    medicineList.appendChild(medicineItem);
  }
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

async function fecthPatients() {
  document.getElementById("loader").classList.remove("display-none");
  const response = await fetch(
    `https://fttell-default-rtdb.firebaseio.com/patients.json`
  );
  const patients = await response.json();
  document.getElementById("loader").classList.add("display-none");
  return patients;
}

async function fecthDoctorPatients() {
  const pateintsResponse = await fetch(
    `https://fttell-default-rtdb.firebaseio.com/doctors/${index}/patientsList.json`
  );
  return await pateintsResponse.json();
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

function birthToAge(birthDay) {
  var dateNow = new Date();
  var age = dateNow.getFullYear() - birthDay.substring(0, 4);
  if (birthDay.substring(5, 7) - dateNow.getMonth() + 1 > 0) age--;
  return age;
}

function showFullDetails() {
  window.open(
    "../Patient Full Details/PatientFullDetails.html?id=" + tempPatientID,
    "_self"
  );
}
