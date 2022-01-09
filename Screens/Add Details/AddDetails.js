//Check for connection using the local storage
let licenseNumber = window.localStorage.getItem("loggedIn");
if (!licenseNumber) window.open("../Login/Login.html", "_self");
let index = window.localStorage.getItem("index");

document.getElementById("id").value = parseInt(
  window.location.search.substring(window.location.search.length - 9)
);
if (!document.getElementById("id").value) goBack();

//Form Object
var formObject = {
  fullName: "",
  id: 0,
  motherID: "",
  motherName: "",
  motherHeight: 0,
  fatherID: "",
  fatherName: "",
  fatherHeight: 0,
  birthDate: "",
  currentWeight: 0,
  gender: "",
  isFTT: "",
  FTTpercentiles: "",
  illnesses: [],
  psychoTreatment: [],
  nutritionTreatment: [],
  medicalTreatment: [],
  weightsInfo: {
    birth: 0,
    sixMonth: 0,
    twelveMonth: 0,
    eighteenMonth: 0,
    twentyFourMonth: 0,
    thirtySixMonth: 0,
    fourtyEightMonth: 0,
    sixtyMonth: 0,
  },
};
let formError = false;
document.getElementById("birthDate").max =
  new Date().getFullYear() +
  "-" +
  parseInt(new Date().getMonth() + 1) +
  "-" +
  new Date().getDate();
///////////////illness list care
let illness = 0;
const illnesses = [
  "Occult blood in stool",
  "Reflux",
  "Food allergy",
  "Eating disorder",
  "Celiac",
  "Malabsorption",
  "Chronic infection",
  "Mood disorder",
];
let tempIlnesess = illnesses;

function addIlness() {
  if (illness === 8) return;
  if (illness !== 0) {
    let comboBox = document.getElementById("illness" + illness);
    if (comboBox.selectedOptions[0].text === "Please select illness") {
      return;
    }
    updateIllnessArr();
  }
  illness++;
  let h5 = document.createElement("h5");
  h5.classList.add("h5Details");
  h5.innerText = "Diagnose " + illness;
  h5.setAttribute("id", "h5Ilness" + illness);
  let comboBox = document.createElement("select");
  comboBox.setAttribute("id", "illness" + illness);
  comboBox.setAttribute("class", "input-illness");
  comboBox.onchange = function () {
    onComboBoxChange(comboBox.id.charAt(comboBox.id.length - 1)); // id="illness1"  --> 1
  };

  let defaultOption = document.createElement("option");
  defaultOption.innerText = "Please select illness";
  defaultOption.disabled = true; //not possible to selec the default message
  defaultOption.selected = true; //the messsage is shown by default
  defaultOption.hidden = true; //impossible to choose the default
  comboBox.appendChild(defaultOption);
  for (let i = 0; i < tempIlnesess.length; i++) {
    let option = document.createElement("option");
    option.value = tempIlnesess[i];
    option.innerText = tempIlnesess[i];
    comboBox.appendChild(option);
  }
  document.getElementById("illness-list").appendChild(h5);
  document.getElementById("illness-list").appendChild(comboBox);
}

function removeIlness() {
  let ilnessList = document.getElementById("illness-list");
  if (!ilnessList.hasChildNodes()) return;
  ilnessList.removeChild(document.getElementById("illness" + illness));
  ilnessList.removeChild(document.getElementById("h5Ilness" + illness));
  illness--;
  updateIllnessArr();
}

function updateIllnessArr() {
  let tempArrills = [];
  for (let i = 1; i < illness + 1; i++) {
    tempArrills.push(
      document.getElementById("illness" + i).selectedOptions[0].text
    );
  }
  tempIlnesess = illnesses.filter((ill) => {
    return !tempArrills.includes(ill);
  });
}

function onComboBoxChange(id) {
  let ilnessList = document.getElementById("illness-list");
  for (let i = parseInt(id) + 1; i < illnesses.length; i++) {
    let comboBox = document.getElementById("illness" + i);
    if (!comboBox) break;
    ilnessList.removeChild(document.getElementById("illness" + i));
    ilnessList.removeChild(document.getElementById("h5Ilness" + i));
    illness--;
  }
  updateIllnessArr();
}
/////////end of illness list care

//onChange
function onChangeInput(inputType) {
  if (
    document.getElementById(inputType).value !== "" &&
    document.getElementById(inputType + "Error")
  )
    document
      .getElementById(inputType)
      .parentElement.removeChild(document.getElementById(inputType + "Error"));
}

