const openPopup = document.querySelector('.popup-btn');
const closePopup = document.querySelector('.close-btn');
const popup = document.querySelector('.modal');
const popupWrap = document.querySelector('.modal__wrap');
const popupBody = document.querySelector('.modal__body');

function popupToggle() {
  popup.classList.toggle('active');
  popupBody.classList.toggle('active');
}
function popupClose() {
  popup.classList.remove('active');
  popupBody.classList.remove('active');
}
openPopup.addEventListener('click', popupToggle);
closePopup.addEventListener('click', popupClose);
popupWrap.addEventListener('click', popupClose);
popupBody.addEventListener('click', function (e) {
  e.stopPropagation();
});
