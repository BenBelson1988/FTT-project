const myStorage = window.localStorage;

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

  fetch("https://fttell-default-rtdb.firebaseio.com/doctors.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (doctors) {
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
              debugger;
              console.log("Success:", data);
            })
            .catch((error) => {
              console.error("Error:", error);
              return;
            });
          localStorage.setItem("loggedIn", licenseNumber);
          window.open("PatientSerachDetails.html", "_self");
          return;
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
