async function resetPassword(e) {
  e.preventDefault();
  let email = document.getElementById("email").value;
  if (!emailValidation(email)) return;
  let [isInWhichData, i] = await checkForEmailDataBase(email);
  if (i === -1) return;
  changePasswordInData(isInWhichData, i, email);
}

function mailSend(email, password) {
  Email.send({
    Host: "smtp.elasticemail.com",
    Username: "belson1988@gmail.com",
    Password: "843D00BF54DF3032F0F93C557F030137971D",
    To: email,
    From: "belson1988@gmail.com",
    Subject: "new message from FTTell",
    Body:
      "Your new password is " + password + ", Please make sure you saved it.",
    // Attachments: [{ name: "CI_task_csv.csv", data: b64csv }],
  }).then((message) => {
    if (message === "OK") {
      if (
        confirm(
          "The password was reset and sent to your E-mail. press OK to redirect."
        ) == true
      )
        window.open("../Login/Login.html", "_self");
    } else alert(message);
  });
}

function emailValidation(email) {
  if (email === "" || !email.includes("@")) {
    document.getElementById("mailError").innerHTML =
      "Please enter a valid E-mail.";
    return false;
  }
  return true;
}

function onChangeHandler() {
  document.getElementById("mailError").innerText = "";
}

async function checkForEmailDataBase(email) {
  document.getElementById("loader").classList.remove("display-none");
  let [doctors, parents] = await Promise.allSettled([
    fecthDoctors(),
    fecthParents(),
  ]);
  document.getElementById("loader").classList.add("display-none");
  let index = -1;
  for (let i = 0; i < parents.value.length; i++) {
    if (parents.value[i].email === email) {
      index = i;
      break;
    }
  }
  if (index !== -1) return ["parents", index];
  for (let i = 0; i < doctors.value.length; i++) {
    if (doctors.value[i].email === email) {
      index = i;
      break;
    }
  }
  if (index !== -1) return ["doctors", index];
  document.getElementById("mailError").innerHTML =
    "No such E-mail is in the system.";
  return ["None", -1];
}

async function fecthDoctors() {
  const response = await fetch(
    `https://fttell-default-rtdb.firebaseio.com/doctors.json`
  );
  const patients = await response.json();
  return patients;
}

async function fecthParents() {
  const response = await fetch(
    `https://fttell-default-rtdb.firebaseio.com/parents.json`
  );
  const parents = await response.json();
  return parents;
}

async function changePasswordInData(table, index, email) {
  let arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let passLength = 6,
    password = "";
  for (let i = 0; i < passLength; i++) {
    password += arr[parseInt(Math.random() * 9)];
  }
  await saveToDataBase(table, index, password);
  mailSend(email, password);
}

async function saveToDataBase(table, index, password) {
  fetch(
    `https://fttell-default-rtdb.firebaseio.com/${table}/${index}/password.json`,
    {
      method: "PUT",
      body: JSON.stringify(password),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
}