//Form Submit
function submitForm() {
  formError = false;
  //Basic Info handle
  Array.from(document.getElementById("basic-info-form").elements).forEach(
    (element) => {
      inputValidation(element.id);
    }
  );
  //Illnesses handle
  Array.from(document.getElementsByClassName("input-illness")).forEach(
    (element) => {
      if (
        element.selectedOptions[0].innerHTML !== "Please select illness" &&
        !formObject.illnesses.includes(element.selectedOptions[0].innerHTML)
      )
        formObject.illnesses.push(element.selectedOptions[0].innerHTML);
    }
  );

  Array.from(document.getElementById("weight-info").elements).forEach(
    (element) => {
      inputValidation(element.id, "weight");
    }
  );

  if (formError) return;
  let childPercentile = claculateFTTPercentile(); /////we have all the percentiles of a child
  let percentilesArr = percentiletoArray(childPercentile);
  let isFTTexist = calculateIfFTTexist(percentilesArr); //if isFTTexist is true it means that there is ftt
  const currentChildPercentile = childPercentile.currentPercentile; //the current child percentile
  let psychoAssessmentArr = fecthQuestion();
  let psychoSocialRecommendation = getPsychoRecommendation(psychoAssessmentArr); //here we finished psycosocial recommendations
  let medicalRecommendation = getMedicalRecommendation(formObject.illnesses); //here we finished medical recommendations
  let nutritionRecommendations = [];
  if (isFTTexist)
    nutritionRecommendations = getNutritionRecommendations(percentilesArr[0]);
  else
    nutritionRecommendations.push[
      "No FTT diagnosed, no need for special diet."
    ]; //here we have nutrition recommendations
  formObject = {
    ...formObject,
    FTTpercentiles: childPercentile,
    psychoTreatment: psychoSocialRecommendation,
    nutriTreatment: nutritionRecommendations,
    medicalTreatment: medicalRecommendation,
    isFTT: isFTTexist,
  };

  addPatientToDataBase(formObject);
  fillTreatment(formObject);
}

//dynamic check for each input.
function inputValidation(inputValue, type) {
  if (
    document.getElementById(inputValue).value === "" &&
    !document.getElementById(inputValue + "Error")
  ) {
    if (type === "weight" && inputValue !== "birth") return;
    let error = document.createElement("p");
    error.setAttribute("id", inputValue + "Error");
    error.classList.add("error");
    error.innerHTML = "This field is required. Please fill in.";
    document
      .getElementById(inputValue)
      .parentNode.insertBefore(
        error,
        document.getElementById(inputValue).nextSibling
      );
    formError = true;
    return false;
  } else
    type === "weight"
      ? (formObject.weightsInfo[inputValue] =
          document.getElementById(inputValue).value)
      : (formObject[inputValue] = document.getElementById(inputValue).value);
  return true;
}

function goBack() {
  history.back() ||
    window.open(
      "../Patients Search Details/PatientSearchDetails.html",
      "_self"
    );
}

//logout user from DB
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

function percentiletoArray(childPercentile) {
  let arr = [];
  arr.push(childPercentile.birth);
  arr.push(childPercentile.sixMonth);
  arr.push(childPercentile.twelveMonth);
  arr.push(childPercentile.eighteenMonth);
  arr.push(childPercentile.twentyFourMonth);
  arr.push(childPercentile.thirtySixMonth);
  arr.push(childPercentile.fourtyEightMonth);
  arr.push(childPercentile.sixtyMonth);
  return arr;
}

function claculateFTTPercentile() {
  var percentilesByAge = {
    birth: 0,
    sixMonth: 0,
    twelveMonth: 0,
    eighteenMonth: 0,
    twentyFourMonth: 0,
    thirtySixMonth: 0,
    fourtyEightMonth: 0,
    sixtyMonth: 0,
    currentPercentile: 0,
    lastMeasureHappend: 0,
  };
  //let currentMonth = birthToAge(formObject.birthDate);
  let lastMeasureHappend = (percentilesByAge.lastMeasureHappend =
    currentPercentileCalc());
  formObject.weightsInfo.birth
    ? (percentilesByAge.birth = birthPercentile())
    : (percentilesByAge.birth = -1);
  formObject.weightsInfo.sixMonth
    ? (percentilesByAge.sixMonth = sixMonthPercentile())
    : (percentilesByAge.sixMonth = -1);
  formObject.weightsInfo.twelveMonth
    ? (percentilesByAge.twelveMonth = twelveMonthPercentile())
    : (percentilesByAge.twelveMonth = -1);
  formObject.weightsInfo.eighteenMonth
    ? (percentilesByAge.eighteenMonth = eighteenMonthPercentile())
    : (percentilesByAge.eighteenMonth = -1);
  formObject.weightsInfo.twentyFourMonth
    ? (percentilesByAge.twentyFourMonth = twentyFourMonthPercentile())
    : (percentilesByAge.twentyFourMonth = -1);
  formObject.weightsInfo.thirtySixMonth
    ? (percentilesByAge.thirtySixMonth = thirtySixMonthMonthPercentile())
    : (percentilesByAge.thirtySixMonth = -1);
  formObject.weightsInfo.fourtyEightMonth
    ? (percentilesByAge.fourtyEightMonth = fortyEightMonthMonthPercentile())
    : (percentilesByAge.fourtyEightMonth = -1);
  formObject.weightsInfo.sixtyMonth
    ? (percentilesByAge.sixtyMonth = sixtyMonthMonthPercentile())
    : (percentilesByAge.sixtyMonth = -1);

  if (lastMeasureHappend === 0)
    percentilesByAge.currentPercentile = percentilesByAge.birth;
  if (lastMeasureHappend === 6)
    percentilesByAge.currentPercentile = percentilesByAge.sixMonth;
  if (lastMeasureHappend === 12)
    percentilesByAge.currentPercentile = percentilesByAge.twelveMonth;
  if (lastMeasureHappend === 18)
    percentilesByAge.currentPercentile = percentilesByAge.eighteenMonth;
  if (lastMeasureHappend === 24)
    percentilesByAge.currentPercentile = percentilesByAge.twentyFourMonth;
  if (lastMeasureHappend === 36)
    percentilesByAge.currentPercentile = percentilesByAge.thirtySixMonth;
  if (lastMeasureHappend === 48)
    percentilesByAge.currentPercentile = percentilesByAge.fourtyEightMonth;
  if (lastMeasureHappend === 60)
    percentilesByAge.currentPercentile = percentilesByAge.sixtyMonth;
  return percentilesByAge;
}

