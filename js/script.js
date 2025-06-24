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
        const sobreMiContainer = document.querySelector('.container_sobreMi');
        const descContainer = document.querySelector('.container__sobreMi--text');
        // Eliminar cualquier h2 previo en toda la sección para evitar duplicados
        if (sobreMiContainer) {
          sobreMiContainer.querySelectorAll('h2[data-i18n="about.title"]').forEach(h2 => h2.remove());
        }
        if (descContainer) {
          // Crear solo un h2 en el contenedor de texto
          descContainer.innerHTML = `<h2 class="container__sobreMi--text-h2" data-i18n="about.title">${data.about.title}</h2>`;
          data.about.description.forEach(parrafo => {
            descContainer.innerHTML += `<p>${parrafo}</p>`;
          });
        }
        // Llamar a la función de movimiento del h2 tras renderizar
        if (window.moveSobreMiTitle) window.moveSobreMiTitle();
      }

      // 4. SERVICIOS dinámicos
      if (data.services && data.services.items) {
        const services = document.getElementById('services-list');
        if (services) {
          services.innerHTML = '';
          data.services.items.forEach((item, idx) => {
          const aos = idx % 2 === 0 ? 'flip-left' : 'flip-right';
          services.innerHTML += `
            <div class="container-servicios--card"  data-aos="${aos}">
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
          // --- INICIO: Orden dinámico de imagen en cards de servicios ---
          function moveServiceCardImg() {
            document.querySelectorAll('.container-servicios--card').forEach(card => {
              const contenido = card.querySelector('.card-contenido');
              const img = card.querySelector('.container-servicios--card-img');
              const btn = card.querySelector('.btn-servicios');
              if (window.innerWidth <= 885) {
                // Si la imagen no está ya dentro de .card-contenido, la movemos
                if (contenido && img && img.parentElement !== contenido) {
                  contenido.insertBefore(img, btn); // Inserta la imagen antes del botón
                }
              } else {
                // Si la imagen está dentro de .card-contenido, la devolvemos a su lugar original
                if (contenido && img && img.parentElement === contenido) {
                  card.appendChild(img);
                }
              }
            });
          }
          moveServiceCardImg();
          if (!window._serviciosCardResizeListener) {
            window.addEventListener('resize', moveServiceCardImg);
            window._serviciosCardResizeListener = true;
          }
          // --- FIN: Orden dinámico de imagen en cards de servicios ---
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
          direction:'horizontal',
          slidesPerView: 3,
          grabCursor: true,
          loop: true,
          slidesPerGroup: 1,
          simulateTouch: true,
          grabCursor: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          breakpoints: {
           320: {
            direction: "vertical",
            slidesPerView: 1
          },
          991: {
            direction: "horizontal",
            slidesPerView: 3
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
                <img src="${item.img}" alt="${item.title}" class="img-fluid">
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

          // Destruye el Swiper anterior si existe y es válido
          if (window.librosDescargaSwiperInstance && window.librosDescargaSwiperInstance.destroy) {
            window.librosDescargaSwiperInstance.destroy(true, true);
            window.librosDescargaSwiperInstance = null;
          }

          // Inicializa el Swiper SOLO si hay slides y el contenedor existe
          // Esperar al siguiente ciclo de render para asegurar que el DOM está actualizado
            setTimeout(() => {
              const swiperContainer = document.querySelector('.librosDescargaSwiper');
              const slides = booksFreeList.querySelectorAll('.swiper-slide');

              if (swiperContainer && slides.length > 0) {
                // Destruir instancia anterior si existe
                if (window.librosDescargaSwiperInstance && typeof window.librosDescargaSwiperInstance.destroy === 'function') {
                  window.librosDescargaSwiperInstance.destroy(true, true);
                }

                // Forzar un repaint para asegurar que los nuevos slides están visibles
                swiperContainer.offsetHeight;

                window.librosDescargaSwiperInstance = new Swiper('.librosDescargaSwiper', {
                  effect: 'coverflow',
                  grabCursor: true,
                  centeredSlides: true,
                  slidesPerView: 1,
                  loop: true,
                  simulateTouch: true,
                  pagination: {
                    el: '.librosDescarga-pagination',
                    clickable: true,
                  },
                  coverflowEffect: {
                    rotate: 30,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                  },
                  breakpoints: {
                    320: {
                      direction: "vertical",
                      slidesPerView: 1
                    },
                    991: {
                      direction: "horizontal",
                      slidesPerView: 3
                    }
                  }
                });

                // Reajusta la posición
                window.librosDescargaSwiperInstance.update();
                window.librosDescargaSwiperInstance.slideToLoop(0, 0, false);
              } else {
                console.warn('Swiper NO inicializado: contenedor o slides faltantes');
              }
            }, 100); // Espera 100ms para asegurar que el DOM ya se actualizó

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
            <iframe src="https://www.youtube.com/embed/${data.videos.main.id}" title="${data.videos.main.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
                  <iframe src="https://www.youtube.com/embed/${video.id}" title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  <h3>${video.title}</h3>
                </div>
              `;
            });

            // Reinicializa el Swiper para videos
            if (window.videosSwiperInstance) {
              window.videosSwiperInstance.destroy(true, true);
            }
            window.videosSwiperInstance = new Swiper('.videosSwiper', {
              direction:'horizontal',
              slidesPerView: 3,
              grabCursor: true,
              loop: true,
              slidesPerGroup: 1,
              simulateTouch: true,
              grabCursor: true,
              pagination: {
                el: '.videos-pagination',
                clickable: true,
              },
              breakpoints: {
                320: {
                  slidesPerView: 1
                },
                600: {
                  slidesPerView: 2
                },
                991: {
                  slidesPerView: 3
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
        document.getElementById('pais').placeholder = data.contact.form.pais || '';
        document.getElementById('ciudad').placeholder = data.contact.form.ciudad || '';
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
        document.getElementById('paisModal').placeholder = data.contact.form.pais || '';
        document.getElementById('ciudadModal').placeholder = data.contact.form.ciudad || '';
        document.getElementById('motivoModal').placeholder = data.contact.form.subject || '';
        document.getElementById('mensajeModal').placeholder = data.contact.form.write || '';
      }
      // Llamar a la función para re-asignar eventos a los botones de modal
      attachModalTriggers();

      // Cerrar menú responsive si está abierto al cambiar idioma
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        bsCollapse.hide();
      }
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

  // Cerrar menú responsive al hacer clic en un enlace
  document.querySelectorAll('.container__menu--item').forEach(link => {
    link.addEventListener('click', function() {
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });
});

// --- INICIO: Orden dinámico del botón de videos ---
(function() {
  let btnOriginalParent = null;
  let btnOriginalNext = null;

  function moveVideosButton() {
    const btn = document.querySelector('.btn-videos');
    const swiper = document.querySelector('.videosSwiper');
    if (!btn || !swiper) return;

    // Guardar referencia al padre y siguiente hermano original solo la primera vez
    if (!btnOriginalParent) {
      btnOriginalParent = btn.parentElement;
      btnOriginalNext = btn.nextElementSibling;
    }

    if (window.innerWidth <= 990) {
      // En móvil: mover el botón después del swiper
      if (btn.parentElement !== swiper.parentElement || btn.previousElementSibling !== swiper) {
        swiper.parentElement.insertBefore(btn, swiper.nextSibling);
      }
    } else {
      // En desktop: devolver el botón a su contenedor original
      if (btn.parentElement !== btnOriginalParent) {
        if (btnOriginalNext) {
          btnOriginalParent.insertBefore(btn, btnOriginalNext);
        } else {
          btnOriginalParent.appendChild(btn);
        }
      }
    }
  }

  moveVideosButton();
  if (!window._videosBtnResizeListener) {
    window.addEventListener('resize', moveVideosButton);
    window._videosBtnResizeListener = true;
  }
})();
// --- FIN: Orden dinámico del botón de videos ---


//********************* */

const btn = document.getElementById("sendEmail");

document.getElementById("contactoForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const serviceID = "service_lkym65i"; //Remplazar 
  const templateID = "template_nld0hwd"; //Remplazar 

  emailjs.sendForm(serviceID, templateID, this).then(
    () => {
      Swal.fire(
        'Mensaje enviado',
        'Se ha enviado tu solicitud correctamente',
        'susccess'
      )
    },
    err => {
      Swal.fire(
        'No se pudo enviar el mensaje',
        'Intente mas.',
        'error'
      )
    }
  );
  document.getElementById("name").value ="";
  document.getElementById("apellido").value ="";
  document.getElementById("email").value ="";
  document.getElementById("motivo").value ="";
  document.getElementById("direccion").value ="";
  document.getElementById("message").value ="";
});

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
  const serviceID = "service_lkym65i"; //Remplazar 
  const templateID = "template_m4grd99"; //Remplazar 
  const form = this;
  emailjs.sendForm(serviceID, templateID, form).then(
    () => {
      Swal.fire(
        'Mensaje enviado',
        'Se ha enviado tu solicitud correctamente',
        'success'
      ).then(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
        modal.hide();
        form.reset();
      });
    },
    err => {
      Swal.fire(
        'No se pudo enviar el mensaje',
        'Intente más tarde.',
        'error'
      );
    }
  );
});

