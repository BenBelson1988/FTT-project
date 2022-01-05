const myStorage = window.localStorage;
let licenseNumber = myStorage.getItem("loggedIn");
if (licenseNumber)
  window.open("../Patients Search Details/PatientSearchDetails.html", "_self");

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
    if (element.id === "tab2") {
      document.getElementById("mainPic").src = "../../UI/Pictures/family.png";
      document.getElementById("signUp").classList.remove("display-none");
    } else {
      document.getElementById("mainPic").src =
        "../../UI/Pictures/physician-doctor-of-medicine-clinic-pharmacy-others-c49e23a871d01835de3d82e5011fca23.png";
      document.getElementById("signUp").classList.add("display-none");
    }
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
      for (let i = 0; i < doctors.length; i++) {
        if (licenseNumber !== doctors[i].licenseNumber) {
          if (i === doctors.length - 1) {
            document.getElementById("licenseError").innerHTML =
              "The entered license number doesn't exist.";
            return;
          }
        } else if (doctors[i].password === doctorPassword) {
          let data = true;
          fetch(
            `https://fttell-default-rtdb.firebaseio.com/doctors/${i}/loggedIn.json`,
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
              myStorage.setItem("index", i);
              myStorage.setItem("name", doctors[i].name);
              // i = doctors.length - 1;
              window.open(
                "../Patients Search Details/PatientSearchDetails.html",
                "_self"
              );
            })
            .catch((error) => {
              console.error("Error:", error);
              document.getElementById("loader").classList.add("display-none");
              return;
            });
          break;
        } else if (i === doctors.length - 1) {
          document.getElementById("doctorPasswordError").innerHTML =
            "Wrong password, Please try again.";
        }
      }
    });
};

parentsLogIn = (e) => {
  e.preventDefault();

  let id = document.getElementById("parentsForm").elements[0].value;
  let parentPassword = document.getElementById("parentsForm").elements[1].value;

  if (id === "") {
    document.getElementById("idError").innerHTML = "Please fill in ID.";
    return;
  }

  if (parentPassword === "") {
    document.getElementById("parentPasswordError").innerHTML =
      "Please fill password.";
    return;
  }
};

onInputHandler = (error) => {
  document.getElementById(error).innerHTML = "";
};
