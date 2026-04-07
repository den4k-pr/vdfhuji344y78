const videos = document.querySelectorAll('.day-video');
const playBtns = document.querySelectorAll('.play-btn');

videos.forEach((video, index) => {
    const playBtn = playBtns[index];
    const wrapper = video.parentElement; // Припускаємо, що wrapper — це батьківський елемент

    video.controls = false;

    // 1. Кнопка старту (тільки запускає)
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Щоб клік не пішов на wrapper
        video.controls = true;
        video.play();
    });

    // 2. Клік по WRAPPER (головний контролер)
    wrapper.addEventListener('click', (e) => {
        // Якщо відео відтворюється — ігноруємо стандартну поведінку і ставимо на паузу
        if (!video.paused) {
            e.preventDefault();
            e.stopPropagation(); // "Ігноруємо все на світі"
            video.pause();
        } 
        // Якщо відео на паузі і це НЕ клік по кнопці (яку ми вже обробили), 
        // можна додати логіку запуску тут, або залишити тільки на кнопці
        else if (e.target !== playBtn) {
            video.play();
            video.controls = true;
        }
    });

    // 3. Стан Play
    video.addEventListener('play', () => {
        playBtn.style.display = 'none';
        video.controls = true;
    });

    // 4. Стан Pause
    video.addEventListener('pause', () => {
        // Показуємо кнопку лише якщо ми на початку або якщо хочеш бачити її завжди при паузі
        if (video.currentTime === 0 || video.paused) {
            playBtn.style.display = 'flex';
        }
    });

    // 5. Кінець відео
    video.addEventListener('ended', () => {
        video.controls = false;
        video.currentTime = 0;
        playBtn.style.display = 'flex';
    });
});