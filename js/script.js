//CAMBIO DE IDIOMA
let cursosSwiperInstance = null;
function setLanguage(lang) {
  fetch(`./lang/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      // 1. Textos simples con data-i18n (excepto sobreMi.description)
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const keys = el.getAttribute('data-i18n').split('.');
        let value = data;
        keys.forEach(k => value = value?.[k]);
        // Evita sobrescribir sobreMi.description (que es array)
        if (value && !Array.isArray(value)) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = value;
          } else if (el.tagName === 'TITLE') {
            document.title = value;
          } else {
            el.innerHTML = value;
          }
        }
      });

      // 2. Menú dinámico (si tienes arrays en el JSON para el menú)
      if (data.menu) {
        // Selecciona todos los enlaces del menú principal en el orden correcto
        const menuLinks = document.querySelectorAll('.container__menu--items .container__menu--item:not(.container__menu--btn)');
        const menuKeys = ['about', 'services', 'courses', 'invitations', 'books', 'videos'];
        menuLinks.forEach((link, idx) => {
          const key = menuKeys[idx];
          if (data.menu[key]) {
            link.textContent = data.menu[key];
          }
        });
        // Botón de contacto
        const contactBtn = document.querySelector('.container__menu--btn');
        if (contactBtn && data.menu.contact) {
          contactBtn.textContent = data.menu.contact;
        }
      }

      // 3. SOBRE MI: párrafos con negrita
      if (data.about && Array.isArray(data.about.description)) {
        const descContainer = document.querySelector('.container__sobreMi--text');
        if (descContainer) {
          descContainer.innerHTML = `<h2>${data.about.title}</h2>`;
          data.about.description.forEach(parrafo => {
            descContainer.innerHTML += `<p>${parrafo}</p>`;
          });
        }
      }

      // 4. SERVICIOS dinámicos
      if (data.services && data.services.items) {
        const services = document.getElementById('services-list');
        if (services) {
          services.innerHTML = '';
          data.services.items.forEach(item => {
            services.innerHTML += `
              <div class="container-servicios--card">
                <div class="card-contenido">
                  <div class="container-servicios--card-text">
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                  </div>
                  <a href="#" class="btn btn-servicios">${item.button}</a>
                </div>
                <img class="container-servicios--card-img" src="${item.img}" alt="${item.title}">
              </div>
            `;
          });
        }
      }

      // 5. CURSOS dinámicos
      // Cursos dinámicos
      if (data.courses && data.courses.items) {
      const courses = document.getElementById('courses-list');
      if (courses) {
        courses.innerHTML = '';
        data.courses.items.forEach(item => {
          courses.innerHTML += `
            <div class="swiper-slide">
              <div class="card-curso">
                <div class="card-curso--elementos">
                  <img src="${item.img || ''}" alt="${item.title}">
                  <div class="card-curso--texts">
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                  </div>
                </div>
                <a href="${item.link}" class="btn btn-curso" target="_blank">${item.button}</a>
              </div>
            </div>
          `;
        });

        // Destruye el swiper anterior si existe
        if (cursosSwiperInstance) {
          cursosSwiperInstance.destroy(true, true);
        }
        // Crea el swiper nuevamente
        cursosSwiperInstance = new Swiper('.cursosSwiper', {
          direction: 'horizontal',
          slidesPerView: 3,
          spaceBetween: 10,
          grabCursor: true,
          loop: true,
          centeredSlides: true,
          centeredSlidesBounds: true,
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
              slidesPerView: 1,
            },
            1200: {
              slidesPerView: 3,
            }
          }
        });
      }
    }

      // 6. LIBROS dinámicos
      // Libros para comprar (cards fijas)
      if (data.books && data.books.buy) {
        const booksList = document.getElementById('books-list');
        if (booksList) {
          booksList.innerHTML = '';
          data.books.buy.forEach(item => {
            booksList.innerHTML += `
              <div class="container__libros--card">
                <div>
                  <img src="${item.img}" alt="${item.title}" class="img-fluid">
                </div>
                <h3>${item.title}</h3>
                <a href="${item.link || '#'}" class="btn btn-card" target="_blank">${data.books.button}</a>
              </div>
            `;
          });
        }
      }

      // Libros gratuitos (carrusel)
      if (data.books && data.books.free) {
        const booksFreeList = document.getElementById('books-free-list');
        if (booksFreeList) {
          booksFreeList.innerHTML = '';
          data.books.free.forEach(item => {
            booksFreeList.innerHTML += `
              <div class="swiper-slide container__libros--card">
                <img src="${item.img}" alt="${item.title}" class="img-fluid">
                <h3>${item.title}</h3>
                <a href="${item.link || '#'}" class="btn btn-card" target="_blank">${item.button || 'Descargar'}</a>
              </div>
            `;
          });

          // Reinicializa el Swiper para libros gratuitos
          if (window.librosDescargaSwiperInstance) {
            window.librosDescargaSwiperInstance.destroy(true, true);
          }
          window.librosDescargaSwiperInstance = new Swiper('.librosDescargaSwiper', {
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
        }
      }

      // 7. VIDEOS dinámicos
      if (data.videos) {
        // Texto principal
        document.querySelector('[data-i18n="videos.title"]').innerHTML = data.videos.title;
        document.querySelector('[data-i18n="videos.intro"]').innerHTML = data.videos.intro;
        document.querySelector('[data-i18n="videos.button"]').innerHTML = data.videos.button;

        // Video principal
        const videoPrincipal = document.getElementById('video-principal');
        if (videoPrincipal && data.videos.main) {
          videoPrincipal.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${data.videos.main.id}" title="${data.videos.main.title}" frameborder="0" allowfullscreen></iframe>
          `;
        }

        // Carrusel de videos
        if (Array.isArray(data.videos.list)) {
          const videosList = document.getElementById('videos-list');
          if (videosList) {
            videosList.innerHTML = '';
            data.videos.list.forEach(video => {
              videosList.innerHTML += `
                <div class="swiper-slide container__videos--card">
                  <iframe src="https://www.youtube.com/embed/${video.id}" title="${video.title}" frameborder="0" allowfullscreen></iframe>
                  <h3>${video.title}</h3>
                </div>
              `;
            });

            // Reinicializa el Swiper para videos
            if (window.videosSwiperInstance) {
              window.videosSwiperInstance.destroy(true, true);
            }
            window.videosSwiperInstance = new Swiper('.videosSwiper', {
              direction: 'horizontal',
              grabCursor: true,
              slidesPerView: 1,
              spaceBetween: 10,
              loop: true,
              speed: 800,
              autoplay: {
                delay: 4000,
                disableOnInteraction: true
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
          }
        }
      }

      // Traducción de placeholders y opciones del formulario de contacto
      if (data.contact && data.contact.form) {
        // Placeholders
        document.getElementById('nombre').placeholder = data.contact.form.name || '';
        document.getElementById('apellido').placeholder = data.contact.form.lastname || '';
        document.getElementById('email').placeholder = data.contact.form.email || '';
        document.getElementById('mensaje').placeholder = data.contact.form.write || '';

        // Opciones del select "motivo"
        const motivoSelect = document.getElementById('motivo');
        if (motivoSelect) {
          motivoSelect.options[0].text = data.contact.form.subject || '';
          motivoSelect.options[1].text = data.contact.form.nameOption1 || '';
          motivoSelect.options[2].text = data.contact.form.nameOption2 || '';
          motivoSelect.options[3].text = data.contact.form.nameOption3 || '';
          motivoSelect.options[4].text = data.contact.form.nameOption4 || '';
          motivoSelect.options[5].text = data.contact.form.nameOption5 || '';
        }
      }
      // Traducción de placeholders y textos del modal de contacto
      if (data.contact && data.contact.form) {
        document.getElementById('nombreModal').placeholder = data.contact.form.name || '';
        document.getElementById('emailModal').placeholder = data.contact.form.email || '';
        document.getElementById('motivoModal').placeholder = data.contact.form.subject || '';
        document.getElementById('mensajeModal').placeholder = data.contact.form.write || '';
      }
      // Llamar a la función para re-asignar eventos a los botones de modal
      attachModalTriggers();
    });
  localStorage.setItem('lang', lang);
}