function birthPercentile() {
  let bw = formObject.weightsInfo.birth;
  let percentile = 0;
  if (formObject.gender === "Male") {
    if (bw < 2.6) percentile = "0";
    else if (bw >= 2.6 && bw < 2.8) percentile = "5";
    else if (bw >= 2.8 && bw < 3) percentile = "10";
    else if (bw >= 3 && bw < 3.3) percentile = "25";
    else if (bw >= 3.3 && bw < 3.7) percentile = "50";
    else if (bw >= 3.7 && bw < 4) percentile = "75";
    else if (bw >= 4 && bw < 4.2) percentile = "90";
    else if (bw >= 4.2) percentile = "95";
    else percentile = "99";
  }
  if (formObject.gender === "Female") {
    if (bw < 2.5) percentile = "0";
    else if (bw >= 2.5 && bw < 2.7) percentile = "5";
    else if (bw >= 2.7 && bw < 2.9) percentile = "10";
    else if (bw >= 2.9 && bw < 3.2) percentile = "25";
    else if (bw >= 3.2 && bw < 3.6) percentile = "50";
    else if (bw >= 3.6 && bw < 3.9) percentile = "75";
    else if (bw >= 3.9 && bw < 4) percentile = "90";
    else if (bw >= 4) percentile = "95";
    else percentile = "99";
  }
  return percentile;
}

function sixMonthPercentile() {
  let w6 = formObject.weightsInfo.sixMonth;

  if (formObject.gender === "Male") {
    if (w6 < 6.6) return "0";
    if (w6 >= 6.6 && w6 < 6.9) return "5";
    if (w6 >= 6.9 && w6 < 7.4) return "10";
    if (w6 >= 7.4 && w6 < 7.9) return "25";
    if (w6 >= 7.9 && w6 < 8.5) return "50";
    if (w6 >= 8.5 && w6 < 9.1) return "75";
    if (w6 >= 9.1 && w6 < 9.5) return "90";
    if (w6 >= 9.5) return "95";
  }
  if (formObject.gender === "Female") {
    if (w6 < 6) return "0";
    if (w6 >= 6 && w6 < 6.2) return "5";
    if (w6 >= 6.2 && w6 < 6.7) return "10";
    if (w6 >= 6.7 && w6 < 7.3) return "25";
    if (w6 >= 7.3 && w6 < 7.9) return "50";
    if (w6 >= 7.9 && w6 < 8.5) return "75";
    if (w6 >= 8.5 && w6 < 8.9) return "90";
    if (w6 >= 8.9) return "95";
  }
  return "99";
}

function twelveMonthPercentile() {
  let w12 = formObject.weightsInfo.twelveMonth;
  if (formObject.gender === "Male") {
    if (w12 < 8.1) return "0";
    if (w12 >= 8.1 && w12 < 8.4) return "5";
    if (w12 >= 8.4 && w12 < 9) return "10";
    if (w12 >= 9 && w12 < 9.6) return "25";
    if (w12 >= 9.6 && w12 < 10.4) return "50";
    if (w12 >= 10.4 && w12 < 11.1) return "75";
    if (w12 >= 11.1 && w12 < 11.5) return "90";
    if (w12 >= 11.5) return "95";
  }
  if (formObject.gender === "Female") {
    if (w12 < 7.3) return "0";
    if (w12 >= 7.3 && w12 < 7.7) return "5";
    if (w12 >= 7.7 && w12 < 8.2) return "10";
    if (w12 >= 8.2 && w12 < 8.9) return "25";
    if (w12 >= 8.9 && w12 < 9.7) return "50";
    if (w12 >= 9.7 && w12 < 10.5) return "75";
    if (w12 >= 10.5 && w12 < 11) return "90";
    if (w12 >= 11) return "95";
  }
  return "99";
}

