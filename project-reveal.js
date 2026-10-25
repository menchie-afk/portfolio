const galleryTargets = document.querySelectorAll('.capstone-summary, .capstone-figure');
const galleryObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      galleryObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
galleryTargets.forEach(target => galleryObserver.observe(target));
