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

function updateFields(patient) {
  for (const [key, value] of Object.entries(patient.weightsInfo)) {
    document.getElementById(key).innerHTML = value;
  }
  patient.nutriTreatment.forEach((nutri) => {
    document.getElementById("nuritiontDiv").innerHTML += nutri + "<br />";
  });

  patient.medicalTreatment.forEach((meds) => {
    document.getElementById("medicineList").innerHTML += meds + "<br />";
  });

  patient.psychoTreatment.forEach((psy) => {
    document.getElementById("psyList").innerHTML += psy + "<br />";
  });
  for (const [key, value] of Object.entries(patient)) {
    if (document.getElementById(key)) {
      document.getElementById(key).innerHTML = value;
      if (key === "birthDate")
        document.getElementById(key).innerHTML = birthToAge(value);
    }

    if (key === "FTTpercentiles") {
      console.log(patient[key]);
      document.getElementById("currentPercentile").innerHTML =
        patient[key].currentPercentile;
    }
  }
  if (patient.illnesses) {
    illnessDiv = document.getElementById("medicalHistory");
    patient.illnesses.forEach((element, index) => {
      let illness = document.createElement("h5");
      illness.classList.add("illnessesList");
      illness.innerHTML = "Diagnose " + (index + 1) + " - " + element;
      illnessDiv.appendChild(illness);
    });
  }
}

function birthToAge(birthDay) {
  var dateNow = new Date();
  var age = dateNow.getFullYear() - birthDay.substring(0, 4);
  if (parseInt(birthDay.substring(5, 7)) - 1 - dateNow.getMonth() > 0) age--;
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