function eighteenMonthPercentile() {
  let w18 = formObject.weightsInfo.eighteenMonth;
  if (formObject.gender === "Male") {
    if (w18 < 9.1) return "0";
    if (w18 >= 9.1 && w18 < 9.5) return "5";
    if (w18 >= 9.5 && w18 < 10.1) return "10";
    if (w18 >= 10.1 && w18 < 10.9) return "25";
    if (w18 >= 10.9 && w18 < 11.8) return "50";
    if (w18 >= 11.8 && w18 < 12.6) return "75";
    if (w18 >= 12.6 && w18 < 13.1) return "90";
    if (w18 >= 13.1) return "95";
  }
  if (formObject.gender === "Female") {
    if (w18 < 8.4) return "0";
    if (w18 >= 8.4 && w18 < 8.8) return "5";
    if (w18 >= 8.8 && w18 < 9.4) return "10";
    if (w18 >= 9.4 && w18 < 10.2) return "25";
    if (w18 >= 10.2 && w18 < 11.1) return "50";
    if (w18 >= 11.1 && w18 < 12) return "75";
    if (w18 >= 12 && w18 < 12.6) return "90";
    if (w18 >= 12.6) return "95";
  }
  return "99";
}

function twentyFourMonthPercentile() {
  let w24 = formObject.weightsInfo.twentyFourMonth;
  if (formObject.gender === "Male") {
    if (w24 < 10.1) return "0";
    if (w24 >= 10.1 && w24 < 10.5) return "5";
    if (w24 >= 10.5 && w24 < 11.3) return "10";
    if (w24 >= 11.3 && w24 < 12.2) return "25";
    if (w24 >= 12.2 && w24 < 13.1) return "50";
    if (w24 >= 13.1 && w24 < 14.1) return "75";
    if (w24 >= 14.1 && w24 < 14.7) return "90";
    if (w24 >= 14.7) return "95";
  }
  if (formObject.gender === "Female") {
    if (w24 < 9.4) return "0";
    if (w24 >= 9.4 && w24 < 9.8) return "5";
    if (w24 >= 9.8 && w24 < 10.6) return "10";
    if (w24 >= 10.6 && w24 < 11.5) return "25";
    if (w24 >= 11.5 && w24 < 12.5) return "50";
    if (w24 >= 12.5 && w24 < 13.5) return "75";
    if (w24 >= 13.5 && w24 < 14.2) return "90";
    if (w24 >= 14.2) return "95";
  }
  return "99";
}

function thirtySixMonthMonthPercentile() {
  let w36 = formObject.weightsInfo.thirtySixMonth;
  if (formObject.gender === "Male") {
    if (w36 < 11.8) return "0"; //
    if (w36 >= 11.8 && w36 < 12.3) return "5";
    if (w36 >= 12.3 && w36 < 13.2) return "10";
    if (w36 >= 13.2 && w36 < 14.3) return "25";
    if (w36 >= 14.3 && w36 < 15.6) return "50";
    if (w36 >= 15.6 && w36 < 16.8) return "75";
    if (w36 >= 16.8 && w36 < 17.5) return "90";
    if (w36 >= 17.5) return "95";
  }
  if (formObject.gender === "Female") {
    if (w36 < 11.3) return "0";
    if (w36 >= 11.3 && w36 < 11.8) return "5";
    if (w36 >= 11.8 && w36 < 12.7) return "10";
    if (w36 >= 12.7 && w36 < 13.9) return "25";
    if (w36 >= 13.9 && w36 < 15.1) return "50";
    if (w36 >= 15.1 && w36 < 16.4) return "75";
    if (w36 >= 16.4 && w36 < 17.3) return "90";
    if (w36 >= 17.3) return "95";
  }
  return "99";
}

function fortyEightMonthMonthPercentile() {
  let w48 = formObject.weightsInfo.fourtyEightMonth;
  if (formObject.gender === "Male") {
    if (w48 < 13.3) return "0";
    if (w48 >= 13.3 && w48 < 13.9) return "5";
    if (w48 >= 13.9 && w48 < 15) return "10";
    if (w48 >= 15 && w48 < 16.3) return "25";
    if (w48 >= 16.3 && w48 < 17.8) return "50";
    if (w48 >= 17.8 && w48 < 19.3) return "75";
    if (w48 >= 19.3 && w48 < 20.2) return "90";
    if (w48 >= 20.2) return "95";
  }
  if (formObject.gender === "Female") {
    if (w48 < 12.9) return "0";
    if (w48 >= 12.9 && w48 < 13.5) return "5";
    if (w48 >= 13.5 && w48 < 14.7) return "10";
    if (w48 >= 14.7 && w48 < 16.1) return "25";
    if (w48 >= 16.1 && w48 < 17.7) return "50";
    if (w48 >= 17.7 && w48 < 19.3) return "75";
    if (w48 >= 19.3 && w48 < 20.4) return "90";
    if (w48 >= 20.4) return "95";
  }
  return "99";
}

