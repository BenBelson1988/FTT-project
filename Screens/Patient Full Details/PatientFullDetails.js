let licenseNumber = window.localStorage.getItem("loggedIn");
if (!licenseNumber) window.open("../Login/Login.html", "_self");
let index = window.localStorage.getItem("index");

function goBackToHomepage() {
  window.open("../Patients Search Details/PatientSearchDetails.html", "_self");
}

let id = window.location.search.substring(window.location.search.length - 9);
let patient;

fecthPatients(id);

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
  createChart(patient);
  updateFields(patient);
}

function createChart(patient) {
  let labelArr = patient.fttProgress.map((label) => {
    return label.date;
  });
  let fttProgressArr = patient.fttProgress.map((label) => {
    return label.fttValue;
  });
  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labelArr,
      datasets: [
        {
          label: "FTT Progress for " + patient.fullName,
          data: fttProgressArr,
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      animation: {
        duration: 3000,
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: true,
              steps: 10,
              stepValue: 5,
              max: 20,
            },
          },
        ],
      },
    },
  });
}

function updateFields(patient) {
  for (const [key, value] of Object.entries(patient.weightsInfo)) {
    document.getElementById(key).innerHTML = value;
  }
  for (const [key, value] of Object.entries(patient)) {
    if (document.getElementById(key)) {
      document.getElementById(key).innerHTML = value;
      if (key === "birthDate") {
        document.getElementById(key).innerHTML = birthToAge(value);
      }
    }
  }
  if (patient.illnesses) {
    illnessDiv = document.getElementById("medicalHistory");
    patient.illnesses.forEach((element, index) => {
      let illness = document.createElement("h5");
      illness.classList.add("illnessesList");
      illness.innerHTML = "Illness " + (index + 1) + " - " + element;
      illnessDiv.appendChild(illness);
    });
  }
  if (patient.medicineTaken) {
    let medicineList = document.getElementById("medicineList");
    for (const [key, value] of Object.entries(patient.medicineTaken)) {
      let medicineItem = document.createElement("div");
      medicineItem.classList.add("medicine-item");
      medicineItem.innerHTML += `${key} - ${value}` + "\n";
      medicineList.appendChild(medicineItem);
    }
  } else
    document.getElementById("medicineList").innerHTML = "No medicine taken.";
  document.getElementById("medicalDiagnosis").innerHTML =
    patient.medicalDiagnose;
  document.getElementById("PsychotherpyRecommendation").innerHTML =
    patient.psychologhy.description;
}

function birthToAge(birthDay) {
  var dateNow = new Date();
  var age = dateNow.getFullYear() - birthDay.substring(0, 4);
  if (birthDay.substring(5, 7) - dateNow.getMonth() + 1 > 0) age--;
  return age;
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
