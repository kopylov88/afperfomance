import * as myFunctions from "./modules/functions.js";
import { useDynamicAdapt } from './modules/dynamicAdapt.js';
import Swiper from 'swiper/bundle';
import Inputmask from 'inputmask';
import JustValidate from 'just-validate';
import AOS from 'aos';

myFunctions.isWebp();
myFunctions.isTouch();
useDynamicAdapt();

//Открытие мобильного меню
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const body = document.body;
const menuItems = document.querySelectorAll('.menu-item');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('open');
  menuBtn.classList.toggle('clicked');
  body.classList.toggle('noscroll');
})
menuItems.forEach((el) => {
  el.addEventListener('click', () => {
    menu.classList.remove('open');
    menuBtn.classList.remove('clicked');
    body.classList.remove('noscroll');
  })
})

//Смена фона на главном экране
const bgSlider = new Swiper('.hero__bg', {
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  autoplay: {
    delay: 3000,
  },
  speed: 3000,
  allowTouchMove: false
});

//Основной слайдер
const slider = new Swiper('.slider__body', {
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
  },
  freeMode: {
    enabled: true,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      freeMode: {
        enabled: false,
      },
    },
    500: {
      slidesPerView: 'auto',
      freeMode: {
        enabled: true,
      },
    }
  }
});

//Кнопка наверх
const upScroll = document.querySelector('.up-btn')
window.addEventListener('scroll', function () {
  upScroll.classList.toggle('active', window.scrollY > 500)
})
upScroll.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
})

//Подсветка пунктов меню при скролле
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.menu__list-link').forEach((link) => {
        let id = link.getAttribute('href').replace('#', '');
        if (id === entry.target.id) {
          link.classList.add('menu__list-link--active');
        } else {
          link.classList.remove('menu__list-link--active');
        }
      });
    }
  });
}, {
  threshold: 0.5
});

document.querySelectorAll('section').forEach(section => { observer.observe(section) });

//Смена картинок товара
const checkbox = document.querySelectorAll('.custom-checkbox');
checkbox.forEach(function (el) {
  el.addEventListener('click', function () {
    el.parentElement.classList.toggle('clicked');
    if (el.parentElement.classList.contains('clicked')) {
      el.parentElement.previousElementSibling.querySelector('.order__item-img--black').classList.add('clicked');
    }
    else {
      el.parentElement.previousElementSibling.querySelector('.order__item-img--black').classList.remove('clicked');
    }
  })
})

//Открытие модального окна
const openPopup = document.querySelectorAll('.popup-btn');
const closePopup = document.querySelector('.close-btn');
const popup = document.querySelector('.modal');
const popupWrap = document.querySelector('.modal__wrap');
const popupBody = document.querySelector('.modal__body');

function popupToggle() {
  popup.classList.toggle('active');
  popupBody.classList.toggle('active');
  body.classList.toggle('noscroll');
}
function popupClose() {
  popup.classList.remove('active');
  popupBody.classList.remove('active');
  body.classList.remove('noscroll')
}

openPopup.forEach(function (el) {
  el.addEventListener('click', function () {
    popupToggle();
  });
});

closePopup.addEventListener('click', function () {
  popupClose();
});

popupWrap.addEventListener('click', function () {
  popupClose();
  body.classList.remove('noscroll');
});
popupBody.addEventListener('click', function (e) {
  e.stopPropagation();
});

//Маска телефона
let inputsPhone = document.querySelectorAll("input[type='tel']");
Inputmask({ mask: '+7 (999) 99-99' }).mask(inputsPhone);


//Корзина товаров

function getItemSubtotalPrice(input) {
  return Number(input.textContent) * Number(input.dataset.price);
}

function summ() {
  let totalCost = 0;

  document.querySelectorAll('.orders__item').forEach(function (cartItem) {
    totalCost += getItemSubtotalPrice(cartItem.querySelector('.counter__current'));
    let itemTotalCost = cartItem.querySelector('.orders__price');
    itemTotalCost.textContent = getItemSubtotalPrice(cartItem.querySelector('.counter__current')) + ' руб';
  })
  const totalPrice = document.querySelectorAll('.total-price');
  totalPrice.forEach(function (el) {
    if (totalCost > 0) {
      el.textContent = `Общая сумма заказа: ${totalCost} руб.`;
      document.querySelector('.form').classList.add('active');
      document.querySelector('.empty-cart').classList.remove('active');
    }
    else {
      document.querySelector('.form').classList.remove('active');
      document.querySelector('.empty-cart').classList.add('active');
    }
  })
}
summ();

//Счётчик товаров