// === JS para el menú de idioma personalizado ===
(function() {
  const langDropdown = document.getElementById('languageDropdown');
  const langBtn = document.getElementById('selectedLanguageBtn');
  const langOptions = document.getElementById('languageOptions');
  if (!langDropdown || !langBtn || !langOptions) return;

  const flagMap = {
    es: './img/es.svg',
    en: './img/en.svg',
    pt: './img/pt.svg'
  };
  const labelMap = { es: 'ESP', en: 'ENG', pt: 'PT' };

  let currentLang = localStorage.getItem('lang') || 'es';

  function updateLangUI(lang) {
    langBtn.querySelector('.lang-flag img').src = flagMap[lang];
    langBtn.querySelector('.lang-flag img').alt = labelMap[lang];
    langBtn.querySelector('.lang-label').textContent = labelMap[lang];
    langOptions.querySelectorAll('li').forEach(li => {
      li.classList.toggle('active', li.dataset.lang === lang);
    });
  }

  langBtn.onclick = function(e) {
    e.stopPropagation();
    langDropdown.classList.toggle('open');
  };
  langOptions.onclick = function(e) {
    const li = e.target.closest('li[data-lang]');
    if (!li || !langOptions.contains(li)) return; // Solo si es un li válido dentro del menú
    currentLang = li.dataset.lang;
    updateLangUI(currentLang);
    setLanguage(currentLang);
    localStorage.setItem('lang', currentLang);
    langDropdown.classList.remove('open');
  };
  document.addEventListener('click', function(e) {
    if (!langDropdown.contains(e.target)) langDropdown.classList.remove('open');
  });
  updateLangUI(currentLang);
})();

document.addEventListener('DOMContentLoaded', function() {
  const lang = localStorage.getItem('lang') || 'es';
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = lang;
  }
  setLanguage(lang);
});

//********************* */
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


function attachModalTriggers() {
  document.querySelectorAll('.btn-invitaciones, .btn-servicios').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      let motivo = '';
      if (this.classList.contains('btn-invitaciones')) {
        motivo = 'Solicitar invitación';
      } else {
        // Busca el h3 más cercano hacia arriba en la jerarquía
        const h3 = this.closest('.container-servicios--card, .swiper-slide, .container__invitaciones--contenido')?.querySelector('h3');
        if (h3) motivo = h3.textContent.trim();
      }
      document.getElementById('motivoModal').value = motivo;
      const modal = new bootstrap.Modal(document.getElementById('formModal'));
      modal.show();
    });
  });
}

document.getElementById('contactoModalForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Aquí tu lógica de envío (EmailJS, fetch, etc.)
  alert('¡Mensaje enviado!');
  const modal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
  modal.hide();
  this.reset();
}); 
