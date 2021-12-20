//dummy data
let patientsDetails = {
  fullName: "ben",
  id: "444444444",
  age: "32",
  currentPercentile: 0,
  underPsy: false,
  underMeds: true,
  treatnentProgress: "some progress",
};

function goBack() {
  history.back() ||
    window.open(
      "../Patients Search Details/PatientSerachDetails.html",
      "_self"
    );
}

//for each child
let flexDiv = document.createElement("div");
flexDiv.classList.add("flexDiv");
document.getElementById("listContainer").appendChild(flexDiv);
Object.keys(patientsDetails).forEach((key) => {
  let line = document.createElement("div");
  if (key === "age" || key === "id") line.classList.add("flex1");
  else line.classList.add("flex2");
  if (key === "currentPercentile")
    patientsDetails[key] === 0
      ? line.classList.add("green-background")
      : patientsDetails[key] === "1"
      ? line.classList.add("yellow-background")
      : line.classList.add("red-background");
  line.innerHTML = patientsDetails[key];
  flexDiv.appendChild(line);
});
