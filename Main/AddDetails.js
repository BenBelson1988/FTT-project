let illness = 0;
function addIlness() {
  illness++;
  let h5 = document.createElement("h5");
  h5.classList.add("h5Details");
  h5.innerText = "Illness" + illness;
  h5.setAttribute("id", "h5Ilness" + illness);
  let div = document.createElement("input");
  div.classList.add("input-illness");
  div.setAttribute("placeholder", "Ilness" + illness);
  div.setAttribute("id", "Ilness" + illness);
  document.getElementById("illness-list").appendChild(h5);
  document.getElementById("illness-list").appendChild(div);
}

function removeIlness() {
  let ilnessList = document.getElementById("illness-list");
  if (!ilnessList.hasChildNodes()) return;
  let divToDelete = document.getElementById("Ilness" + illness);
  let h5ToDelete = document.getElementById("h5Ilness" + illness);
  ilnessList.removeChild(divToDelete);
  ilnessList.removeChild(h5ToDelete);
  illness--;
}