function sixtyMonthMonthPercentile() {
  let w60 = formObject.weightsInfo.sixtyMonth;
  if (formObject.gender === "Male") {
    if (w60 < 14.7) return "0";
    if (w60 >= 14.7 && w60 < 15.5) return "5";
    if (w60 >= 15.5 && w60 < 16.7) return "10";
    if (w60 >= 16.7 && w60 < 18.3) return "25";
    if (w60 >= 18.3 && w60 < 20.1) return "50";
    if (w60 >= 20.1 && w60 < 21.9) return "75";
    if (w60 >= 21.9 && w60 < 23) return "90";
    if (w60 >= 23) return "95";
  }
  if (formObject.gender === "Female") {
    if (w60 < 14.4) return "0";
    if (w60 >= 14.4 && w60 < 15.2) return "5";
    if (w60 >= 15.2 && w60 < 16.5) return "10";
    if (w60 >= 16.5 && w60 < 18.2) return "25";
    if (w60 >= 18.2 && w60 < 20.2) return "50";
    if (w60 >= 20.2 && w60 < 22.2) return "75";
    if (w60 >= 22.2 && w60 < 23.5) return "90";
    if (w60 >= 23.5) return "95";
  }
  return "99";
}

function birthToAge(birthDay) {
  var dateNow = new Date();
  let month;
  var age = dateNow.getFullYear() - birthDay.substring(0, 4);
  if (birthDay.substring(5, 7) - dateNow.getMonth() + 1 > 0) {
    age--;
    month = 12 - birthDay.substring(5, 7) - dateNow.getMonth() + 1;
  } else
    month = parseInt(dateNow.getMonth()) - parseInt(birthDay.substring(5, 7));
  let finalCalculationOfMonths = 12 * age + month;
  return finalCalculationOfMonths;
}

function currentPercentileCalc() {
  let lastMeasure = 0;
  if (formObject.weightsInfo.birth !== 0) lastMeasure = 0;
  if (formObject.weightsInfo.sixMonth !== 0) lastMeasure = 6;
  if (formObject.weightsInfo.twelveMonth !== 0) lastMeasure = 12;
  if (formObject.weightsInfo.eighteenMonth !== 0) lastMeasure = 18;
  if (formObject.weightsInfo.twentyFourMonth !== 0) lastMeasure = 24;
  if (formObject.weightsInfo.thirtySixMonth !== 0) lastMeasure = 36;
  if (formObject.weightsInfo.fourtyEightMonth !== 0) lastMeasure = 48;
  if (formObject.weightsInfo.sixtyMonth !== 0) lastMeasure = 60;
  return lastMeasure;
}

function calculateIfFTTexist(percentilesArray) {
  debugger;
  let LastIndexChecked = 0;
  let firstIndex;
  let birthPercentile = percentilesArray[0];

  let allThePercentiles = ["95", "90", "75", "50", "25", "10", "5", "0"];
  for (let i = 0; i < allThePercentiles.length; i++) {
    if (birthPercentile === allThePercentiles[i]) {
      firstIndex = i;
    }
    if (percentilesArray[i] !== -1) LastIndexChecked = i;
  }
  for (let i = 0; i < allThePercentiles.length; i++) {
    if (percentilesArray[LastIndexChecked] === allThePercentiles[i]) {
      LastIndexChecked = i;
      break;
    }
  }

  if (LastIndexChecked > 3) return true; //means there is FTT

  if (LastIndexChecked - firstIndex > 1)
    //2 majot percentiles broken
    return true; // there is FTT
  return false; /// there is no FTT
}

function fecthQuestion() {
  let questionObject = [];
  Array.from(document.getElementsByClassName("input-question")).forEach(
    (element) => {
      questionObject.push(element.checked);
    }
  );
  return questionObject;
}

