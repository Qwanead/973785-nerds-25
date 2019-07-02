var link = document.querySelector(".button--contacts");
var mapGoogle = document.querySelector(".contacts__map-google");
var pin = document.querySelector(".contacts");
var popup = document.querySelector(".modal");
var close = popup.querySelector(".modal__close");
var form = popup.querySelector(".modal__form");
var input = popup.querySelectorAll(".modal__input");
var yourName = popup.querySelector("[name=name]");
var yourEmail = popup.querySelector("[name=email]");
var textarea = popup.querySelector("[name=textarea]");
var isStorageSupport = true;
var storageName = "";
var storageEmail = "";

mapGoogle.classList.remove("contacts__map-google--no-js");
pin.classList.add("contacts--hidden-pin");

function removeError (arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].classList.contains("modal__text--error")) {
      arr[i].classList.remove("modal__text--error");
    }
  }
}

try {
  storageName = localStorage.getItem("yourName");
  storageEmail = localStorage.getItem("yourEmail");
} catch (err) {
  isStorageSupport = false;
}

link.addEventListener("click", function (evt) {
  evt.preventDefault();
  popup.classList.add("modal--show");
  if (storageName && storageEmail) {
    yourName.value = storageName;
    yourEmail.value = storageEmail;
    textarea.focus();
  } else {
    yourName.focus();
  }
});

close.addEventListener("click", function (evt) {
  evt.preventDefault();
  popup.classList.remove("modal--show");
  popup.classList.remove("modal--error");
  removeError(input);
});

form.addEventListener("submit", function (evt) {
  if (!yourName.value || !yourEmail.value || !textarea.value) {
    evt.preventDefault();
    removeError(input);
    popup.classList.remove("modal--error");
    popup.offsetWidth = popup.offsetWidth;
    popup.classList.add("modal--error");
    for (var i = 0; i < input.length; i++) {
      if (!input[i].value){
        input[i].classList.add("modal__text--error");
      }
    }
  } else {
    if (isStorageSupport) {
      localStorage.setItem("yourName", yourName.value);
      localStorage.setItem("yourEmail", yourEmail.value);
    }
  }
});

window.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    removeError(input);
    if (popup.classList.contains("modal--show")) {
      popup.classList.remove("modal--show");
      popup.classList.remove("modal--error");
    }
  }
});
