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

const librosCompraSwiper = new Swiper('.librosCompraSwiper', {
  direction: 'horizontal', // Dirección por defecto
  slidesPerView: 3,
  spaceBetween: 10,
  loop: true,
  navigation: {
    nextEl: '.cursos-next',
    prevEl: '.cursos-prev',
  },
  pagination: {
    el: '.librosCompra-pagination',
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 1, // 1 card en tablets/móvil
    },
    1200: {
      slidesPerView: 3, // 3 cards en escritorio
    }
  }
});
/*const librosCompraSwiper = new Swiper('.librosCompraSwiper', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 1,
  loop: false,
  spaceBetween: 10,
  coverflowEffect: {
    rotate: 30,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: '.librosCompra-pagination',
    clickable: true,
  },
  breakpoints: {
    768: { slidesPerView: 1 },
    1200: { slidesPerView: 2 }
  }
});*/


const librosDescargaSwiper = new Swiper('.librosDescargaSwiper', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 3,
  loop: true,
  spaceBetween: 10,
  coverflowEffect: {
    rotate: 30,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: '.librosDescarga-pagination',
    clickable: true,
  },
  breakpoints: {
    768: { slidesPerView: 1 },
    1200: { slidesPerView: 3 }
  }
});
document.querySelectorAll('.btn-curso, .btn-invitaciones, .btn-servicios').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    let motivo = '';
    // Busca el h3 más cercano hacia arriba en la jerarquía
    const h3 = this.closest('.container-servicios--card, .swiper-slide, .container__invitaciones--contenido, .card-curso')?.querySelector('h3');
    if (h3) motivo = h3.textContent.trim();
    document.getElementById('motivoModal').value = motivo;
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
  });
});
document.getElementById('contactoModalForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Aquí tu lógica de envío (EmailJS, fetch, etc.)
  alert('¡Mensaje enviado!');
  const modal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
  modal.hide();
  this.reset();
}); 


const videosSwiper = new Swiper('.videosSwiper', {
  direction: 'horizontal',
  slidesPerView: 1,
  spaceBetween: 10,
  loop: true,
   speed: 800, 
  autoplay: {
    delay: 4000, // Tiempo en milisegundos entre slides (4 segundos)
    disableOnInteraction: false // El autoplay no se detiene al interactuar
  },
  pagination: {
    el: '.videos-pagination',
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1200: {
      slidesPerView: 3,
    }
  }
});