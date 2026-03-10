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

  // ========== SMOOTH SCROLL HELPER ==========
  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const headerHeight = document.querySelector('header')?.offsetHeight || 70;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // ========== SMOOTH SCROLL BEHAVIOR (nav links) ==========
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const id = href.slice(1);
        scrollToSection(id);
      }
    });
  });

  // ========== CONTACT FORM HANDLING ==========
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        interest: document.getElementById('interest').value,
        message: document.getElementById('message').value.trim()
      };
      if (!formData.name || !formData.email || !formData.interest || !formData.message) {
        showFormStatus('Please fill in all required fields.', 'error');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showFormStatus('Please enter a valid email address.', 'error');
        return;
      }
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
      header.style.boxShadow = window.scrollY > 0
        ? '0 2px 15px rgba(0,0,0,0.15)'
        : '0 2px 10px rgba(0,0,0,0.1)';
    });
  }

  // ========== INQUIRY BADGE ON CONTACT NAV ==========
  let inquiryCount = 0;
  const contactNavLink = document.querySelector('.nav-link[href="#contact"]');
  let inquiryBadge = null;

  function updateInquiryBadge() {
    if (!contactNavLink) return;
    if (!inquiryBadge) {
      inquiryBadge = document.createElement('span');
      inquiryBadge.className = 'inquiry-badge';
      contactNavLink.style.position = 'relative';
      contactNavLink.appendChild(inquiryBadge);
    }
    inquiryBadge.textContent = inquiryCount;
    inquiryBadge.classList.toggle('visible', inquiryCount > 0);
  }

  // ========== FLY-TO-CONTACT ANIMATION ==========
  function flyToContact(btn, artworkTitle) {
    const img = btn.closest('.gallery-item')?.querySelector('.gallery-image img');
    const targetLink = document.querySelector('.nav-link[href="#contact"]');
    if (!img || !targetLink) return;

    // Create flying element
    const flyEl = document.createElement('div');
    flyEl.className = 'fly-item';
    const cloneImg = document.createElement('img');
    cloneImg.src = img.src;
    flyEl.appendChild(cloneImg);
    document.body.appendChild(flyEl);

    // Start position: center of the clicked button
    const btnRect = btn.getBoundingClientRect();
    const targetRect = targetLink.getBoundingClientRect();

    flyEl.style.left = (btnRect.left + btnRect.width / 2 - 30) + 'px';
    flyEl.style.top = (btnRect.top + window.pageYOffset - 30) + 'px';

    // Force reflow
    flyEl.getBoundingClientRect();

    // Animate to target (Contact nav link)
    flyEl.style.transition = 'all 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    flyEl.style.left = (targetRect.left + targetRect.width / 2 - 12) + 'px';
    flyEl.style.top = (targetRect.top + window.pageYOffset - 12) + 'px';
    flyEl.style.width = '24px';
    flyEl.style.height = '24px';
    flyEl.style.opacity = '0.2';

    flyEl.addEventListener('transitionend', () => {
      flyEl.remove();
      // Update badge
      inquiryCount++;
      updateInquiryBadge();
      // Pulse the badge
      if (inquiryBadge) {
        inquiryBadge.classList.add('pulse');
        setTimeout(() => inquiryBadge.classList.remove('pulse'), 400);
      }
    }, { once: true });
  }

  // ========== PURCHASE INQUIRY BUTTONS ==========
  document.querySelectorAll('.btn-purchase').forEach((purchaseBtn) => {
    purchaseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const artworkName = purchaseBtn.dataset.artwork || 'Selected Artwork';

      // 1. Button state: loading -> added
      const originalHTML = purchaseBtn.innerHTML;
      purchaseBtn.innerHTML = '<span class="btn-icon">&#10003;</span><span class="btn-text">Added to Inquiry!</span>';
      purchaseBtn.classList.add('btn-added');
      purchaseBtn.disabled = true;

      // 2. Fly animation toward Contact nav
      flyToContact(purchaseBtn, artworkName);

      // 3. Scroll to contact form after animation
      setTimeout(() => {
        scrollToSection('contact');
      }, 700);

      // 4. Pre-fill the form after scroll settles
      setTimeout(() => {
        const interestSelect = document.getElementById('interest');
        if (interestSelect) interestSelect.value = 'purchase';
        const messageField = document.getElementById('message');
        if (messageField) {
          messageField.value = `I am interested in purchasing "${artworkName}". Please provide information about pricing and availability.`;
          // Highlight the form briefly
          messageField.classList.add('form-highlight');
          setTimeout(() => messageField.classList.remove('form-highlight'), 1500);
        }
        // Focus the name field if empty
        const nameField = document.getElementById('name');
        if (nameField && !nameField.value) nameField.focus();
      }, 1500);

      // 5. Reset button after delay
      setTimeout(() => {
        purchaseBtn.innerHTML = originalHTML;
        purchaseBtn.classList.remove('btn-added');
        purchaseBtn.disabled = false;
      }, 3500);
    });
  });

  // ========== GALLERY MODAL FUNCTIONALITY ==========
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('galleryModal');
  const closeModal = document.getElementById('closeModal');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const modalImage = document.getElementById('modalImage');
  const modalInfo = document.getElementById('modalInfo');
  const modalCounter = document.getElementById('modalCounter');
  const modalZoomBtn = document.getElementById('modalZoomBtn');

  if (!galleryItems.length || !modal || !modalImage || !modalInfo || !modalCounter) return;

  let currentIndex = 0;
  const artworks = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('.gallery-image img');
    artworks.push({
      title: item.querySelector('h3')?.textContent || '',
      medium: item.querySelector('.gallery-meta span:first-child')?.textContent || '',
      size: item.querySelector('.gallery-meta span:last-child')?.textContent || '',
      description: item.querySelector('.gallery-content p')?.textContent || '',
      src: img ? img.src : ''
    });
    item.addEventListener('click', (event) => {
      if (event.target.closest('.btn-purchase')) return;
      if (!img || !artworks[index].src) return;
      currentIndex = index;
      openModal();
    });
  });

  function openModal() {
    const artwork = artworks[currentIndex];
    if (!artwork || !artwork.src) return;
    if (modalImage.classList.contains('zoomed')) modalImage.classList.remove('zoomed');
    modalImage.src = artwork.src;
    modalImage.alt = artwork.title || '';
    modalInfo.innerHTML = `
      <h2>${artwork.title}</h2>
      <div class="modal-meta"><span>${artwork.medium} • ${artwork.size}</span></div>
      <p>${artwork.description}</p>
    `;
    modalCounter.textContent = `${currentIndex + 1} / ${artworks.length}`;
    modal.classList.add('active');
  }

  function closeGalleryModal() {
    modal.classList.remove('active');
    if (modalImage.classList.contains('zoomed')) modalImage.classList.remove('zoomed');
  }

  if (closeModal) closeModal.addEventListener('click', closeGalleryModal);
  if (prevBtn) prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + artworks.length) % artworks.length; openModal(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % artworks.length; openModal(); });

  modal.addEventListener('click', (e) => { if (e.target === modal) closeGalleryModal(); });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + artworks.length) % artworks.length; openModal(); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % artworks.length; openModal(); }
    if (e.key === 'Escape') closeGalleryModal();
  });

  if (modalZoomBtn && modalImage) {
    modalZoomBtn.addEventListener('click', (e) => { e.stopPropagation(); modalImage.classList.toggle('zoomed'); });
    modalImage.addEventListener('click', () => { modalImage.classList.toggle('zoomed'); });
  }

}); // end DOMContentLoaded
