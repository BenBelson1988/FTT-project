let licenseNumber = window.localStorage.getItem("loggedIn")
 if(!licenseNumber) window.open("Login.html","_self")
 let index= window.localStorage.getItem("index")

document.getElementById("medicalDiagnosis").innerHTML =
  "hdskfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkhsdjkfhsdjkhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhdskfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkhsdjkfhsdjkhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhdskfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkhsdjkfhsdjkhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhdskfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkhsdjkfhsdjkhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhdskfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkhsdjkfhsdjkhsdjkfhsdjkfhsdjkfhsdjkfhsdjkf";

document.getElementById("medicinesTaken").innerHTML =
  "hdskfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkhsdjkfhsdjkhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhdskfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkhsdjkfhsdjkhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhdskfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkhsdjkfhsdjkhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhdskfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkhsdjkfhsdjkhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhdskfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkfhsdjkhsdjkfhsdjkhsdjkfhsdjkfhsdjkfhsdjkfhsdjkf";


function logOut() {
  let data=false;
  fetch(
    `https://fttell-default-rtdb.firebaseio.com/doctors/${index}/loggedIn.json`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  ).then( ()=>{window.localStorage.clear(),
  window.open("Login.html", "_self")});


}
