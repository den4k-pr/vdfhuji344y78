document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".header-link");
  const sections = [];

  // Збираємо всі секції по href
  links.forEach(link => {
    const id = link.getAttribute("href").substring(1);
    const section = document.getElementById(id);
    if (section) {
      sections.push(section);
    }

    // Клік — плавний скрол + active
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.getElementById(id);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      setActive(link);
    });
  });

  function setActive(activeLink) {
    links.forEach(link => link.classList.remove("active"));
    activeLink.classList.add("active");
  }

  // Scroll spy
  window.addEventListener("scroll", () => {
    let currentSection = null;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();

      // Коли секція близько до верху (можеш змінити 150)
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSection = section;
      }
    });

    if (currentSection) {
      const id = currentSection.getAttribute("id");

      links.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
});