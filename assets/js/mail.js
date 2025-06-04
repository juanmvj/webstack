// Configuración del webhook
const WEBHOOK_URL = 'https://hook.eu2.make.com/amai74f887j6vh8snue9vbz3nyfj71q7'; // Reemplaza con tu URL de webhook

// Referencias a elementos del DOM
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const formMessages = document.querySelector('.form-messages');

// Event listener para el formulario
document.addEventListener('DOMContentLoaded', function() {
    form.addEventListener('submit', handleFormSubmit);
});

// Función principal para manejar el envío del formulario
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
        return;
    }
    
    // Mostrar estado de carga
    setLoadingState(true);
    
    try {
        // Recopilar datos del formulario
        const formData = getFormData();
        
        // Enviar datos al webhook
        const response = await sendToWebhook(formData);
        
        if (response.ok) {
            showMessage('¡Gracias! Tu mensaje ha sido enviado correctamente.', 'success');
            resetForm();
        } else {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        showMessage('Oops! Algo salió mal y no pudimos enviar tu mensaje. Por favor, inténtalo de nuevo.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// Función para validar el formulario
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    //const number = document.getElementById('number').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validar campos requeridos
    if (!name || !email || !message) {
        showMessage('Por favor, completa todos los campos obligatorios.', 'error');
        return false;
    }
    
    // Validar formato de email
    if (!isValidEmail(email)) {
        showMessage('Por favor, introduce una dirección de correo electrónico válida.', 'error');
        return false;
    }
    
    return true;
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para recopilar datos del formulario
function getFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        //number: document.getElementById('number').value.trim(),
        message: document.getElementById('message').value.trim(),
        timestamp: new Date().toISOString(),
        source: 'contact-form'
    };
}

// Función para enviar datos al webhook
async function sendToWebhook(data) {
    return await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

// Función para mostrar/ocultar estado de carga
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Función para mostrar mensajes
function showMessage(message, type) {
    formMessages.innerHTML = `<div class="alert alert-${type === 'success' ? 'success' : 'danger'}">${message}</div>`;
    
    // Auto-ocultar mensaje después de 5 segundos
    setTimeout(() => {
        formMessages.innerHTML = '';
    }, 5000);
}

// Función para resetear el formulario
function resetForm() {
    form.reset();
}

// Función alternativa para webhooks que requieren formato específico (Discord, Slack, etc.)
/* async function sendToDiscordWebhook(data) {
    // Ejemplo para Discord webhook
    const discordPayload = {
        embeds: [{
            title: "Nuevo mensaje del formulario de contacto",
            color: 0x00ff00,
            fields: [
                { name: "Nombre", value: data.name, inline: true },
                { name: "Email", value: data.email, inline: true },
                { name: "Teléfono", value: data.number, inline: true },
                { name: "Mensaje", value: data.message, inline: false }
            ],
            timestamp: data.timestamp
        }]
    };
    
    return await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload)
    });
} */

// Función alternativa para Slack webhook
/* async function sendToSlackWebhook(data) {
    const slackPayload = {
        text: "Nuevo mensaje del formulario de contacto",
        attachments: [{
            color: "good",
            fields: [
                { title: "Nombre", value: data.name, short: true },
                { title: "Email", value: data.email, short: true },
                { title: "Teléfono", value: data.number, short: true },
                { title: "Mensaje", value: data.message, short: false }
            ]
        }]
    };
    
    return await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackPayload)
    });
} */