function getPsychoRecommendation(psychoAssessmentArr) {
  let recomendationArray = [];
  let allRecommendation = [
    "There is an attitude not to push a child to eat. Instead, give the child the access to healthy and nutritious food regularly.",
    "Parent guidence might help,in order to precise food quantity, and make the enviromental conditions optimal for child eating. ",
    "Quiet feeding enviroment might help the chid to eat. Consider to isolate the child during meal time.",
    "Exposure to different texture might help the child to adopt favorite texture, and eat more. Be aware to food or texure the child likes.",
    "If a child eats better when distracted(by TV for example), you may consider distraction as feeding help. Don't use it as a conditioning.",
    "Nerve stimulation might be caused by textures or look of food. Consider adjustment of food.",
    "The act of taking medicines might be difficult for a child, consider medicines that look like candies.",
    "Reduce mental pressure and noisy enviroment.",
    "Large variety of food might confuse the child.",
    "Let the child determine the food amount he/she eats.",
    "Conditions related to food are not recommended",
  ];
  if (!psychoAssessmentArr.includes(true)) {
    recomendationArray.push("No field chosen.");
    return recomendationArray;
  }
  psychoAssessmentArr.forEach((question, index) => {
    if (index === 7) {
      if (question === false) recomendationArray.push(allRecommendation[index]);
      return;
    }
    if (question === true) recomendationArray.push(allRecommendation[index]);
  });
  return recomendationArray;
}

function getMedicalRecommendation(patientIllnesses) {
  let recomendationArray = [];

  patientIllnesses.forEach((ilness, index) => {
    if (ilness === "Reflux")
      recomendationArray.push(
        ilness +
          ": Nutrition change to 'Anti reflux' formula, anti acids, smaller more frequent feedings, feed while child is elevated."
      );
    if (ilness === "Occult blood in stool")
      recomendationArray.push(
        ilness +
          ": Nutrition change to hypoallergenic formula, check for inflammatory bowel disease."
      );
    if (ilness === "Food allergy")
      recomendationArray.push(
        ilness +
          ": Allergy skin test, Avoid the allergan detected, if breast fade-mom should avoid the alergan."
      );
    if (ilness === "Eating disorder")
      recomendationArray.push(
        ilness +
          ": Eating disorder clinic, psychiatric assessment, folic acid, vitamins, protein, zinc."
      );
    if (ilness === "Celiac")
      recomendationArray.push(ilness + ": Avoid gluten containing foods.");
    if (ilness === "Malabsorption")
      recomendationArray.push(
        ilness +
          ": Nutritional supplement(such as 'pedisure'), reduce sweet drinks."
      );
    if (ilness === "Chronic infection")
      recomendationArray.push(ilness + ": Antibiotics+anti-acids.");
    if (ilness === "Mood disorder")
      recomendationArray.push(ilness + ": psychiatric assessment.");
  });
  if (!recomendationArray) recomendationArray.push("No medical recomendation");
  return recomendationArray;
}

