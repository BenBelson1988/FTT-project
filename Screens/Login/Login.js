const myStorage = window.localStorage;
let licenseNumber = myStorage.getItem("loggedIn");
if (licenseNumber)
  window.open("../Patients Search Details/PatientSerachDetails.html", "_self");

//////Tabs JS
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
//////////// end of tabs js
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
  document.getElementById("loader").classList.remove("display-none");

  fetch("https://fttell-default-rtdb.firebaseio.com/doctors.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (doctors) {
      document.getElementById("loader").classList.add("display-none");
      console.log(doctors);
      doctors.forEach((element, index) => {
        if (licenseNumber === element.licenseNumber);
        else {
          document.getElementById("licenseError").innerHTML =
            "The entered license number doesn't exist.";
          return;
        }
        if (doctors[index].password === doctorPassword) {
          let data = true;
          fetch(
            `https://fttell-default-rtdb.firebaseio.com/doctors/${index}/loggedIn.json`,
            {
              method: "PUT",
              body: JSON.stringify(data),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              console.log("Success:", data);
              myStorage.setItem("loggedIn", licenseNumber);
              myStorage.setItem("index", index);
              window.open(
                "../Patients Search Details/PatientSerachDetails.html",
                "_self"
              );
              return;
            })
            .catch((error) => {
              console.error("Error:", error);
              document.getElementById("loader").classList.add("display-none");
              return;
            });
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
