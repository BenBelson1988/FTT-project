function goBack() {
  history.back();
}

function signUpToFTT(e) {
  e.preventDefault();
  formElements = Array.from(document.getElementById("signUp-form").elements);
  formElements.pop();
  let error = 0;
  formElements.forEach((element) => {
    error += inputValidation(element.value, element.id);
  });
  if (!error && formElements[3].value !== formElements[4].value) {
    error++;
    document.getElementById("password2Error").innerHTML =
      "Passwords apear to be diffrent.";
  }
  if (error) return;
  addParentToData(formElements);
}

function inputValidation(value, id) {
  if (value === "") {
    document.getElementById(id + "Error").innerHTML =
      "Please Fill in " + id + ".";
    return 1;
  }
  return 0;
}

function onInputHandler(error) {
  document.getElementById(error + "Error").innerHTML = "";
}

async function addParentToData(form) {
  document.getElementById("loader").classList.remove("display-none");
  let parents = await fecthParents();
  let parent = {
    ID: form[0].value,
    name: form[1].value,
    email: form[2].value,
    password: form[3].value,
  };
  parents.push(parent);
  fetch(`https://fttell-default-rtdb.firebaseio.com/parents.json`, {
    method: "PUT",
    body: JSON.stringify(parents),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then(function () {
    document.getElementById("loader").classList.add("display-none");
    localStorage.setItem("parent", parent.ID);
    var counter = setInterval(timer, 1000);
    document.getElementById("popUpDiv").classList.remove("display-none");
    let count = 2;
    function timer() {
      document.getElementById("redirectTime").innerHTML = count;
      count = count - 1;
      if (count === 0) {
        clearInterval(counter);
        window.open("../Parent Home/ParentHome.html", "_self");
      }
    }
  });
}

async function fecthParents() {
  const response = await fetch(
    `https://fttell-default-rtdb.firebaseio.com/parents.json`
  );
  const parents = await response.json();
  return parents;
}
