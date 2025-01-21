/* import "./reset.css" */
import "./style.css"

const hamburger = document.querySelector('.nav__hamburger');
const menu = document.querySelector('.nav__menu');

const sections = document.querySelectorAll('section');
const links = document.querySelectorAll('.nav__list a');

const image = document.querySelector('.section4__plantin');
let position = 0;

const draggableItems = document.querySelectorAll('.section9__perchament, .section9__painting');
const dropzones = document.querySelectorAll('.dropzone');
let draggedItem = null;

let hasPopUpShownSection2 = false;
let hasPopUpShownSection4 = false;
let hasPopUpShownSection9 = false;

const factText = document.querySelector('.section2__fact--text');
const allLetters = document.querySelectorAll('.section2__pressletters img');

const typeSound = new Audio('./public/type.mp3');


// navigatie
hamburger.addEventListener('click', () => {
  menu.classList.toggle('visible');
});

// progress
const activeLink = () => {
  let currentSection = '';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      currentSection = section.getAttribute('id');
    }
  });

  links.forEach((link) => {
    link.classList.remove('active');
    // substring : # verwijderen en naam krijgen van de sectie
    if (link.getAttribute('href').substring(1) === currentSection) {
      link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', activeLink);


// scroll naar de juiste sectie
links.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1); // haal de id van de sectie op
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});


// interactie roepen
const voiceDetection = async () => {
  // mag ik geluid gebruiken?
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // maak een nieuwe AudioContext aan
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);

  // analyser node maken die geluid nivea kan opnemen
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);

  // array om data op te slaan, Uint8array = tussen 0 en 255
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  const detectVolume = () => {
    analyser.getByteFrequencyData(dataArray);

    // bereken gemiddelde van het volume
    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    // als het luid genoeg is -> beweeg afbeelding
    if (volume > 50) {
      position += 10;
      image.style.transform = `translateX(${position}px)`;
    }
    requestAnimationFrame(detectVolume);
  };

  detectVolume();
};


// interactie afbeelding slepen
const dragAndDrop = () => {
  // maak afbeeldingen versleepbaar
  draggableItems.forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      // stel dragged item in op afbeelding die word gesleept
      draggedItem = e.target;
      // informatie naar dropbox overdragen
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

      // controleer of het juiste item is gedropt
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


// interactie letter voor weetje
const fact = (letter) => {
  // verwijder alle vergrote afbeeldingen
  allLetters.forEach(letter => letter.style.transform = 'scale(1)');

  typeSound.play();

  if (letter === 'p') {
    factText.style.display = 'block';
    factText.textContent = 'In the past, they could only print in black and red. Have you ever seen a book with other colors? Then it was hand-colored—how cool is that?';
    document.querySelector('.section2__pressletters--p').style.transform = 'scale(1.2)';
  }
  if (letter === 'l') {
    factText.style.display = 'block';
    factText.textContent = 'They used to have to put their printing letters in mirror image? That\'s how the letter ended up being printed correctly.';
    document.querySelector('.section2__pressletters--l').style.transform = 'scale(1.2)';
  }
  if (letter === 'a') {
    factText.style.display = 'block';
    factText.textContent = 'In the Plantin-Moretus museum, there’s a hidden “P” carved into the doorframe. It’s a symbol of the Plantin family and is believed to be a good luck charm.';
    document.querySelector('.section2__pressletters--a').style.transform = 'scale(1.2)';
  }
  if (letter === 'n') {
    factText.style.display = 'block';
    factText.textContent = 'The logo of the Plantin-Moretus press featured a compass, symbolizing work, determination, and precision—reflecting the careful craftsmanship Plantin valued in his printing work.';
    document.querySelector('.section2__pressletters--n').style.transform = 'scale(1.2)';
  }
  if (letter === 't') {
    factText.style.display = 'block';
    factText.textContent = 'Plantin’s press played a key role in the spread of the Protestant Reformation by printing pamphlets and books in multiple languages.';
    document.querySelector('.section2__pressletters--t').style.transform = 'scale(1.2)';
  }
  if (letter === 'i') {
    factText.style.display = 'block';
    factText.textContent = 'Plantin’s press produced the famous "Biblia Polyglotta", a Bible printed in five languages to promote religious tolerance.';
    document.querySelector('.section2__pressletters--i').style.transform = 'scale(1.2)';
  }
};

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (['p', 'l', 'a', 'n', 't', 'i'].includes(key)) {
    fact(key);
  }
});

if (window.matchMedia('(max-width: 90em)').matches) {
  allLetters.forEach(letter => {
    letter.addEventListener('click', () => {
      const clickedLetter = letter.getAttribute('data-letter');
      fact(clickedLetter);
    });
  });
}



const showPopUp = (message) => {
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');
  popupMessage.textContent = message;
  popup.style.display = 'flex'; // toon de pop-up

  // sluit de pop-up als de gebruiker op de sluit knop drukt
  document.getElementById('close-popup').addEventListener('click', () => {
    popup.style.display = 'none';
  });
};

