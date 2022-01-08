let parentID = window.localStorage.getItem("parent");
if (!parentID) window.open("../Login/Login.html", "_self");

document.getElementById("childDetails").style.display = "none";
fecthPatients().then(function (response) {
  const patients = response;
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
      if (patient.fatherID || patient.motherID) parentChlilds.push(patient);
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
  for (const [key, value] of Object.entries(
    parentChlilds[index].medicineTaken
  )) {
    let div = document.createElement("div");
    let h4Head = document.createElement("h4");
    let inputDiv = document.createElement("div");
    div.classList.add("flex-row-parent");
    h4Head.setAttribute("id", "h4Head");
    h4Head.innerHTML = key;
    inputDiv.innerHTML = value;
    inputDiv.classList.add("input-div");
    div.appendChild(h4Head);
    div.appendChild(inputDiv);
    document.getElementById("medicineList").appendChild(div);
  }
  document.getElementById("treatmentDiv").innerHTML =
    parentChlilds[index].treatment;
  createChart(parentChlilds[index]);
}

function createChart(patient) {
  //if (pateint.gender ==="Male")
  let labelArr = ["0", "6", "12", "18", "24", "36"];
  let fivePercentileArr = ["2.5", "6.4", "8.6", "9.8", "10.6", "12"];
  let tenPercentileArr = ["2.8", "6.8", "9", "10.2", "11.05", "12.43"];
  let twentyFivePercentileArr = ["3.1", "7.3", "9.6", "10.9", "11.8", "13.1"];
  let fiftyPercentileArr = ["3.6", "7.8", "10.3", "11.7", "12.6", "14.3"];
  let seventyFivePercentile = ["4", "8.5", "11.1", "12.6", "13.6", "15.4"];
  let nintyPercentileArr = ["4.3", "9.2", "11.9", "13.5", "14.6", "16.6"];
  let nintyFivePercentileArr = ["4.5", "9.6", "12.4", "14", "15.2", "17.4"];

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
        // {
        //   label: patient.fullName,
        //   data: nintyFivePercentileArr,
        //   borderColor: ["rgba(185, 16, 49, 1)"],
        //   borderWidth: 1,
        //   cubicInterpolationMode: "monotone",
        //   fill: false,
        // },
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
