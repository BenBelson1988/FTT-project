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
          addLine(flexDiv, patient, "FTTpercentiles");
          addLine(flexDiv, patient, "psychoTreatment");
          addLine(flexDiv, patient, "medicalTreatment");
          addLine(flexDiv, patient, "treatmentProgress");
        });
      });
  });

function addLine(flexDiv, patient, key) {
  let line = document.createElement("div");
  if (key === "birthDate" || key === "id") line.classList.add("flex1");
  else line.classList.add("flex2");
  if (key === "FTTpercentiles") {
    console.log(patient[key].currentPercentile);
    debugger;
    let progress = (
      patient[key].birth - patient[key].currentPercentile
    ).toFixed(2);
    line.innerHTML = patient[key].currentPercentile;
    progress > 1
      ? line.classList.add("red-background")
      : progress >= 0 && progress < 1
      ? line.classList.add("yellow-background")
      : line.classList.add("green-background");
  } else if (key === "birthDate") line.innerHTML = birthToAge(patient[key]);
  else if (key === "psychoTreatment") {
    if (patient[key][0] === "No field chosen.") line.innerHTML = "No";
    else line.innerHTML = "Yes";
  } else if (key === "medicalTreatment")
    patient[key][0] !== "No medical recomendation"
      ? (line.innerHTML = "true")
      : (line.innerHTML = "false");
  else if (key === "psychologhy")
    line.innerHTML = patient.psychologhy["underPsy"];
  else if (key === "treatmentProgress") {
    //create button
    let expandButton = document.createElement("button");
    expandButton.classList.add("button", "peach");
    expandButton.setAttribute("id", "expandButton");
    expandButton.innerHTML = "Click to Expand";
    expandButton.onclick = function () {
      expandTreatment(patient);
    };
    line.appendChild(expandButton);
  } else line.innerHTML = patient[key];
  flexDiv.appendChild(line);
}

