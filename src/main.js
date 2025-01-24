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

let hasPopUpShownSection2 = false;
let hasPopUpShownSection4 = false;
let hasPopUpShownSection8 = false;

const factText = document.querySelector('.section2__fact--text');
const allLetters = document.querySelectorAll('.section2__pressletters img');

const cardsContainer6 = document.querySelector('.section6__cards');
const circles6 = document.querySelectorAll('.circle');

const cardsContainer8 = document.querySelector('.section9__cards');
const circles8 = document.querySelectorAll('.section9__circles .circle');

const typeSound = new Audio(`${import.meta.env.BASE_URL}sounds/type.mp3`);
const yahooSound = new Audio(`${import.meta.env.BASE_URL}sounds/yahoo.mp3`);
let soundPlayed = false;



// navigatie
hamburger.addEventListener('click', () => {
  menu.classList.toggle('visible');
});

// header button
document.querySelector('.header__button').addEventListener('click', () => {
  document.getElementById('printer').scrollIntoView({
    behavior: 'smooth'
  });
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


const updateActiveCircle = (cardsContainer, circles) => {
  const scrollLeft = cardsContainer.scrollLeft; // hoe ver scroll je horizontaal
  const cardWidth = cardsContainer.scrollWidth / circles.length; // breedte van 1 pagina

  // bereken actieve index
  const activeIndex = Math.round(scrollLeft / cardWidth);

  // reset circles en voeg active state doe
  circles.forEach((circle, index) => {
    if (index === activeIndex) {
      circle.classList.add('active');
    } else {
      circle.classList.remove('active');
    }
  });
};
cardsContainer6.addEventListener('scroll', () => updateActiveCircle(cardsContainer6, circles6));
cardsContainer8.addEventListener('scroll', () => updateActiveCircle(cardsContainer8, circles8));


const voiceDetection = async () => {
  // mag ik de microfoon gebruiken?
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // nieuwe AudioContext
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);

  // analyser node maken om geluidsniveaus te meten
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);

  // array om data op te slaan, Uint8Array = tussen 0 en 255
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  // danger section
  const dangerSection = document.getElementById('danger');

  const detectVolume = () => {
    // vul de array met waarden
    analyser.getByteFrequencyData(dataArray);

    // bereken gemiddelde van het volume (start met de eerste waarde en voeg er het volgende item in de array bij toe)
    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    // controleer of je in de juiste sectie bent
    const rect = dangerSection.getBoundingClientRect();
    const isInDangerSection = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;

    // als volume luid genoeg is en we in de juiste sectie zijn
    if (isInDangerSection && volume > 50) {
      position += 10;
      image.style.transform = `translateX(${position}px)`;

      // controleer of de afbeelding buiten het scherm is
      const imageRect = image.getBoundingClientRect();
      if (!soundPlayed && (imageRect.right < 0 || imageRect.left > window.innerWidth)) {
        yahooSound.play();
        soundPlayed = true;
      }
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

  // okey = sluiten
  document.getElementById('close-popup').addEventListener('click', () => {
    popup.style.display = 'none';
  });
};

const popUp = () => {
  // pop up section 2
  const section2 = document.querySelector('.section2');
  if (section2 && !hasPopUpShownSection2) {
    const rect2 = section2.getBoundingClientRect();
    const section2Middle = rect2.top + rect2.height / 2;

    // toon de pop up als deze sectie in beeld komt en nog niet getoond is
    if (section2Middle >= 0 && section2Middle <= window.innerHeight) {
      showPopUp("Guess which letter it is and type it on your keyboard or press it on your phone. Then you will see a factoid.");
      hasPopUpShownSection2 = true;
    }
  }

  // pop up section 4
  const section4 = document.querySelector('.section4');
  if (section4 && !hasPopUpShownSection4) {
    const rect4 = section4.getBoundingClientRect();
    const section4Middle = rect4.top + rect4.height / 2;

    if (section4Middle >= 0 && section4Middle <= window.innerHeight) {
      showPopUp("Make yourself heard just as Plantin did, shout as loudly as you can to help him escape!");
      hasPopUpShownSection4 = true;
    }
  }

  //  pop up section 8
  const section8 = document.querySelector('.section8');
  if (section8 && !hasPopUpShownSection8) {
    const rect9 = section8.getBoundingClientRect();
    const section8Middle = rect9.top + rect9.height / 2;

    if (section8Middle >= 0 && section8Middle <= window.innerHeight) {
      showPopUp("Find the images that describe the word and drag it to the correct word.");
      hasPopUpShownSection8 = true;
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
        start: "top +=50",
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
  if (window.matchMedia("(min-width: 90em)").matches) {
    gsap.to(
      [".default:nth-child(5)", ".blue-stroke:nth-child(6)", ".default:nth-child(7)"],
      {
        x: -150,
        scrollTrigger: {
          trigger: ".section1",
          start: "top center",
          end: "center center",
          scrub: true,
        },
      }
    );
  }
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
      y: () => {
        if (window.matchMedia("(min-width: 112.5em)").matches) {
          return -600;
        } else {
          return -300;
        }
      },
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

const scrollYear = () => {
  gsap.fromTo(
    ".section3__year",
    { x: 100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: ".section3__year",
        start: "top 99%",
        end: "top 50%",
        scrub: true,
      },
      ease: "power2.out",
    }
  );
};

const scrollCrown = () => {
  gsap.fromTo(
    ".crown",
    {
      x: '100vw',
      opacity: 0,
    },
    {
      x: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ".crown",
        start: 'top 80%',
        end: 'top 30%',
        scrub: true,
      }
    }
  );
};



const init = () => {
  const prefersReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduceMotion) {
    scrollSilent();
    scrollTitle();
    scrollLetters();
    scrollRise();
    scrollExclamation();
    scrollText();
    scrollYear();
    scrollCrown();
  }

  activeLink();
  voiceDetection();
  dragAndDrop();
  updateActiveCircle();
};

init();


// getboundingclientrect: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
// popup: https://codepen.io/Asadabbas/pen/pLMNGZ
// dropzone: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
// roepen: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
// sounds: https://freesound.org/