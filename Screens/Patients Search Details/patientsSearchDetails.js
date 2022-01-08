let licenseNumber = window.localStorage.getItem("loggedIn");
if (!licenseNumber) window.open("../Login/Login.html", "_self");
let index = window.localStorage.getItem("index");

document.getElementById("welcome").innerHTML =
  "Welcome back, " + window.localStorage.getItem("name");
let tempPatientID = 0;

document.getElementById("excel-fixed-div").classList.add("display-none");

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

function closeList() {
  document.getElementById("excel-fixed-div").classList.add("display-none");
  document.getElementById("excel-input").value = "";
}

var input = document.getElementById("excel-input");
input.addEventListener("change", function () {
  document.getElementById("loader").classList.remove("display-none");

  readXlsxFile(input.files[0]).then(function (rows) {
    document.getElementById("excel-fixed-div").classList.remove("display-none");
    document.getElementById("loader").classList.add("display-none");
    var excelChildrenArray = [];
    rows.forEach((element, index) => {
      if (index === 0) return;
      let childObject = {
        id: element[1],
        gender: element[2],
        birth: element[3],
        sixMonth: element[4],
        twelveMonth: element[5],
        eighteenMonth: element[6],
        twentyFourMonth: element[7],
        thirtySixMonth: element[8],
        fourtyEightMonth: element[9],
        sixtyMonth: element[10],
      };
      excelChildrenArray.push(childObject);
    });
    excelChildrenArray.forEach((child, index) => {
      let div = document.createElement("div");
      div.setAttribute("id", "excel-headings");
      div.classList.add("flex-row");
      for (const [key, value] of Object.entries(child)) {
        let h4 = document.createElement("h4");
        h4.classList.add("excel-head");
        h4.innerHTML = value;
        div.appendChild(h4);
      }
      let expandButton = document.createElement("button");
      expandButton.classList.add("button", "peach");
      expandButton.setAttribute("id", "expandButton");
      expandButton.innerHTML = "Click to Expand";
      expandButton.onclick = function () {
        expandTreatment(rows[index + 1]);
      };
      div.appendChild(expandButton);
      document.getElementById("excel-list-container").appendChild(div);
    });
  });
});

function expandTreatment(child) {
  let percentilesArr = child.slice(3, 11);

  openChart(percentilesArr, child.gender);
}

function openChart(percentileArr, gender) {
  document
    .getElementById("chart-holder-search")
    .classList.remove("display-none");
  let labelArr = ["0", "6", "12", "18", "24", "36", "48", "60"];
  let fivePercentileArr,
    tenPercentileArr,
    twentyFivePercentileArr,
    fiftyPercentileArr,
    seventyFivePercentile,
    nintyPercentileArr,
    nintyFivePercentileArr;
  if (gender === "Male") {
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

  const ctx = document.getElementById("myChartSearch").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labelArr,
      datasets: [
        {
          label: "patient percentile",
          data: percentileArr,
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

function closeChart() {
  document.getElementById("chart-holder-search").classList.add("display-none");
}
