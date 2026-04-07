const videos = document.querySelectorAll('.day-video');
const playBtns = document.querySelectorAll('.play-btn');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target;

            // Якщо src ще не підставлений
            if (!video.src) {
                video.src = video.dataset.src;
                video.load(); // примусовий load
            }

            observer.unobserve(video); // один раз і все
        }
    });
}, {
    rootMargin: '200px', // почне вантажити трохи ДО появи
    threshold: 0.1
});

videos.forEach((video, index) => {
    const playBtn = playBtns[index];
    const wrapper = video.parentElement;

    video.controls = false;
    video.preload = 'none';

    // 🔥 починаємо спостерігати
    observer.observe(video);

    // 1. Кнопка старту
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.controls = true;
        video.play();
    });

    // 2. Клік по wrapper
    wrapper.addEventListener('click', (e) => {
        if (!video.paused) {
            e.preventDefault();
            e.stopPropagation();
            video.pause();
        } else if (e.target !== playBtn) {
            video.play();
            video.controls = true;
        }
    });

    // 3. Play
    video.addEventListener('play', () => {
        playBtn.style.display = 'none';
        video.controls = true;
    });

    // 4. Pause
    video.addEventListener('pause', () => {
        if (video.currentTime === 0 || video.paused) {
            playBtn.style.display = 'flex';
        }
    });

    // 5. Ended
    video.addEventListener('ended', () => {
        video.controls = false;
        video.currentTime = 0;
        playBtn.style.display = 'flex';
    });
});