function getNutritionRecommendations(birthPercentile) {
  boysFivePercentileArr = [
    "2.5",
    "6.4",
    "8.6",
    "9.8",
    "10.6",
    "12",
    "13.3",
    "14.7",
  ];
  boysTenPercentileArr = [
    "2.8",
    "6.8",
    "9",
    "10.2",
    "11.05",
    "12.43",
    "13.9",
    "15.5",
  ];
  boysTwentyFivePercentileArr = [
    "3.1",
    "7.3",
    "9.6",
    "10.9",
    "11.8",
    "13.1",
    "15",
    "16.7",
  ];
  boysFiftyPercentileArr = [
    "3.6",
    "7.8",
    "10.3",
    "11.7",
    "12.6",
    "14.3",
    "16.3",
    "18.3",
  ];
  boysSeventyFivePercentile = [
    "4",
    "8.5",
    "11.1",
    "12.6",
    "13.6",
    "15.4",
    "17.8",
    "20.1",
  ];
  boysNintyPercentileArr = [
    "4.3",
    "9.2",
    "11.9",
    "13.5",
    "14.6",
    "16.6",
    "19.3",
    "21.9",
  ];
  boysNintyFivePercentileArr = [
    "4.5",
    "9.6",
    "12.4",
    "14",
    "15.2",
    "17.4",
    "20.2",
    "23",
  ];
  girlsFivePercentileArr = [
    "2.5",
    "6",
    "7.3",
    "8.4",
    "9.4",
    "11.3",
    "12.9",
    "14.4",
  ];
  girlsTenPercentileArr = [
    "2.7",
    "6.2",
    "7.7",
    "8.8",
    "9.8",
    "11.8",
    "13.5",
    "15.2",
  ];
  girlsTwentyFivePercentileArr = [
    "2.9",
    "6.7",
    "8.2",
    "9.4",
    "10.6",
    "12.7",
    "14.7",
    "16.5",
  ];
  girlsFiftyPercentileArr = [
    "3.2",
    "7.3",
    "8.9",
    "10.2",
    "11.5",
    "13.9",
    "16.1",
    "18.2",
  ];
  girlsSeventyFivePercentile = [
    "3.6",
    "7.9",
    "9.7",
    "11.1",
    "12.5",
    "15.1",
    "17.7",
    "20.2",
  ];
  girlsNintyPercentileArr = [
    "3.9",
    "8.5",
    "10.5",
    "12",
    "13.5",
    "16.4",
    "19.3",
    "22.2",
  ];
  girlsNintyFivePercentileArr = [
    "4",
    "8.9",
    "11",
    "12.6",
    "14.2",
    "17.3",
    "20.4",
    "23.5",
  ];
  let recomendationArray = [];
  recomendationArray = [
    "*NOTICE* - The doses recommeded below are total daily doses.",
  ];
  let ageMonths = birthToAge(formObject.birthDate); //age of child
  let closestMonthIndex = getLastPercentile(ageMonths);
  let expectedWeight;
  birthPercentile = parseInt(birthPercentile);
  if ((formObject.gender = "Male")) {
    if (birthPercentile === 5 || birthPercentile === 0) {
      expectedWeight = boysFivePercentileArr[closestMonthIndex];
    }
    if (birthPercentile === 10) {
      expectedWeight = boysTenPercentileArr[closestMonthIndex];
    }
    if (birthPercentile === 25) {
      expectedWeight = boysTwentyFivePercentileArr[closestMonthIndex];
    }
    if (birthPercentile === 50) {
      expectedWeight = boysFiftyPercentileArr[closestMonthIndex];
    }
    if (birthPercentile === 75) {
      expectedWeight = boysSeventyFivePercentile[closestMonthIndex];
    }
    if (birthPercentile === 90) {
      expectedWeight = boysNintyPercentileArr[closestMonthIndex];
    }
    if (birthPercentile === 95) {
      expectedWeight = boysNintyFivePercentileArr[closestMonthIndex];
    }
  } else {
    if (birthPercentile === 5 || birthPercentile === 0) {
      expectedWeight = girlsFivePercentileArr[closestMonthIndex];
    }
    if (birthPercentile === 10) {
      expectedWeight = girlsTenPercentileArr[closestMonthIndex];
    }
    if (birthPercentile === 25) {
      expectedWeight = girlsTwentyFivePercentileArr[closestMonthIndex];
    }
    if (birthPercentile === 50) {
      expectedWeight = girlsFiftyPercentileArr[closestMonthIndex];
    }
    if (birthPercentile === 75) {
      expectedWeight = girlsSeventyFivePercentile[closestMonthIndex];
    }
    if (birthPercentile === 90) {
      expectedWeight = girlsNintyPercentileArr[closestMonthIndex];
    }
    if (birthPercentile === 95) {
      expectedWeight = girlsNintyFivePercentileArr[closestMonthIndex];
    }
  }
  let currentAge = ageMonths / 12;
  if (currentAge <= 2) {
    recomendationArray.push("Calcium: 700 miligram");
    recomendationArray.push("Fibers: 19 gram");
    recomendationArray.push("B12&B-vitamins: 0.5 microgram");
    recomendationArray.push("D vitamin: 8.5 microgram");
    recomendationArray.push("E vitamin: 200 microgram");
    recomendationArray.push("A vitamin: 550 microgram");
    recomendationArray.push("C vitamin: 15 miligram");
    recomendationArray.push("Iron: 10 miligram");
    recomendationArray.push("Zinc: 9 miligram");
    recomendationArray.push("protein: " + expectedWeight * 1.5);
    recomendationArray.push("Calories intake: " + 120 * expectedWeight);
  }
  if (currentAge > 2 && currentAge <= 3) {
    recomendationArray.push("Calcium: 700 miligram");
    recomendationArray.push("Fibers: 19 gram");
    recomendationArray.push("B12&B-vitamins: 0.9 microgram");
    recomendationArray.push("D vitamin: 10 microgram");
    recomendationArray.push("E vitamin: 200 microgram");
    recomendationArray.push("A vitamin: 600 microgram");
    recomendationArray.push("C vitamin: 15 miligram");
    recomendationArray.push("Iron: 10 miligram");
    recomendationArray.push("Zinc: 9 miligram");
    recomendationArray.push("protein: " + expectedWeight * 1.5);
    recomendationArray.push(
      "Calories intake: " + (120 * expectedWeight) / formObject.currentWeight
    );
  }
  if (currentAge > 3) {
    recomendationArray.push("Calcium: 1000 miligram");
    recomendationArray.push("Fibers: 25 gram");
    recomendationArray.push("B12&B-vitamins: 1.2 microgram");
    recomendationArray.push("D vitamin: 10 microgram");
    recomendationArray.push("E vitamin: 300 microgram");
    recomendationArray.push("A vitamin: 900 microgram");
    recomendationArray.push("C vitamin: 25 miligram");
    recomendationArray.push("Iron: 15 miligram");
    recomendationArray.push("Total amount Zinc: 9 miligram");
    recomendationArray.push("protein: " + expectedWeight * 1.5);
    recomendationArray.push(
      "Calories intake: " + (120 * expectedWeight) / formObject.currentWeight
    );
  }
  return recomendationArray;
}

