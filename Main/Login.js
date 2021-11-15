// localStorage.clear();
// const myStorage = window.localStorage;

const tabs = document.querySelector(".wrapper");
const tabButton = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".content");

tabs.onclick = (e) => {
  const id = e.target.dataset.id;
  if (id) {
    tabButton.forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");

    contents.forEach((content) => {
      content.classList.remove("active");
    });
    const element = document.getElementById(id);
    element.classList.add("active");
  }
};

doctorLogIn = (e) => {
  e.preventDefault();

  let licenseNumber = document.getElementById("doctorForm").elements[0].value;
  let doctorPassword = document.getElementById("doctorForm").elements[1].value;

  if (licenseNumber === "") {
    document.getElementById("licenseError").innerHTML =
      "Please fill license number.";
    return;
  }

  if (doctorPassword === "") {
    document.getElementById("doctorPasswordError").innerHTML =
      "Please fill password.";
    return;
  }

  fetch("../JSON/login.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      data.doctors.forEach((element, index) => {
        if (licenseNumber === element.licenseNumber);
        else {
          document.getElementById("licenseError").innerHTML =
            "The entered license number doesn't exist.";
          return;
        }
        if (data.doctors[index].password === doctorPassword) {
          window.open("PatientSerachDetails.html", "_self");
          // localStorage.setItem("ActiveUser", data.doctors[index].name);
          // console.log(localStorage);
        } else {
          document.getElementById("doctorPasswordError").innerHTML =
            "Wrong password, Please try again.";
        }
      });
    });
};

onInputHandler = (error) => {
  document.getElementById(error).innerHTML = "";
};
