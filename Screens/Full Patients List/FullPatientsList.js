let licenseNumber = window.localStorage.getItem("loggedIn");
if (!licenseNumber) window.open("../Login/Login.html", "_self");
let index = window.localStorage.getItem("index");

//fetch list and doctors patient list
document.getElementById("loader").classList.remove("display-none");

let doctorPatients;
let patientsList;
let fullList = [];

fetch(
  `https://fttell-default-rtdb.firebaseio.com/doctors/${index}/patientsList.json`
)
  .then(function (response) {
    return response.json();
  })
  .then(function (doctorPatientsPromise) {
    doctorPatients = doctorPatientsPromise;

    fetch(`https://fttell-default-rtdb.firebaseio.com/patients.json`)
      .then(function (listResponse) {
        return listResponse.json();
      })
      .then(function (patientsListdata) {
        patientsList = patientsListdata;
        document.getElementById("loader").classList.add("display-none");
      })
      .then(function () {
        patientsList.forEach((patient) => {
          if (doctorPatients.includes(patient.id)) fullList.push(patient);
        });
        fullList.forEach((patient, index) => {
          let flexDiv = document.createElement("div");
          flexDiv.classList.add("flexDiv");
          document.getElementById("listContainer").appendChild(flexDiv);
          addLine(flexDiv, patient, "fullName");
          addLine(flexDiv, patient, "id");
          addLine(flexDiv, patient, "birthDate");
          addLine(flexDiv, patient, "currentPercentile");
          addLine(flexDiv, patient, "psychologhy");
          addLine(flexDiv, patient, "medicineTaken");
          addLine(flexDiv, patient, "treatmentProgress");
        });
      });
  });

function addLine(flexDiv, patient, key) {
  let line = document.createElement("div");
  if (key === "birthDate" || key === "id") line.classList.add("flex1");
  else line.classList.add("flex2");
  if (key === "currentPercentile") {
    let progress = (
      patient["fttProgress"][0].fttValue -
      patient["fttProgress"][patient["fttProgress"].length - 1].fttValue
    ).toFixed(2);
    line.innerHTML = patient[key];
    progress > 1
      ? line.classList.add("red-background")
      : progress > 0 && progress < 1
      ? line.classList.add("yellow-background")
      : line.classList.add("green-background");
  } else if (key === "birthDate") line.innerHTML = birthToAge(patient[key]);
  else if (key === "psychology") line.innerHTML = patient.psychologhy[underPsy];
  else if (key === "medicineTaken")
    patient[key] ? (line.innerHTML = "true") : (line.innerHTML = "false");
  else if (key === "psychologhy")
    line.innerHTML = patient.psychologhy["underPsy"];
  else if (key === "treatmentProgress") {
    //create button
    let expandButton = document.createElement("button");
    expandButton.classList.add("button", "peach");
    expandButton.setAttribute("id", "expandButton");
    expandButton.innerHTML = "Click to Expand";
    expandButton.onclick = function () {
      expandTreatment(patient.id);
    };
    line.appendChild(expandButton);
  } else line.innerHTML = patient[key];
  flexDiv.appendChild(line);
}

function birthToAge(birthDay) {
  var dateNow = new Date();
  var age = dateNow.getFullYear() - birthDay.substring(0, 4);
  if (birthDay.substring(5, 7) - dateNow.getMonth() + 1 > 0) age--;
  return age;
}

function goBack() {
  history.back() ||
    window.open(
      "../Patients Search Details/PatientSearchDetails.html",
      "_self"
    );
}

///chart for every treatment progress.
function expandTreatment(id) {
  document.getElementById("overlay").classList.remove("display-none");
  document.getElementById("ftt-chart").classList.remove("display-none");

  let [patient] = fullList.filter((patientFromList) => {
    return patientFromList.id === id;
  });
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
              max: 100,
            },
          },
        ],
      },
    },
  });
}

window.addEventListener("click", function (e) {
  if (e.target.id === "expandButton") return;
  let chart = document.getElementById("ftt-chart");
  if (!chart.contains(e.target) && !chart.classList.contains("display-none"))
    closeChart();
});

function closeChart() {
  document.getElementById("overlay").classList.add("display-none");
  document.getElementById("ftt-chart").classList.add("display-none");
}