function getLastPercentile(ageMonths) {
  if (ageMonths < 9) return 1;
  if (ageMonths < 15) return 2;
  if (ageMonths < 22) return 3;
  if (ageMonths < 31) return 4;
  if (ageMonths < 43) return 5;
  if (ageMonths < 55) return 6;
  return 7;
}

function getMedicalRecommendationForUnsignedParent(patientIllnesses) {
  let recomendationArray = [];

  patientIllnesses.forEach((ilness, index) => {
    if (ilness === "Vomiting immidiately after feeding")
      recomendationArray.push(
        ilness +
          ": Ask doctor for abdominal US-in order to deprive pyloric stenosys."
      );
    if (
      ilness ===
      "The child is vomiting chronicly, without preceding nausea/suffers from heartburn, cough, abdominal pain."
    )
      recomendationArray.push(
        ilness +
          ": Ask the doctor for esophageal PH monitoring-in order to deprive GERD."
      );
    if (ilness === "The child suffers from diarrhea and abdominal bloating.")
      recomendationArray.push(
        ilness +
          ": Abstain of gluten products, and ask the doctor for blood antibody testing to deprive celiac."
      );
    if (
      ilness ===
      "Fat- steatorrhea (yellow, floating stool), vitamins A,D,E,K deficiency symptoms.Protein- Peripheral edema"
    )
      recomendationArray.push(
        ilness +
          ": Ask the doctor for stool test in order to deprive malabsorption."
      );
    if (
      ilness ===
      "Fat in stool (steatorrhea), chronic respiratory infections, chronic cough"
    )
      recomendationArray.push(
        ilness +
          ": Ask the doctor for sweat chloride test to deprive cystic fibrosis."
      );
    if (
      ilness === "Black stool, mucus in stool, abdo,inal pain,perianal desease"
    )
      recomendationArray.push(
        ilness +
          ": stool tests- in order to deprive inflammatory bowel desease."
      );
    if (ilness === "Abdominal pain between meals and early in the morning")
      recomendationArray.push(
        ilness + ": Ask the doctor for H. pylori stool antigen test."
      );
    if (
      ilness ===
      "The child is having a lot of bad mood moments or bad mood lasts for a longer period of time. "
    )
      recomendationArray.push(ilness + ": Ask the doctor about mood disorder.");
    if (
      ilness ===
      "Repeated regurgitation of food, Bad breath or tooth decay, refuse to eat,picky eating, abnormal eating behaviour. "
    )
      recomendationArray.push(ilness + ": Ask the doctor about mood disorder.");
  });
  return recomendationArray;
}

async function fecthPatients() {
  const response = await fetch(
    `https://fttell-default-rtdb.firebaseio.com/patients.json`
  );
  const patients = await response.json();
  return patients;
}

async function fecthDoctorPatients() {
  const pateintsResponse = await fetch(
    `https://fttell-default-rtdb.firebaseio.com/doctors/${index}/patientsList.json`
  );
  return await pateintsResponse.json();
}

async function addPatientToDataBase(childObject) {
  let [patients, doctorPatients] = await Promise.allSettled([
    fecthPatients(),
    fecthDoctorPatients(),
  ]);
  doctorPatients.value.push(childObject.id);
  patients.value.push(childObject);
  fetch(`https://fttell-default-rtdb.firebaseio.com/patients.json`, {
    method: "PUT",
    body: JSON.stringify(patients.value),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  fetch(
    `https://fttell-default-rtdb.firebaseio.com/doctors/${index}/patientsList.json`,
    {
      method: "PUT",
      body: JSON.stringify(doctorPatients.value),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
}

function closeTreatment() {
  document.getElementById("treatment-fixed-div").classList.add("display-none");
  document.getElementById("nuritiontDiv").innerHTML = "";
  document.getElementById("medicineList").innerHTML = "";
  document.getElementById("psyList").innerHTML = "";
  document.getElementById("suffers").innerHTML = "";
}

function fillTreatment(formObject) {
  document
    .getElementById("treatment-fixed-div")
    .classList.remove("display-none");

  formObject.nutriTreatment.forEach((nutri) => {
    document.getElementById("nuritiontDiv").innerHTML += nutri + "<br />";
  });

  formObject.medicalTreatment.forEach((meds) => {
    document.getElementById("medicineList").innerHTML += meds + "<br />";
  });

  formObject.psychoTreatment.forEach((psy) => {
    document.getElementById("psyList").innerHTML += psy + "<br />";
  });

  document.getElementById("suffers").innerHTML = formObject.isFTT
    ? formObject.fullName + " seem to be suffer from FTT."
    : formObject.fullName + " don't seem to suffer from FTT.";
  if (parseInt(formObject.FTTpercentiles.currentPercentile) <= 25)
    document.getElementById("suffers").innerHTML +=
      "<br />" +
      "The patient is in 25 percetile or less. Please consider hospitalization.";
  createChart(formObject);
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
