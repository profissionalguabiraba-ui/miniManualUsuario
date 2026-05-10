const topicInput = document.getElementById('search-topic');
const topicItems = Array.from(document.querySelectorAll('#topic-list li'));
const summaryDetails = Array.from(document.querySelectorAll('#resumo details'));
const navLinks = Array.from(document.querySelectorAll('.toc a'));
const fadeBlocks = Array.from(document.querySelectorAll('.fade-in-up'));

function normalizeText(value) {
  return value.trim().toLowerCase();
}

function updateSearch() {
  const query = normalizeText(topicInput.value);

  topicItems.forEach((item) => {
    const isVisible = normalizeText(item.textContent).includes(query);
    item.style.display = isVisible ? '' : 'none';
  });

  summaryDetails.forEach((detail) => {
    const visible = normalizeText(detail.textContent).includes(query);
    detail.style.display = query === '' || visible ? '' : 'none';
  });
}

function updateActiveNav() {
  const currentPosition = window.scrollY + 120;
  let currentSection = null;

  navLinks.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (!section) {
      return;
    }

    if (section.offsetTop <= currentPosition) {
      currentSection = section;
    }
  });

  navLinks.forEach((link) => {
    const isActive = currentSection && link.hash === `#${currentSection.id}`;
    link.classList.toggle('active', isActive);
  });
}

function setupIntersectionObserver() {
  if (!window.IntersectionObserver) {
    fadeBlocks.forEach((block) => block.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeBlocks.forEach((block) => observer.observe(block));
}

if (topicInput) {
  topicInput.addEventListener('input', updateSearch);
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('resize', updateActiveNav);
window.addEventListener('load', () => {
  updateActiveNav();
  setupIntersectionObserver();
});
