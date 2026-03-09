// ========== RUN AFTER DOM IS READY ==========
document.addEventListener('DOMContentLoaded', () => {
  // ========== INTERSECTION OBSERVER FOR NAV HIGHLIGHTING ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    threshold: 0.3,
    rootMargin: '-60px 0px -66% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  // ========== SMOOTH SCROLL BEHAVIOR ==========
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ========== CONTACT FORM HANDLING ==========
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      interest: document.getElementById('interest').value,
      message: document.getElementById('message').value.trim()
    };

    // Validation
    if (!formData.name || !formData.email || !formData.interest || !formData.message) {
      showFormStatus('Please fill in all required fields.', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showFormStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Build mailto link with all fields
    const mailtoLink =
      `mailto:info@romanzuzuk.com?subject=Contact from ${encodeURIComponent(formData.name)} - ${encodeURIComponent(formData.interest)}` +
      `&body=${encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone || 'Not provided'}\n` +
        `Interest: ${formData.interest}\n\n` +
        `Message:\n${formData.message}`
      )}`;

    window.location.href = mailtoLink;

    showFormStatus('Opening your email client...', 'success');
    setTimeout(() => {
      contactForm.reset();
      formStatus.style.display = 'none';
    }, 2000);
  });

  function showFormStatus(message, type) {
    if (formStatus) {
      formStatus.textContent = message;
      formStatus.className = 'form-status ' + type;
      formStatus.style.display = 'block';
    }
  }
}


  // ========== ANIMATION ON SCROLL ==========
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.gallery-item, .timeline-item');

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();

  // ========== HEADER SHADOW ON SCROLL ==========
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.15)';
      } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      }
    });
  }

  // ========== GALLERY MODAL FUNCTIONALITY ==========
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('galleryModal');
  const closeModal = document.getElementById('closeModal');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const modalImage = document.getElementById('modalImage'); // <img>
  const modalInfo = document.getElementById('modalInfo');
  const modalCounter = document.getElementById('modalCounter');
  const modalZoomBtn = document.getElementById('modalZoomBtn');

  // If modal markup is missing, skip setup
  if (
    !galleryItems.length ||
    !modal ||
    !modalImage ||
    !modalInfo ||
    !modalCounter
  ) {
    return;
  }

  let currentIndex = 0;
  const artworks = [];

  // Build artworks array and attach click handlers
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('.gallery-image img');

    artworks.push({
      title: item.querySelector('h3')?.textContent || '',
      medium: item.querySelector('.gallery-meta span:first-child')?.textContent || '',
      size: item.querySelector('.gallery-meta span:last-child')?.textContent || '',
      description: item.querySelector('.gallery-content p')?.textContent || '',
      src: img ? img.src : ''
    });

    item.addEventListener('click', () => {
      if (!img || !artworks[index].src) return;
      currentIndex = index;
      openModal();
    });
  });

  function openModal() {
    const artwork = artworks[currentIndex];
    if (!artwork || !artwork.src) return;

    // Reset zoom state whenever a new image opens
    if (modalImage.classList.contains('zoomed')) {
      modalImage.classList.remove('zoomed');
    }

    // Update image
    modalImage.src = artwork.src;
    modalImage.alt = artwork.title || '';

    // Update info
    modalInfo.innerHTML = `
      <h2>${artwork.title}</h2>
      <div class="modal-meta">
        <span>${artwork.medium} • ${artwork.size}</span>
      </div>
      <p>${artwork.description}</p>
    `;

    // Update counter
    modalCounter.textContent = `${currentIndex + 1} / ${artworks.length}`;

    modal.classList.add('active'); // make sure .active shows the modal in CSS
  }

  function closeGalleryModal() {
    modal.classList.remove('active');
    // Optionally reset zoom when closing
    if (modalImage.classList.contains('zoomed')) {
      modalImage.classList.remove('zoomed');
    }
  }

  // Close button
  if (closeModal) {
    closeModal.addEventListener('click', closeGalleryModal);
  }

  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + artworks.length) % artworks.length;
      openModal();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % artworks.length;
      openModal();
    });
  }

  // Close modal on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeGalleryModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + artworks.length) % artworks.length;
      openModal();
    }

    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % artworks.length;
      openModal();
    }

    if (e.key === 'Escape') {
      closeGalleryModal();
    }
  });

  // ========== MODAL IMAGE ZOOM TOGGLE ==========
  if (modalZoomBtn && modalImage) {
    modalZoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      modalImage.classList.toggle('zoomed');
    });

    modalImage.addEventListener('click', () => {
      modalImage.classList.toggle('zoomed');
    });
  }
}); // end DOMContentLoaded
