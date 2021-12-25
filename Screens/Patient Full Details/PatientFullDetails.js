let licenseNumber = window.localStorage.getItem("loggedIn");
if (!licenseNumber) window.open("../Login/Login.html", "_self");
let index = window.localStorage.getItem("index");

function goBackToHomepage() {
  window.open("../Patients Search Details/PatientSearchDetails.html", "_self");
}

let id = window.location.search.substring(window.location.search.length - 9);
let patient = fecthPatients(id);

async function fecthPatients(id) {
  document.getElementById("loader").classList.remove("display-none");
  const response = await fetch(
    `https://fttell-default-rtdb.firebaseio.com/patients.json`
  );
  const patients = await response.json();
  document.getElementById("loader").classList.add("display-none");
  [patient] = patients.filter((patientDATA) => {
    return patientDATA.id === id;
  });
  console.log(patient);
  document.getElementById("h2head").innerHTML =
    patient.fullName + " Full details";
  return patients;
}
