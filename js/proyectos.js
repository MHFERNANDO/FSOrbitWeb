const scrollReveal = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    const elements = document.querySelectorAll('.reveal, .reveal-left');
    elements.forEach(el => observer.observe(el));
};

document.addEventListener('DOMContentLoaded', scrollReveal);

// --- LÓGICA DEL PREVIEW DE PROYECTOS ---
document.addEventListener('DOMContentLoaded', () => {
    const previewModal = document.getElementById('projectPreviewModal');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const projectIframe = document.getElementById('projectIframe');
    const previewLoader = document.getElementById('previewLoader');
    const externalLink = document.getElementById('externalProjectLink');
    const triggers = document.querySelectorAll('.project-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const url = trigger.getAttribute('data-url');
            if (url) {
                previewLoader.style.display = 'flex';
                projectIframe.classList.remove('loaded');
                externalLink.href = url;
                previewModal.classList.add('active');
                projectIframe.src = url;
            }
        });
    });

    projectIframe.addEventListener('load', () => {
        if (projectIframe.src && projectIframe.src !== window.location.href) {
            previewLoader.style.display = 'none';
            projectIframe.classList.add('loaded');
        }
    });

    const closeModal = () => {
        previewModal.classList.remove('active');
        setTimeout(() => {
            projectIframe.src = '';
            projectIframe.classList.remove('loaded');
        }, 400);
    };

    if (closePreviewBtn) closePreviewBtn.addEventListener('click', closeModal);

    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            closeModal();
        }
    });
});