const popUp = () => {
  // pop up voor sectie 2
  const section2 = document.querySelector('.section2');
  if (section2) {
    const rect2 = section2.getBoundingClientRect();
    const section2Middle = rect2.top + rect2.height / 2;

    // reset de pop up als deze sectie uit beeld is
    if (section2Middle > window.innerHeight || section2Middle < 0) {
      hasPopUpShownSection2 = false;
    }

    // toon pop up als deze sectie in beeld komt en nog niet getoond is
    if (!hasPopUpShownSection2 && section2Middle >= 0 && section2Middle <= window.innerHeight) {
      showPopUp("Guess which letter it is and type it on your keyboard or press it on your phone. Then you will see a factoid.");
      hasPopUpShownSection2 = true;
    }
  }

  // pop up sectie 4
  const section4 = document.querySelector('.section4');
  if (section4) {
    const rect4 = section4.getBoundingClientRect();
    const section4Middle = rect4.top + rect4.height / 2;

    if (section4Middle > window.innerHeight || section4Middle < 0) {
      hasPopUpShownSection4 = false;
    }

    if (!hasPopUpShownSection4 && section4Middle >= 0 && section4Middle <= window.innerHeight) {
      showPopUp("Make yourself heard just as Plantin did, shout as loudly as you can to help him escape!");
      hasPopUpShownSection4 = true;
    }
  }

  // pop up sectie 9
  const section9 = document.querySelector('.section9');
  if (section9) {
    const rect9 = section9.getBoundingClientRect();
    const section9Middle = rect9.top + rect9.height / 2;

    if (section9Middle > window.innerHeight || section9Middle < 0) {
      hasPopUpShownSection9 = false;
    }

    if (!hasPopUpShownSection9 && section9Middle >= 0 && section9Middle <= window.innerHeight) {
      showPopUp("Find the images that describe the word and drag it to the correct word.");
      hasPopUpShownSection9 = true;
    }
  }
};

window.addEventListener('scroll', popUp);
window.addEventListener('load', popUp);



//gsap
gsap.registerPlugin(ScrollTrigger);

const scrollSilent = () => {
  gsap.fromTo(
    ".header__word",
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: "header",
        start: "top +=100",
        end: "+=500",
        scrub: true,
        pin: true,
      },
    }
  );
};

const scrollTitle = () => {
  gsap.fromTo(
    ".section1__title",
    {
      x: "-100vw",
    },
    {
      x: 0,
      scrollTrigger: {
        trigger: ".section1",
        start: "top bottom",
        end: "center center",
        scrub: true,
      },
    }
  );
};

const scrollLetters = () => {
  gsap.to([".default:nth-child(5)", ".blue-stroke:nth-child(6)", ".default:nth-child(7)"], {
    x: -150,
    scrollTrigger: {
      trigger: ".section1",
      start: "top center",
      end: "center center",
      scrub: true,
    },
  });
};

const scrollRise = () => {
  gsap.fromTo(
    ".section3__word span",
    {
      x: 0,
      y: 0,
    },
    {
      x: 400,
      y: -300,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".section3",
        start: "top center",
        end: "center center",
        scrub: true,
      },
    }
  );
};

const scrollExclamation = () => {
  gsap.fromTo(
    ".section4__exclamation",
    {
      scale: 0.3,
    },
    {
      scale: 1,
      scrollTrigger: {
        trigger: ".section4",
        start: "top center",
        end: "center center",
        scrub: true,
      },
    }
  );
};

const scrollText = () => {
  gsap.fromTo(
    ".section5__text p:nth-of-type(1)",
    {
      opacity: 0,
      x: -200,
    },
    {
      opacity: 1,
      x: 0,
      scrollTrigger: {
        trigger: ".section5",
        start: "top center",
        end: "center center",
        scrub: true,
      },
    }
  );

  gsap.fromTo(
    ".section5__text p:nth-of-type(2)",
    {
      opacity: 0,
      x: 200,
    },
    {
      opacity: 1,
      x: 0,
      scrollTrigger: {
        trigger: ".section5",
        start: "top center",
        end: "center center",
        scrub: true,
      },
    }
  );
};

/* gsap.matchMedia({
  "prefers-reduced-motion: reduce": () => {
    console.log("Reduced motion is enabled. Animations will be disabled.");
  },

  "prefers-reduced-motion: no-preference": () => {
    scrollSilent();
    scrollTitle();
    scrollRise();
    scrollExclamation();
    scrollText();
  }
}); */

const init = () => {
  activeLink();
  voiceDetection();
  dragAndDrop();

  scrollSilent();
  scrollTitle();
  scrollLetters();
  scrollRise();
  scrollExclamation();
  scrollText();
}

init();

// popup: https://www.w3schools.com/js/js_popup.asp
// dropzone: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
// roepen: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API