// --- INICIO: Orden dinámico del h2 de sobreMi ---
(function() {
  let originalParent = null;
  let h2Moved = false;

  function moveSobreMiTitle() {
    const sobreMi = document.querySelector('.container_sobreMi');
    const imgDiv = sobreMi?.querySelector('.container__sobreMi--img');
    const textDiv = sobreMi?.querySelector('.container__sobreMi--text');
    // Buscar el h2 tanto en el textDiv como en sobreMi (por si ya fue movido)
    const h2 = textDiv?.querySelector('h2[data-i18n="about.title"]') || sobreMi?.querySelector('h2[data-i18n="about.title"]');
    if (!sobreMi || !imgDiv || !textDiv || !h2) return;

    // Guardar el padre original solo la primera vez
    if (!originalParent) originalParent = textDiv;

    if (window.innerWidth <= 885) {
      // Mover h2 arriba de la imagen, solo si no está ya ahí
      if (h2.parentElement !== sobreMi) {
        sobreMi.insertBefore(h2, imgDiv);
        h2Moved = true;
      }
    } else {
      // Devolver h2 a su lugar original, solo si fue movido
      if (h2Moved && h2.parentElement !== originalParent) {
        originalParent.insertBefore(h2, originalParent.firstChild);
        h2Moved = false;
      }
    }
  }

  // Ejecutar al cargar y en resize
  window.moveSobreMiTitle = moveSobreMiTitle; // Exponer para uso externo tras cambio de idioma
  moveSobreMiTitle();
  window.addEventListener('resize', moveSobreMiTitle);
})();
// --- FIN: Orden dinámico del h2 de sobreMi ---

