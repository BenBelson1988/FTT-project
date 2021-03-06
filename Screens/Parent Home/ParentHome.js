let parentID = window.localStorage.getItem("parent");
if (!parentID) window.open("../Login/Login.html", "_self");

document.getElementById("childDetails").style.display = "none";
fecthPatients().then(function (response) {
  const patients = response;
  console.log(patients);
  let parent;
  let parentChlilds = [];
  fecthParents().then(function (response1) {
    const parentsList = response1;
    for (let i = 0; i < parentsList.length; i++) {
      if (parentsList[i].ID === parentID) {
        parent = parentsList[i];
        break;
      }
    }
    patients.forEach((patient) => {
      if (patient.fatherID === parent.ID || patient.motherID === parent.ID)
        parentChlilds.push(patient);
    });
    updatePageData(parent, parentChlilds);
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
  return patients;
}

async function fecthParents() {
  const response = await fetch(
    `https://fttell-default-rtdb.firebaseio.com/parents.json`
  );
  const parents = await response.json();
  document.getElementById("loader").classList.add("display-none");
  return parents;
}

function updatePageData(parent, parentChlilds) {
  document.getElementById("welcomeParent").innerHTML =
    "Welcome Back, " + parent.name;
  document.getElementById("fttCalc").innerHTML =
    "FTT treatment calculator free tool";
  document.getElementById("fttButton").classList.remove("display-none");
  if (parentChlilds.length === 0)
    document.getElementById("currentChilds").innerHTML =
      "There are no current childs under treatment, Please contact a doctor";
  else {
    document.getElementById("currentChilds").innerHTML =
      "Click on a child to see full details";
    parentChlilds.forEach((child, index) => {
      let chiledButton = document.createElement("button");
      chiledButton.classList.add("button", "white");
      chiledButton.setAttribute("id", "child" + index);
      chiledButton.innerText = child.fullName;
      chiledButton.onclick = function () {
        fetchChildsDetails(index, parentChlilds);
      };
      document.getElementById("childList").appendChild(chiledButton);
      console.log(child);
    });
  }
}

function fetchChildsDetails(index, parentChlilds) {
  document.getElementById("childDetails").style.display = "flex";
  for (const [key, value] of Object.entries(parentChlilds[index].weightsInfo)) {
    if (value === 0)
      document.getElementById(key + "Div").style.display = "none";
    else {
      document.getElementById(key).innerHTML = value;
    }
  }
  parentChlilds[index].nutriTreatment.forEach((nutri) => {
    document.getElementById("nuritiontDiv").innerHTML += nutri + "<br />";
  });

  parentChlilds[index].medicalTreatment.forEach((meds) => {
    document.getElementById("medicineList").innerHTML += meds + "<br />";
  });

  parentChlilds[index].psychoTreatment.forEach((psy) => {
    document.getElementById("psyList").innerHTML += psy + "<br />";
  });

  createChart(parentChlilds[index]);
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

function openFreeTool() {
  window.open("../FTT Free Tool/FTTFreeTool.html", "_self");
}
