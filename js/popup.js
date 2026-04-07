(function () {
  // --- 1. ЛОГІКА ТАЙМЕРА ---

  function startTimer(durationInSeconds) {
    let timer = durationInSeconds;

    const els = {
      h: document.getElementById("hours"),
      m: document.getElementById("minutes"),
      s: document.getElementById("seconds"),
    };

    const updateDisplay = () => {
      const h = Math.floor(timer / 3600);
      const m = Math.floor((timer % 3600) / 60);
      const s = timer % 60;

      if (els.h) els.h.textContent = String(h).padStart(2, "0");
      if (els.m) els.m.textContent = String(m).padStart(2, "0");
      if (els.s) els.s.textContent = String(s).padStart(2, "0");

      if (--timer < 0) timer = durationInSeconds;
    };

    updateDisplay();
    setInterval(updateDisplay, 1000);
  }

  // --- 2. ЛОГІКА ПОПАПУ ---

  const overlay = document.querySelector(".popup-overlay");
  const closeBtn = document.querySelector(".close-btn");

  const openPopup = () => overlay?.classList.add("active");
  const closePopup = () => overlay?.classList.remove("active");

  if (closeBtn) closeBtn.addEventListener("click", closePopup);

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closePopup();
    });
  }

  const triggerBtns = document.querySelectorAll(".open-popup-btn");
  if (triggerBtns) {
    triggerBtns.forEach(el => {
        el.addEventListener("click", openPopup)
    })
  }

  // --- 3. ІНІЦІАЛІЗАЦІЯ ФОРМИ ---

  function initForm() {
    const form = document.getElementById("custom-subscribe-form");
    if (!form) return;

    const redirectUrl = form.dataset.redirectUrl;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const btn = form.querySelector("button");
      if (btn) {
        btn.textContent = "Processing...";
        btn.disabled = true;
      }

      // Формуємо URL для MailChimp (JSONP)
      const url = form.getAttribute("action").replace("/post?", "/post-json?") + "&c=mcCallback";
      const data = new FormData(form);
      const params = [];
      
      data.forEach((value, key) => {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      });

      // Створюємо глобальну функцію для обробки відповіді
      window.mcCallback = function (response) {
        console.log("MailChimp response:", response);
        // Незалежно від результату (успіх чи помилка "вже підписаний"), ми відправляємо на оплату
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      };

      const script = document.createElement("script");
      script.src = `${url}&${params.join("&")}`;
      
      // Додаємо обробку помилки завантаження самого скрипта
      script.onerror = function() {
        console.error("MailChimp script failed to load");
        if (redirectUrl) window.location.href = redirectUrl;
      };

      document.head.appendChild(script);

      // Збільшуємо запасний таймер до 5 секунд на випадок дуже повільного інтернету
      setTimeout(() => {
        if (redirectUrl) {
          console.log("Fallback redirect triggered");
          window.location.href = redirectUrl;
        }
      }, 5000);
    });
  }

  // --- 4. ІНІЦІАЛІЗАЦІЯ ---

  window.addEventListener("DOMContentLoaded", () => {
    startTimer(1800);
    initForm();
  });
})();