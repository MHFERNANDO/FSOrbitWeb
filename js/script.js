document.addEventListener('DOMContentLoaded', () => {
    const chatTrigger = document.getElementById('chatTrigger');
    const closeChat = document.getElementById('closeChat');
    const chatWindow = document.querySelector('.chat-window');
    const chatWrapper = document.getElementById('chatWrapper');

    // Función para abrir/cerrar
    if (chatTrigger && chatWindow) {
        chatTrigger.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });
    }

    // Cerrar al hacer clic fuera del chat
    document.addEventListener('click', (e) => {
        if (chatWindow.classList.contains('active')) {
            if (!chatWrapper.contains(e.target)) {
                chatWindow.classList.remove('active');
            }
        }
    });
});


const scrollReveal = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Si quieres que la animación ocurra cada vez que haces scroll (opcional):
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1, // Se activa cuando se ve el 10% del elemento
        rootMargin: "0px 0px -50px 0px" // Se activa un poco antes de llegar para que sea fluido
    });

    // Buscamos TODOS los elementos que tengan clases de revelación
    const elements = document.querySelectorAll('.reveal, .reveal-left');
    elements.forEach(el => observer.observe(el));
};

// Asegúrate de llamarlo al cargar
document.addEventListener('DOMContentLoaded', scrollReveal);

document.addEventListener('DOMContentLoaded', scrollReveal);

const modal = document.getElementById('modalStep');
const btnHero = document.querySelector('.hero .btn-primary'); // More specific selector
const closeModal = document.querySelector('.close-modal');
const steps = document.querySelectorAll('.step');
const optBtns = document.querySelectorAll('.opt-btn');

let seleccion = { servicio: '', prioridad: '' };

// Abrir/Cerrar
btnHero.onclick = () => { modal.style.display = 'flex'; };
closeModal.onclick = () => { modal.style.display = 'none'; };

// Lógica de clics
optBtns.forEach(btn => {
    btn.onclick = (e) => {
        const currentStep = e.target.closest('.step');
        const stepNum = parseInt(currentStep.dataset.step);

        if (stepNum === 1) seleccion.servicio = e.target.dataset.value;
        if (stepNum === 2) seleccion.prioridad = e.target.dataset.value;

        currentStep.classList.remove('active');
        steps[stepNum].classList.add('active');
    };
});

// Botón Final de WhatsApp
document.getElementById('sendWhatsapp').onclick = () => {
    const msj = `¡Hola FS Orbit! 👋 Me interesa el servicio de *${seleccion.servicio}*. Mi prioridad principal es *${seleccion.prioridad}*. ¿Me podrían dar más info?`;
    const url = `https://wa.me/593983113942?text=${encodeURIComponent(msj)}`;
    window.open(url, '_blank');
    modal.style.display = 'none';
};

// --- LÓGICA DEL PREVIEW DE PROYECTOS ---
document.addEventListener('DOMContentLoaded', () => {
    const previewModal = document.getElementById('projectPreviewModal');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const projectIframe = document.getElementById('projectIframe');
    const previewLoader = document.getElementById('previewLoader');
    const externalLink = document.getElementById('externalProjectLink');
    const triggers = document.querySelectorAll('.project-trigger');

    // Abrir Modal
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const url = trigger.getAttribute('data-url');
            if (url) {
                // Preparar UI
                previewLoader.style.display = 'flex';
                projectIframe.classList.remove('loaded');
                externalLink.href = url;

                // Mostrar Modal
                previewModal.classList.add('active');

                // Cargar iframe
                projectIframe.src = url;
            }
        });
    });

    // Evento de carga del iframe para ocultar el loader
    projectIframe.addEventListener('load', () => {
        if (projectIframe.src && projectIframe.src !== window.location.href) {
            previewLoader.style.display = 'none';
            projectIframe.classList.add('loaded');
        }
    });

    // Cerrar Modal
    const closeModal = () => {
        previewModal.classList.remove('active');
        // Pequeño timeout para no ver el iframe en blanco mientras se cierra la animación
        setTimeout(() => {
            projectIframe.src = '';
            projectIframe.classList.remove('loaded');
        }, 400);
    };

    closePreviewBtn.addEventListener('click', closeModal);

    // Cerrar al hacer clic fuera del contenido
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            closeModal();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            // Esto activa el menú y la animación de la X
            btn.classList.toggle('active');
            menu.classList.toggle('active');
            
            // Evita que el body se mueva mientras el menú está abierto
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Cerrar al hacer clic en cualquier link
        links.forEach(link => {
            link.addEventListener('click', () => {
                btn.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
});