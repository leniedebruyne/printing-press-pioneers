import "./style.css"

const hamburger = document.querySelector('.nav__hamburger');
const menu = document.querySelector('.nav__menu');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('visible');
});