import { renderChatbot } from './ia/chat_ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    await cargarComponente('header-container', '/src/views/header.html');
    await cargarComponente('footer-container', '/src/views/footer.html');
    
    if (typeof renderChatbot === 'function') renderChatbot();

    cargarPagina('inicio');

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-link]');
        if (btn) {
            e.preventDefault();
            const pagina = btn.getAttribute('data-link');
            cargarPagina(pagina);
        }
    });
});

function actualizarEstadoMenu(paginaActiva) {
    const botones = document.querySelectorAll('.nav-btn');
    botones.forEach(btn => {
        if (btn.getAttribute('data-link') === paginaActiva) {
            btn.classList.add('nav-btn-active');
            btn.classList.remove('nav-btn-inactive');
        } else {
            btn.classList.remove('nav-btn-active');
            btn.classList.add('nav-btn-inactive');
        }
    });
}

async function cargarComponente(idContenedor, ruta) {
    try {
        const res = await fetch(ruta);
        if (!res.ok) throw new Error(`Error cargando ${ruta}`);
        const html = await res.text();
        document.getElementById(idContenedor).innerHTML = html;
    } catch (error) {
        console.error("Error en componente:", error);
    }
}

function ejecutarScripts(contenedor) {
    contenedor.querySelectorAll('script').forEach(function(scriptViejo) {
        var scriptNuevo = document.createElement('script');
        Array.from(scriptViejo.attributes).forEach(function(attr) {
            scriptNuevo.setAttribute(attr.name, attr.value);
        });
        scriptNuevo.textContent = scriptViejo.textContent;
        scriptViejo.parentNode.replaceChild(scriptNuevo, scriptViejo);
    });
}

async function cargarPagina(pagina) {
    const contenedor = document.getElementById('app-content');
    
    contenedor.innerHTML = `
        <div class="flex items-center justify-center h-40">
            <p class="text-center text-slate-400 font-bold tracking-widest uppercase animate-pulse">Cargando módulo...</p>
        </div>
    `;

    const rutaHtml = `/src/views/${pagina}.html`; 
    let funcionIniciadora = null;

    switch(pagina) {
        case 'inicio':
            break;
        case '2022':
            break;
    }

    try {
        const res = await fetch(rutaHtml);
        if (!res.ok) throw new Error(`No se encontró el archivo HTML para: ${pagina}`);
        
        const html = await res.text();
        contenedor.innerHTML = html;

        actualizarEstadoMenu(pagina);
        if (funcionIniciadora) funcionIniciadora();

        // setTimeout da tiempo al DOM antes de ejecutar los scripts
        setTimeout(function() {
            ejecutarScripts(contenedor);
        }, 50);

    } catch (error) {
        contenedor.innerHTML = `
            <div class="text-center mt-20">
                <div class="inline-block p-4 bg-slate-100 rounded-full mb-4 text-slate-400">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <h1 class="text-2xl font-black text-slate-800 tracking-tight">Módulo en Construcción</h1>
                <p class="text-slate-500 mt-2">La vista para <b>${pagina.toUpperCase()}</b> aún no ha sido creada en la carpeta /views/.</p>
            </div>
        `;
        actualizarEstadoMenu(pagina);
        console.error(error);
    }
}