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

/* let hasAlertShownSection2 = false;
let hasAlertShownSection4 = false;
let hasAlertShownSection8 = false; */

const factText = document.querySelector('.section2__fact--text');
const allLetters = document.querySelectorAll('.section2__pressletters img');

const typeSound = new Audio('./public/type.mp3');


// navigatie
hamburger.addEventListener('click', () => {
  menu.classList.toggle('visible');
});

const activeLink = () => {
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
  window.addEventListener('scroll', activeLink);
};


// interactie roepen
const voiceDetection = () => {

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

      if (volume > 50) {
        position += 10;
        image.style.transform = `translateX(${position}px)`;
      }

      requestAnimationFrame(detectVolume);
    };

    detectVolume();
  })
};


// interactie afbeelding slepen
const dragAndDrop = () => {
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



// pop up messages
/* const popUp = () => {
  const section2 = document.getElementById('section2');
  const rect2 = section2.getBoundingClientRect();
  const section2Middle = rect2.top + rect2.height / 2;

  // Als de pop-up voor section 2 al is getoond, doe dan verder niets
  if (hasAlertShownSection2) return;

  //  toon als section 2 in het midden is
  if (section2Middle >= 0 && section2Middle <= window.innerHeight) {
    alert("Guess which letter it is and type it on your keyboard or press it on your phone. Then you will see a factoid.");
    hasAlertShownSection2 = true; //pop up maar 1 keer tonen
  }


  const section4 = document.getElementById('section4');
  const rect4 = section4.getBoundingClientRect();
  const section4Middle = rect4.top + rect4.height / 2;

  // Als de pop-up voor section 4 al is getoond, doe dan verder niets
  if (hasAlertShownSection4) return;

  // toon als section 4 in het midden is
  if (section4Middle >= 0 && section4Middle <= window.innerHeight) {
    alert("Make yourself heard just as Plantin did, shout as loudly as you can to help him escape!");
    hasAlertShownSection4 = true; //pop up maar 1 keer tonen
  }


  const section8 = document.getElementById('section8');
  const rect8 = section8.getBoundingClientRect();
  const section8Middle = rect8.top + rect8.height / 2;

  // Als de pop-up voor section 8 al is getoond, doe dan verder niets
  if (hasAlertShownSection8) return;

  // toon als section 8 in het midden is
  if (section8Middle >= 0 && section8Middle <= window.innerHeight) {
    alert("Find the images that describe the word and drag it to the correct word.");
    hasAlertShownSection8 = true; //pop up maar 1 keer tonen
  }
};

window.addEventListener('scroll', popUp);
window.addEventListener('load', popUp); */



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
        trigger: "#section4",
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