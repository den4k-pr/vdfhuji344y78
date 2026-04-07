document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll('.box');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  boxes.forEach((box, i) => {
    box.style.transitionDelay = `${i * 0.7}s`; // плавная задержка по очереди
    observer.observe(box);
  });
});