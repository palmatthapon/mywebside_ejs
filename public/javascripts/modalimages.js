
var modal = null;

function imgonclick(n){
  modal = document.getElementById("myModal");
  modal.style.display = "block";
  document.getElementById("img01").src = document.getElementById(n).src;
}

function imgShowClose(e) { 
  modal.style.display = "none";
}