document.addEventListener("DOMContentLoaded", () => {
  const sliderEl = document.querySelector(".first-swiper");

  if (!sliderEl) return;

  new Swiper(sliderEl, {
    loop: true,
    spaceBetween: 20,

    slidesPerView: 1,

    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      700: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1000: {
        slidesPerView: 5,
        spaceBetween: 20,
      }
    },

    pagination: {
      el: ".first-slider-pagination",
      type: "progressbar"
    },

    navigation: {
      nextEl: ".right-b",
      prevEl: ".left-b",
    }
  });
});
