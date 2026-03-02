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

document.querySelector('.btn-primary').addEventListener('click', () => {
    document.getElementById('chatWrapper').classList.add('active');
});

const modal = document.getElementById('modalStep');
const btnHero = document.querySelector('.btn-primary');
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
        
        if(stepNum === 1) seleccion.servicio = e.target.dataset.value;
        if(stepNum === 2) seleccion.prioridad = e.target.dataset.value;

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