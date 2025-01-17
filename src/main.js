/* import "./reset.css" */
import "./style.css"

const hamburger = document.querySelector('.nav__hamburger');
const menu = document.querySelector('.nav__menu');

const sections = document.querySelectorAll('section');
const links = document.querySelectorAll('.nav__list a');


hamburger.addEventListener('click', () => {
  menu.classList.toggle('visible');
});


const setActiveLink = () => {
  let currentSection = '';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 0 && rect.bottom >= 0) {
      currentSection = section.getAttribute('id');
    }
  });
  links.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === currentSection) {
      link.classList.add('active');
    }
  });
  window.addEventListener('scroll', setActiveLink);
};




const init = () => {
  setActiveLink();
}

init();