function birthToAge(birthDay) {
  var dateNow = new Date();
  var age = dateNow.getFullYear() - birthDay.substring(0, 4);
  if (parseInt(birthDay.substring(5, 7)) - 1 - dateNow.getMonth() > 0) age--;
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
function expandTreatment(patient) {
  document.getElementById("overlay").classList.remove("display-none");
  document.getElementById("ftt-chart").classList.remove("display-none");

  let labelArr = ["0", "6", "12", "18", "24", "36", "48", "60"];
  let fivePercentileArr,
    tenPercentileArr,
    twentyFivePercentileArr,
    fiftyPercentileArr,
    seventyFivePercentile,
    nintyPercentileArr,
    nintyFivePercentileArr;
  if (patient.gender === "Male") {
    fivePercentileArr = [
      "2.5",
      "6.4",
      "8.6",
      "9.8",
      "10.6",
      "12",
      "13.3",
      "14.7",
    ];
    tenPercentileArr = [
      "2.8",
      "6.8",
      "9",
      "10.2",
      "11.05",
      "12.43",
      "13.9",
      "15.5",
    ];
    twentyFivePercentileArr = [
      "3.1",
      "7.3",
      "9.6",
      "10.9",
      "11.8",
      "13.1",
      "15",
      "16.7",
    ];
    fiftyPercentileArr = [
      "3.6",
      "7.8",
      "10.3",
      "11.7",
      "12.6",
      "14.3",
      "16.3",
      "18.3",
    ];
    seventyFivePercentile = [
      "4",
      "8.5",
      "11.1",
      "12.6",
      "13.6",
      "15.4",
      "17.8",
      "20.1",
    ];
    nintyPercentileArr = [
      "4.3",
      "9.2",
      "11.9",
      "13.5",
      "14.6",
      "16.6",
      "19.3",
      "21.9",
    ];
    nintyFivePercentileArr = [
      "4.5",
      "9.6",
      "12.4",
      "14",
      "15.2",
      "17.4",
      "20.2",
      "23",
    ];
  } else {
    fivePercentileArr = [
      "2.5",
      "6",
      "7.3",
      "8.4",
      "9.4",
      "11.3",
      "12.9",
      "14.4",
    ];
    tenPercentileArr = [
      "2.7",
      "6.2",
      "7.7",
      "8.8",
      "9.8",
      "11.8",
      "13.5",
      "15.2",
    ];
    twentyFivePercentileArr = [
      "2.9",
      "6.7",
      "8.2",
      "9.4",
      "10.6",
      "12.7",
      "14.7",
      "16.5",
    ];
    fiftyPercentileArr = [
      "3.2",
      "7.3",
      "8.9",
      "10.2",
      "11.5",
      "13.9",
      "16.1",
      "18.2",
    ];
    seventyFivePercentile = [
      "3.6",
      "7.9",
      "9.7",
      "11.1",
      "12.5",
      "15.1",
      "17.7",
      "20.2",
    ];
    nintyPercentileArr = [
      "3.9",
      "8.5",
      "10.5",
      "12",
      "13.5",
      "16.4",
      "19.3",
      "22.2",
    ];
    nintyFivePercentileArr = [
      "4",
      "8.9",
      "11",
      "12.6",
      "14.2",
      "17.3",
      "20.4",
      "23.5",
    ];
  }
  let fttProgressArr = [];
  fttProgressArr.push(patient.weightsInfo.birth);
  fttProgressArr.push(patient.weightsInfo.sixMonth);
  fttProgressArr.push(patient.weightsInfo.twelveMonth);
  fttProgressArr.push(patient.weightsInfo.eighteenMonth);
  fttProgressArr.push(patient.weightsInfo.twentyFourMonth);
  fttProgressArr.push(patient.weightsInfo.thirtySixMonth);
  fttProgressArr.push(patient.weightsInfo.fourtyEightMonth);
  fttProgressArr.push(patient.weightsInfo.sixtyMonth);
  fttProgressArr.forEach((weight, index) => {
    if (weight === 0) fttProgressArr[index] = "-";
  });

  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labelArr,
      datasets: [
        {
          label: patient.fullName,
          data: fttProgressArr,
          borderColor: ["rgba(185, 16, 49, 1)"],
          borderWidth: 5,
          cubicInterpolationMode: "monotone",
          fill: false,
        },
        {
          label: "5%",
          data: fivePercentileArr,
          borderColor: ["rgba(28,140,188,255)"],
          borderWidth: 1,
          cubicInterpolationMode: "monotone",
          fill: false,
        },
        {
          label: "10%",
          data: tenPercentileArr,
          borderColor: ["rgba(8,84,144,255)"],
          borderWidth: 1,
          cubicInterpolationMode: "monotone",
          fill: false,
        },
        {
          label: "25% ",
          data: twentyFivePercentileArr,
          borderColor: ["rgba(11,72,127,255)"],
          borderWidth: 1,
          cubicInterpolationMode: "monotone",
          fill: false,
        },
        {
          label: "50%",
          data: fiftyPercentileArr,
          borderColor: ["rgba(6,46,107,255)"],
          borderWidth: 1,
          cubicInterpolationMode: "monotone",
          fill: false,
        },
        {
          label: "75%",
          data: seventyFivePercentile,
          borderColor: ["rgba(8, 34, 84, 1)"],
          borderWidth: 1,
          cubicInterpolationMode: "monotone",
          fill: false,
        },
        {
          label: "90%",
          data: nintyPercentileArr,
          borderColor: ["rgba(5, 22, 57, 1)"],
          borderWidth: 1,
          cubicInterpolationMode: "monotone",
          fill: false,
        },
        {
          label: "95%",
          data: nintyFivePercentileArr,
          borderColor: ["rgba(2, 11, 28, 1)"],
          borderWidth: 1,
          cubicInterpolationMode: "monotone",
          fill: false,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Chart.js Line Chart - Cubic interpolation mode",
        },
      },
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
              max:
                parseInt(
                  nintyFivePercentileArr[nintyFivePercentileArr.length - 1]
                ) + 2,
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