document.querySelector('.modal__body').addEventListener('click', function (event) {
  let counter;
  if (event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
    const counterWrapper = event.target.closest('.counter');
    counter = counterWrapper.querySelector('[data-counter]');
  }
  if (event.target.dataset.action === 'plus') {
    counter.innerText = ++counter.innerText;
    summ();
  }
  if (event.target.dataset.action === 'minus') {

    if (parseInt(counter.innerText) > 1) {
      counter.innerText = --counter.innerText;
      summ();
    }
    else if (parseInt(counter.innerText) === 1) {
      counter.closest('.orders__item').remove();
      summ();
      cartCalc();
    }
  }
});

//Добавление товаров в корзину

function cartCalc() {
  const cartNumText = document.querySelector('.cart__num');
  let cartNum = 0;
  document.querySelectorAll('.orders__item').forEach(function (el) {
    cartNum += Number(el.querySelector('.counter__current').textContent);
  })
  cartNumText.textContent = cartNum;
};
cartCalc();

const buyBtns = document.querySelectorAll('.buy__btn');

buyBtns.forEach(el => {
  el.addEventListener('click', () => {
    const card = el.closest('.buy__item');
    const cardInfo = {
      title: card.querySelector('.buy__info-title').textContent,
      id: card.dataset.id,
      price: card.querySelector('.price--current span').textContent,
      imgSrc: card.querySelector('.buy__img img').getAttribute('src'),
    }

    const cartItemHtml = `<div class="orders__item" data-id="${cardInfo.id}">
    <div class="orders__item-img">
      <img src="${cardInfo.imgSrc}" alt="">
    </div>
    <div class="orders__item-info">
      <p class="orders__item-name">${cardInfo.title}</p>
      <p class="orders__item-code">${cardInfo.id}</p>
    </div>
    <div class="counter">
      <div class="counter__control" data-action="minus">-</div>
      <div class="counter__current" data-counter data-price="${cardInfo.price}">1</div>
      <div class="counter__control" data-action="plus">+</div>
    </div>
    <div class="orders__price">
      <span class="orders__price-value"></span>
    </div>
    <button class="orders__delete">
      <img src="img/icons/arrows_circle_remove.svg" alt="remove">
    </button>
    </div>`;

    const cart = document.querySelector('.orders');
    const itemInCart = cart.querySelector(`[data-id="${cardInfo.id}"]`);

    if (itemInCart) {
      itemInCart.querySelector('.counter__current').textContent = parseInt(itemInCart.querySelector('.counter__current').textContent) + 1;
    }
    else {
      cart.insertAdjacentHTML("afterbegin", cartItemHtml);
    }

    summ();
    cartCalc();
  })
});

//Удаление товаров из корзины

document.querySelector('.modal__body').addEventListener('click', function (e) {
  if (e.target.closest('.orders__delete')) {
    e.target.closest('.orders__item').remove()
    summ();
    cartCalc();
  }
  else if (e.target.closest('.counter__control')) {
    summ();
    cartCalc();
  }
})

AOS.init({
  disable: "mobile",
});

//Плавный скролл сайта

SmoothScroll({
  // Время скролла 400 = 0.4 секунды
  animationTime: 800,
  // Размер шага в пикселях 
  stepSize: 50,

  // Дополнительные настройки:

  // Ускорение 
  accelerationDelta: 30,
  // Максимальное ускорение
  accelerationMax: 2,

  // Поддержка клавиатуры
  keyboardSupport: true,
  // Шаг скролла стрелками на клавиатуре в пикселях
  arrowScroll: 50,

  // Pulse (less tweakable)
  // ratio of "tail" to "acceleration"
  pulseAlgorithm: true,
  pulseScale: 4,
  pulseNormalize: 1,

  // Поддержка тачпада
  touchpadSupport: true,
})

//Анимация хедера при скролле

const header = document.querySelector('.header');
const callback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      header.classList.remove('_scroll');
    }
    else {
      header.classList.add('_scroll');
    }
  })
}
const headerObserver = new IntersectionObserver(callback);
headerObserver.observe(header);

//Валидатор формы

const validator = new JustValidate('.form');
validator
  .addField('[name = userName]', [
    {
      rule: 'required',
      errorMessage: 'Заполните поле',
    },
  ])
  .addField('[name = userPhone]', [
    {
      rule: 'required',
      errorMessage: 'Заполните поле',
    },
    {
      rule: 'function',
      validator: function () {
        const phone = document.querySelector('[name = userPhone]').inputmask.unmaskedvalue();
        return phone.length === 7;
      },
      errorMessage: 'Введите корректный номер телефона',
    },
  ])
  .addField('[name = telegram]', [
    {
      rule: 'required',
      errorMessage: 'Заполните поле',
    }
  ])
  .onSuccess(e => {
    e.target.reset();
    popupToggle();
    body.classList.remove('noscroll');
    document.querySelectorAll('.orders__item').forEach(el=>{
      el.remove();
      summ();
      cartCalc();
    })
  })








