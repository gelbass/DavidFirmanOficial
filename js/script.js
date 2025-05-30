/*
const btn = document.getElementById("sendEmail");

document.getElementById("formContact").addEventListener("submit", function(event) {
  event.preventDefault();

  const serviceID = "service_0k4vjla"; //Remplazar 
  const templateID = "template_5sj22co"; //Remplazar 

  emailjs.sendForm(serviceID, templateID, this).then(
    () => {
      Swal.fire(
        'Message sent succesfully',
        'Our team will contact you shortly',
        'success'
      )
    },
    err => {
      Swal.fire(
        'Message not sent',
        'Try again later.',
        'error'
      )
    }
  );
  document.getElementById("name").value ="";
  document.getElementById("lastName").value ="";
  document.getElementById("email").value ="";
 // document.getElementById("asunto").value ="";
  document.getElementById("message").value ="";
});
*/
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".container__menu--item:not(.container__menu--btn)");

  function onScroll() {
    let scrollPos = window.scrollY || window.pageYOffset;
    sections.forEach((section) => {
      const top = section.offsetTop - 120; // Ajusta según altura de tu navbar
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });
  
  }
   window.addEventListener("scroll", onScroll);
  onScroll(); // Ejecuta al cargar
  });

const cursosSwiper = new Swiper('.cursosSwiper', {
  direction: 'horizontal', // Dirección por defecto
  slidesPerView: 3,
  spaceBetween: 10,
  loop: true,
  navigation: {
    nextEl: '.cursos-next',
    prevEl: '.cursos-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 1, // 2 cards en tablets
    },
    1200: {
      slidesPerView: 3, // 3 cards en escritorio
    }
  }
});
