/* import "./reset.css" */
import "./style.css"

const hamburger = document.querySelector('.nav__hamburger');
const menu = document.querySelector('.nav__menu');

const sections = document.querySelectorAll('section');
const links = document.querySelectorAll('.nav__list a');

const image = document.querySelector('.section4__plantin');
let position = 0;

const draggableItems = document.querySelectorAll('.section8__perchament, .section8__painting');
const dropzones = document.querySelectorAll('.dropzone');
let draggedItem = null;



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


const setupVoiceDetection = () => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    // maakt array die groot genoeg is voor de gemeten getallen op te slaan, deze word dan gevuld met data van analysernode
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const detectVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      // tel alle waarden met elkaar op en bereken het gemiddelde
      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (volume > 75) {
        position += 10;
        image.style.transform = `translateX(${position}px)`;
      }

      requestAnimationFrame(detectVolume);
    };

    detectVolume();
  })
};


const setupDragAndDrop = () => {
  // Maak afbeeldingen versleepbaar
  draggableItems.forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      draggedItem = e.target;
      e.dataTransfer.setData('text/plain', e.target.className);
    });

    item.addEventListener('dragend', () => {
      draggedItem = null;
    });
  });

  // dropzones
  dropzones.forEach((zone) => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('over');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('over');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('over');

      // Controleer of het juiste item is gedropt
      const itemType = draggedItem.alt.toLowerCase();
      const zoneType = zone.dataset.item;

      if (itemType === zoneType) {
        zone.style.color = 'black';
        draggedItem.style.visibility = 'hidden';
      } else {
        alert('Wrong match!');
      }
    });
  });
};



const init = () => {
  setActiveLink();
  setupVoiceDetection();
  setupDragAndDrop();
}

init();

// dropzone: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
// roepen: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API