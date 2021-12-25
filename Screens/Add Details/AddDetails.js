//Check for connection using the local storage
let licenseNumber = window.localStorage.getItem("loggedIn");
if (!licenseNumber) window.open("../Login/Login.html", "_self");
let index = window.localStorage.getItem("index");

document.getElementById("id").value = parseInt(
  window.location.search.substring(window.location.search.length - 9)
);

//Form Object
var formObject = {
  fullName: "",
  id: 0,
  motherName: "",
  motherHeight: 0,
  fatherName: "",
  fatherHeight: 0,
  birthDate: "",
  currentHeight: 0,
  illnesses: [],
  weightInfo: {
    birth: 0,
    sixWeek: 0,
    twelveWeek: 0,
    eighteenWeek: 0,
    twentyFourWeek: 0,
    thirtySixWeek: 0,
    fourtyEightWeek: 0,
    sixtyWeek: 0,
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
  "Eating disorder",
  "Celiac",
  "Malabsorption",
  "Chronic infection",
  "Mood disorder",
];
let tempIlnesess = illnesses;

function addIlness() {
  if (illness === 7) return;
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
  h5.innerText = "Illness" + illness;
  h5.setAttribute("id", "h5Ilness" + illness);
  let comboBox = document.createElement("select");
  comboBox.setAttribute("id", "illness" + illness);
  comboBox.setAttribute("class", "input-illness");
  comboBox.onchange = function () {
    onComboBoxChange(comboBox.id.charAt(comboBox.id.length - 1)); // id="illness1"  --> 1
  };

  let defaultOption = document.createElement("option");
  defaultOption.innerText = "Please select illness";
  defaultOption.disabled = true;//not possible to selec the default message
  defaultOption.selected = true;//the messsage is shown by default
  defaultOption.hidden = true;//impossible to choose the default
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

  console.log(formObject, !formError ? "form is valid" : "form is not valid");
}

//dynamic check for each input.
function inputValidation(inputValue, type) {
  if (
    document.getElementById(inputValue).value === "" &&
    !document.getElementById(inputValue + "Error")
  ) {
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
      ? (formObject.weightInfo[inputValue] =
          document.getElementById(inputValue).value)
      : (formObject[inputValue] = document.getElementById(inputValue).value);
  return true;
}

function goBack() {
  history.back();
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
