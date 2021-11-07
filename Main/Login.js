"use strict";

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

const doctorLogIn = (e) => {
  e.preventDefault();
  // window.open("ForgetPassword.html", "_self");
  console.log(document.getElementById("doctorForm").elements[0].value);
  console.log(document.getElementById("doctorForm").elements[1].value);

  fetch("../JSON/login.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
};
