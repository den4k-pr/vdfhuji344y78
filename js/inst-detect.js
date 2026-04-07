document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);

    // перевіряємо inst
    if (!params.has('inst')) return;

    const form = document.getElementById('custom-subscribe-form');
    if (!form) return;

    const tagsInput = form.querySelector('input[name="tags"]');
    if (!tagsInput) return;

    // беремо базові tags з <script>
    const scriptEl = document.getElementById('inst-tags-script');
    const baseTags = scriptEl.dataset.baseTags;

    let tags = `${baseTags},3028619`;

    // перевіряємо point
    const point = params.get('point');

    if (point === 'a') {
        tags += ',3028620';
    } else if (point === 'e') {
        tags += ',3028621';
    } else if (point === 'd') {
        tags += ',3028622';
    }

    // замінюємо значення
    tagsInput.value = tags;
});