// --- INICIO: Activación visual de botón submit en formularios ---
function setupFormValidation(formSelector, btnSelector, fields) {
  const form = document.querySelector(formSelector);
  if (!form) return;
  const btn = form.querySelector(btnSelector);
  if (!btn) return;

  function checkFields() {
    const allFilled = fields.every(sel => {
      const el = form.querySelector(sel);
      if (!el) return false;
      if (el.tagName === 'SELECT') {
        return el.value && !el.options[el.selectedIndex].disabled;
      }
      return el.value && el.value.trim().length > 0;
    });
    btn.classList.toggle('btn-active', allFilled);
  }

  fields.forEach(sel => {
    const el = form.querySelector(sel);
    if (el) {
      el.addEventListener('input', checkFields);
      el.addEventListener('change', checkFields);
    }
  });
  // Validar al cargar
  checkFields();
}

document.addEventListener('DOMContentLoaded', function() {
  // Formulario principal
  setupFormValidation(
    '#contactoForm',
    '.btn-submit',
    ['#nombre', '#apellido', '#pais' ,'#ciudad','#email', '#motivo', '#mensaje']
  );
  // Formulario modal
  setupFormValidation(
    '#contactoModalForm',
    '.btn-submit',
    ['#nombreModal', '#emailModal', '#paisModal' ,'#ciudadModal', '#motivoModal', '#mensajeModal']
  );
});
// --- FIN: Activación visual de botón submit en formularios ---

// --- INICIO: Movimiento dinámico del menú responsive ---
(function () {
  const languageDropdown = document.getElementById('languageDropdown');
  const menuBtn = document.querySelector('.container__menu--btn');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarNav = document.getElementById('navbarNav');
  const menuIcon = document.querySelector('.container__menu--icon');
  const menuParent = menuIcon.parentElement; // el <nav>

  function moveMenuElements() {
    if (!languageDropdown || !menuBtn || !navbarToggler || !navbarNav || !menuIcon) return;

    if (window.innerWidth < 992) {
      // Responsive: languageDropdown dentro de container__menu--icon, antes del botón hamburguesa
      if (navbarToggler.previousElementSibling !== languageDropdown) {
        menuIcon.insertBefore(languageDropdown, navbarToggler);
      }
      // menuBtn dentro del menú colapsable al final
      if (navbarNav.lastElementChild !== menuBtn) {
        navbarNav.appendChild(menuBtn);
      }
    } else {
      // Desktop: ambos afuera, después de container__menu--icon (al lado derecho)

      // Mover languageDropdown justo después de container__menu--icon
      if (languageDropdown.parentElement !== menuParent || languageDropdown.previousElementSibling !== menuIcon) {
        languageDropdown.remove();
        if (menuIcon.nextElementSibling) {
          menuParent.insertBefore(languageDropdown, menuIcon.nextElementSibling);
        } else {
          menuParent.appendChild(languageDropdown);
        }
      }

      // Mover menuBtn justo después de languageDropdown
      if (menuBtn.parentElement !== menuParent || menuBtn.previousElementSibling !== languageDropdown) {
        menuBtn.remove();
        if (languageDropdown.nextElementSibling) {
          menuParent.insertBefore(menuBtn, languageDropdown.nextElementSibling);
        } else {
          menuParent.appendChild(menuBtn);
        }
      }
    }
  }

  document.addEventListener('DOMContentLoaded', moveMenuElements);
  window.addEventListener('resize', moveMenuElements);
})();


// --- FIN: Movimiento dinámico del menú responsive ---