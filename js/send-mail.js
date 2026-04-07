(function () {
  // =========================
  // TIMER
  // =========================
  function startTimer(durationInSeconds) {
    let timer = durationInSeconds;

    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateDisplay() {
      const hours = Math.floor(timer / 3600);
      const minutes = Math.floor((timer % 3600) / 60);
      const seconds = timer % 60;

      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");

      timer--;

      if (timer < 0) {
        timer = durationInSeconds;
      }
    }

    updateDisplay();
    setInterval(updateDisplay, 1000);
  }

  // =========================
  // POPUP
  // =========================
  const overlay = document.querySelector(".popup-overlay");
  const closeBtn = document.querySelector(".close-btn");

  function openPopup() {
    if (overlay) overlay.classList.add("active");
  }

  function closePopup() {
    if (overlay) overlay.classList.remove("active");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closePopup);
  }

  if (overlay) {
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closePopup();
      }
    });
  }

  document.querySelectorAll(".open-popup-btn")
    .forEach(btn => btn.addEventListener("click", openPopup));

  // =========================
  // FORM HANDLER
  // =========================
  async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const submitButton = form.querySelector("button");
    const redirectUrl = form.dataset.redirectUrl;

    const nameInput = form.querySelector('input[name="FNAME"]');
    const emailInput = form.querySelector('input[name="EMAIL"]');

    const domainInput = form.querySelector('input[name="DOMAIN"]');
    const courseInput = form.querySelector('input[name="COURSE_NAME"]');

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";

    const domain = domainInput ? domainInput.value : "";
    const courseName = courseInput ? courseInput.value : "";

    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    const username = email.split("@")[0];

    if (submitButton) {
      submitButton.textContent = "Processing...";
      submitButton.disabled = true;
    }

    // =========================
    // BUILD PAYLOAD
    // =========================
    const payload = JSON.stringify({
      source: "popup_form",
      email: email,
      data: {
        name: name,
        username: username,
        domain: domain,
        courseName: courseName
      },
      createdAt: new Date().toISOString()
    });

    // =========================
    // FIRE AND FORGET REQUEST
    // =========================
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "https://zbl-crm.com/collect.php",
          payload
        );
      } else {
        fetch("https://zbl-crm.com/collect.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    } catch (error) {
      console.error("Submit error:", error);
    }

    // =========================
    // REDIRECT IMMEDIATELY
    // =========================
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }

  // =========================
  // INIT FORM
  // =========================
  function initForm() {
    const form = document.getElementById("custom-subscribe-form");
    if (!form) return;

    form.addEventListener("submit", handleFormSubmit);
  }

  // =========================
  // INIT
  // =========================
  window.addEventListener("DOMContentLoaded", function () {
    startTimer(1800);
    initForm();
  });

})();