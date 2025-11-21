const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("show");
      }, index * 200); // Retraso para animación escalonada

      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach(el => observer.observe(el));



const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom');

const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.85;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < trigger) {
      el.classList.add('show');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);


// --- CARRUSEL

const track = document.querySelector('.carousel-track');
const originalItems = Array.from(document.querySelectorAll('.carousel-item'));
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const dots = document.querySelectorAll('.dot');

const visibleCards = 3;
const totalOriginal = originalItems.length;
let currentIndex = 0;

// Duplicamos tarjetas para el loop infinito
originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
});

// Ahora tenemos duplicado
const allItems = document.querySelectorAll('.carousel-item');

// Medida real
const itemWidth = originalItems[0].offsetWidth + 30;


// -----------------------------
//          MOVER
// -----------------------------
function moveCarousel(animate = true) {
    track.style.transition = animate ? "transform 0.4s ease" : "none";
    track.style.transform = `translateX(${-currentIndex * itemWidth}px)`;

    // Índice del dot basado SOLO en 0–3
    const safeIndex = ((currentIndex % totalOriginal) + totalOriginal) % totalOriginal;

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === safeIndex);
    });
}


// -----------------------------
//          SIGUIENTE
// -----------------------------
function goNext() {
    currentIndex++;

    moveCarousel(true);

    // Reset suave ANTES (cuando comienza la sección duplicada)
    if (currentIndex === totalOriginal) {
        setTimeout(() => {
            currentIndex = 0;
            moveCarousel(false);
        }, 400);
    }
}


// -----------------------------
//          ANTERIOR
// -----------------------------
function goPrev() {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = totalOriginal - 1;
        moveCarousel(false);
        return;
    }

    moveCarousel(true);
}


// Botones
nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", goPrev);


// -----------------------------
//            DOTS
// -----------------------------
dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        currentIndex = i;
        moveCarousel(true);
    });
});


// -----------------------------
//        AUTO SLIDE
// -----------------------------
setInterval(goNext, 4000);


// -----------------------------
//       DRAG / SWIPE
// -----------------------------
let dragStart = 0;
let dragging = false;
let prevTranslate = 0;

track.addEventListener("mousedown", (e) => {
    dragging = true;
    dragStart = e.pageX;
    prevTranslate = -currentIndex * itemWidth;
    track.style.transition = "none";
});

track.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const diff = e.pageX - dragStart;
    track.style.transform = `translateX(${prevTranslate + diff}px)`;
});

track.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;

    const diff = e.pageX - dragStart;

    if (diff < -80) goNext();
    else if (diff > 80) goPrev();
    else moveCarousel(true);
});

track.addEventListener("mouseleave", () => {
    if (dragging) {
        dragging = false;
        moveCarousel(true);
    }
});

// Touch support
track.addEventListener("touchstart", (e) => {
    dragging = true;
    dragStart = e.touches[0].clientX;
    prevTranslate = -currentIndex * itemWidth;
    track.style.transition = "none";
});

track.addEventListener("touchmove", (e) => {
    if (!dragging) return;

    const diff = e.touches[0].clientX - dragStart;
    track.style.transform = `translateX(${prevTranslate + diff}px)`;
});

track.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;

    const diff = e.changedTouches[0].clientX - dragStart;

    if (diff < -80) goNext();
    else if (diff > 80) goPrev();
    else moveCarousel(true);
});

// Iniciar
moveCarousel(false);
