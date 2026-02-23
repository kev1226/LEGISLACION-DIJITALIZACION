import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

let genAI = null;

/**
 * Pide la API Key de forma interna al servidor para no exponerla en el código.
 */
async function obtenerClienteIA() {
    if (genAI) return genAI;
    
    try {
        const response = await fetch('/api/keys');
        const data = await response.json();
        genAI = new GoogleGenerativeAI(data.geminiToken);
        return genAI;
    } catch (error) {
        console.error("❌ Error al obtener credenciales de IA:", error);
        return null;
    }
}

/**
 * Extrae el texto dinámico de la vista cargada actualmente.
 */
function obtenerContextoDeLaPagina() {
    const contenedor = document.getElementById('app-content');
    if (!contenedor) return "No hay datos visibles en pantalla.";

    // Limpia espacios y saltos de línea excesivos
    return contenedor.innerText.replace(/\s+/g, ' ').trim();
}

/**
 * Consulta a Gemini Pro usando el contexto actual de la web.
 */
export async function consultarIA(preguntaUsuario) {
    try {
        const aiClient = await obtenerClienteIA();
        if (!aiClient) throw new Error("IA no inicializada");

        const contextoActual = obtenerContextoDeLaPagina();
        
        // Usamos gemini-2.5-flash-lite que es el modelo más estable para este tipo de prompts
        const model = aiClient.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const systemPrompt = `
            Eres el Analista Experto del "Network Readiness Index (NRI) 2025" de Ecuador.
            
            DATOS EN PANTALLA (Lo que el usuario está viendo ahora):
            """
            ${contextoActual}
            """

            REGLAS DE RESPUESTA:
            1. Responde basándote en los DATOS EN PANTALLA proporcionados.
            2. Si preguntan por cálculos o rankings presentes en la vista, dalos con precisión.
            3. Si el dato no está visible, di: "Los datos en pantalla no muestran ese detalle específico, pero según el NRI general...".
            4. Tono profesional y analítico. Usa negritas en los números clave.
            5. Longitud: 50 a 70 palabras máximo.
        `;

        console.log("📡 [LOG] Consultando IA con contexto dinámico...");
        const result = await model.generateContent(`${systemPrompt}\n\nPREGUNTA:\n${preguntaUsuario}`);
        return result.response.text();

    } catch (error) {
        if (error.message.includes("429") || error.message.includes("quota")) {
            return "ERROR_CUOTA_AGOTADA";
        }
        console.error("❌ Error AI:", error);
        return "Hubo un error al procesar tu consulta. Inténtalo de nuevo.";
    }
}