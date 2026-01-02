/**
 * Fairside Developer Docs - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initTabs();
  initCopyButtons();
  initScrollAnimations();
  initScrollIndicator();
});

/**
 * Sidebar Navigation - Mobile toggle and active states
 */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile menu toggle
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking a link on mobile
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove('open');
        }
      });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 && 
          sidebar.classList.contains('open') && 
          !sidebar.contains(e.target) && 
          !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // Handle scroll - update active link
  let ticking = false;
  
  function updateNavigation() {
    const scrollY = window.scrollY;

    // Update active nav link based on scroll position
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavigation);
      ticking = true;
    }
  });

  // Smooth scroll to sections
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Account for mobile header on smaller screens
        const mobileHeader = document.querySelector('.mobile-header');
        const offset = window.innerWidth <= 1024 && mobileHeader ? mobileHeader.offsetHeight : 20;
        const targetPosition = targetSection.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

/**
 * Tab Switching for Code Examples
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;

      // Update button states
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Update panel visibility
      tabPanels.forEach((panel) => {
        panel.classList.remove('active');
        if (panel.id === targetTab) {
          panel.classList.add('active');
        }
      });
    });
  });
}

/**
 * Copy to Clipboard
 */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const targetId = button.dataset.copy;
      const codeElement = document.getElementById(targetId);
      
      if (!codeElement) return;

      const codeText = codeElement.textContent;

      try {
        await navigator.clipboard.writeText(codeText);
        
        // Visual feedback
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.color = 'var(--accent-primary)';
        button.style.borderColor = 'var(--accent-primary)';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.color = '';
          button.style.borderColor = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        button.textContent = 'Failed';
        
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      }
    });
  });
}

/**
 * Scroll-triggered Animations using Intersection Observer
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.card, .endpoint, .function-card, .section-header'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Add visible state styles
  const style = document.createElement('style');
  style.textContent = `
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Scroll Indicator - Hide when user scrolls down
 */
function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  
  if (!scrollIndicator) return;

  let ticking = false;

  function updateScrollIndicator() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      scrollIndicator.classList.add('hidden');
    } else {
      scrollIndicator.classList.remove('hidden');
    }
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollIndicator);
      ticking = true;
    }
  });

  // Smooth scroll when clicking the indicator
  scrollIndicator.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = scrollIndicator.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const nav = document.querySelector('.nav');
      const navHeight = nav ? nav.offsetHeight : 0;
      const targetPosition = targetSection.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  });
}

// Syntax highlighting removed - using plain code blocks

