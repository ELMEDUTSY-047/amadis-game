// =================================================================
// LÓGICA MULTIJUGADOR EN VIVO (CLIENTE SINCRONIZADO)
// =================================================================

let miJugador = null;
let miRol = "Estrella";
let estoyListo = false;
let pollingInterval = null;

let preguntasRonda = [];
let indicePregunta = 0;
let puntosLocales = 0;
let respondido = false;
let opcionesBarajadasActuales = [];

window.onload = function() {
    dibujarEscena2D("inicio");
    cargarEquiposEnSelector();
};

function cargarEquiposEnSelector() {
    const select = document.getElementById("select-equipo-id");
    if (!select) return;
    select.innerHTML = "";

    EQUIPOS_PRECARGADOS.forEach(eq => {
        const opt = document.createElement("option");
        opt.value = eq.id;
        opt.innerText = `${eq.id}. ${eq.nombre} (☀️ ${eq.sol} / 🌙 ${eq.luna})`;
        select.appendChild(opt);
    });
}

function seleccionarRol(rol) {
    miRol = rol;
    document.querySelectorAll(".role-btn").forEach(btn => {
        btn.classList.toggle("active", btn.innerText.includes(rol));
    });
}

async function unirseASala() {
    const nombre = document.getElementById("input-jugador").value.trim() || `Misionero ${Math.floor(Math.random()*100)}`;
    const eqId = parseInt(document.getElementById("select-equipo-id").value) || 1;
    const equipo = EQUIPOS_PRECARGADOS.find(e => e.id === eqId) || EQUIPOS_PRECARGADOS[0];

    try {
        const resp = await fetch("/api/unirse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: nombre,
                rol: miRol,
                equipo_id: equipo.id,
                equipo_nombre: equipo.nombre
            })
        });
        const data = await resp.json();
        if (data.exito) {
            miJugador = data.jugador;
            mostrarLobby();
        }
    } catch (e) {
        alert("No se pudo conectar al servidor de juego. Revisa que siga corriendo en la Mac.");
    }
}

function mostrarLobby() {
    document.getElementById("pantalla-login").style.display = "none";
    document.getElementById("pantalla-lobby").style.display = "block";

    document.getElementById("lobby-badge-equipo").innerText = `🛡️ ${miJugador.equipo_nombre}`;
    document.getElementById("lobby-mi-nombre").innerText = miJugador.nombre;
    document.getElementById("lobby-mi-rol").innerText = miJugador.rol;

    // Solo el Sol o la Luna pueden ver el botón de arrancar la partida
    if (miJugador.rol === "Sol" || miJugador.rol === "Luna") {
        document.getElementById("btn-iniciar-todos").style.display = "block";
    }

    // Iniciar polling constante (cada 1.5s) para sincronizarse con todos
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(consultarEstadoServidor, 1500);
    consultarEstadoServidor();
}

async function toggleListo() {
    if (!miJugador) return;
    estoyListo = !estoyListo;
    
    const btn = document.getElementById("btn-alistar");
    if (estoyListo) {
        btn.innerText = "✅ ¡Listo para misionar!";
        btn.classList.add("is-ready");
    } else {
        btn.innerText = "✋ ¡Alistarme para la partida!";
        btn.classList.remove("is-ready");
    }

    await fetch("/api/alistar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jugador_id: miJugador.id, listo: estoyListo })
    });

    consultarEstadoServidor();
}

async function consultarEstadoServidor() {
    try {
        const resp = await fetch("/api/estado");
        const data = await resp.json();

        // Si la partida ya fue iniciada por un líder y seguimos en el lobby, ¡arrancar!
        if (data.iniciada && document.getElementById("pantalla-juego").style.display === "none" && document.getElementById("pantalla-leaderboard").style.display === "none") {
            iniciarJuegoLocal();
            return;
        }

        // Si estamos en el lobby, actualizar la lista de misioneros conectados
        if (document.getElementById("pantalla-lobby").style.display === "block") {
            actualizarListaLobby(data.jugadores);
        }

        // Si estamos en la tabla final, actualizar las puntuaciones en vivo
        if (document.getElementById("pantalla-leaderboard").style.display === "block") {
            actualizarTablaLeaderboard(data.puntos_equipos);
        }
    } catch (e) {
        // Error de red temporal
    }
}

function actualizarListaLobby(jugadores) {
    const contenedor = document.getElementById("lista-jugadores-lobby");
    contenedor.innerHTML = "";

    jugadores.forEach(j => {
        const chip = document.createElement("div");
        chip.className = "player-chip";
        chip.innerHTML = `
            <div>
                <strong>${j.rol === 'Sol' ? '☀️' : (j.rol === 'Luna' ? '🌙' : '⭐')} ${j.nombre}</strong> 
                <span style="color: #a8dadc; font-size: 0.8rem;">(${j.equipo_nombre})</span>
            </div>
            <span class="ready-badge ${j.listo ? 'yes' : 'no'}">
                ${j.listo ? 'LISTO' : 'ESPERANDO'}
            </span>
        `;
        contenedor.appendChild(chip);
    });
}

async function iniciarPartidaParaTodos() {
    await fetch("/api/iniciar", { method: "POST" });
    iniciarJuegoLocal();
}

function iniciarJuegoLocal() {
    document.getElementById("pantalla-lobby").style.display = "none";
    document.getElementById("pantalla-juego").style.display = "block";

    const overlay = document.getElementById("banner-text-overlay");
    if (overlay) overlay.style.display = "none";

    document.getElementById("hud-equipo").innerText = miJugador.equipo_nombre;
    document.getElementById("hud-jugador-info").innerText = `${miJugador.rol === 'Sol' ? '☀️' : (miJugador.rol === 'Luna' ? '🌙' : '⭐')} ${miJugador.nombre}`;

    // 1. Barajar preguntas aleatorias (7 preguntas por ronda)
    preguntasRonda = barajarArreglo(BANCO_PREGUNTAS_VERANO).slice(0, 7);
    indicePregunta = 0;
    puntosLocales = 0;
    
    actualizarMarcadores();
    cargarPreguntaActual();
}

function actualizarMarcadores() {
    document.getElementById("score").innerText = puntosLocales;
    document.getElementById("num-pregunta").innerText = `${indicePregunta + 1}/7`;
}

function cargarPreguntaActual() {
    respondido = false;
    const item = preguntasRonda[indicePregunta];

    document.getElementById("hora-fase").innerText = `${item.hora} - ${item.fase}`;
    document.getElementById("titulo-escenario").innerText = `${item.icono} ${item.titulo_escenario}`;
    document.getElementById("desc-escenario").innerText = item.descripcion;
    document.getElementById("pregunta-escenario").innerText = item.pregunta;

    // 2. Barajar los incisos / opciones para que no siempre sea la misma letra
    const opcionesConIndex = item.opciones.map((texto, origIdx) => ({
        texto: texto,
        esCorrecta: (origIdx === item.correcta)
    }));
    opcionesBarajadasActuales = barajarArreglo(opcionesConIndex);

    const contenedor = document.getElementById("opciones-container");
    contenedor.innerHTML = "";

    opcionesBarajadasActuales.forEach((opc, idx) => {
        const btn = document.createElement("button");
        btn.className = "opcion-btn";
        btn.innerText = `${String.fromCharCode(65 + idx)}) ${opc.texto}`;
        btn.onclick = () => responderOpcion(idx);
        contenedor.appendChild(btn);
    });

    document.getElementById("feedback-box").style.display = "none";
    document.getElementById("btn-siguiente").style.display = "none";

    dibujarEscena2D(item.fase);
}

async function responderOpcion(indiceElegido) {
    if (respondido) return;
    respondido = true;

    const opc = opcionesBarajadasActuales[indiceElegido];
    const item = preguntasRonda[indicePregunta];
    const botones = document.querySelectorAll(".opcion-btn");
    const feedbackBox = document.getElementById("feedback-box");

    if (opc.esCorrecta) {
        botones[indiceElegido].classList.add("correcta");
        feedbackBox.className = "feedback-box fb-correct";
        feedbackBox.innerHTML = `<strong>✨ ¡Puntos para ${miJugador.equipo_nombre}!</strong><br>${item.explicacion}`;
        puntosLocales += 100;

        // Sumar puntos en vivo al equipo en el servidor central
        fetch("/api/sumar_puntos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ equipo_id: miJugador.equipo_id, puntos: 100 })
        });
    } else {
        botones[indiceElegido].classList.add("incorrecta");
        // Pintar cuál era la correcta
        opcionesBarajadasActuales.forEach((o, i) => {
            if (o.esCorrecta) botones[i].classList.add("correcta");
        });
        feedbackBox.className = "feedback-box fb-incorrect";
        feedbackBox.innerHTML = `<strong>⚠️ Ojo con la guía:</strong><br>${item.explicacion}`;
    }

    actualizarMarcadores();
    feedbackBox.style.display = "block";
    document.getElementById("btn-siguiente").style.display = "block";
}

function siguientePregunta() {
    indicePregunta++;
    if (indicePregunta < preguntasRonda.length) {
        actualizarMarcadores();
        cargarPreguntaActual();
    } else {
        mostrarTablaFinal();
    }
}

function mostrarTablaFinal() {
    document.getElementById("pantalla-juego").style.display = "none";
    document.getElementById("pantalla-leaderboard").style.display = "block";

    const overlay = document.getElementById("banner-text-overlay");
    if (overlay) overlay.style.display = "flex";

    dibujarEscena2D("noche");
    consultarEstadoServidor();
}

function actualizarTablaLeaderboard(puntosEquipos) {
    const contenedor = document.getElementById("lista-leaderboard");
    contenedor.innerHTML = "";

    // Armar lista con los 10 equipos y sus puntos
    const ranking = EQUIPOS_PRECARGADOS.map(eq => {
        const pts = puntosEquipos[String(eq.id)] || 0;
        return { ...eq, puntos: pts };
    });

    // Ordenar de mayor a menor puntaje
    ranking.sort((a, b) => b.puntos - a.puntos);

    const medallas = ["🥇", "🥈", "🥉"];

    ranking.forEach((eq, idx) => {
        const card = document.createElement("div");
        card.className = "team-card";
        const puesto = medallas[idx] || `#${idx + 1}`;
        const esMiEquipo = (miJugador && eq.id === miJugador.equipo_id);

        card.style.borderColor = esMiEquipo ? "#ffb703" : "rgba(255,255,255,0.15)";
        if (esMiEquipo) card.style.background = "rgba(255, 183, 3, 0.15)";

        card.innerHTML = `
            <div>
                <strong style="color: ${esMiEquipo ? '#ffb703' : '#fff'};">${puesto} ${eq.nombre}</strong>
                <div style="font-size: 0.8rem; color: #a8dadc;">
                    ☀️ ${eq.sol} | 🌙 ${eq.luna}
                </div>
            </div>
            <div style="font-size: 1.25rem; font-weight: bold; color: #52b788;">
                ${eq.puntos} pts
            </div>
        `;
        contenedor.appendChild(card);
    });
}

async function reiniciarTodaLaSala() {
    await fetch("/api/reiniciar", { method: "POST" });
    location.reload();
}

// ==========================================
// DIBUJADO 2D RESPONSIVO
// ==========================================
function dibujarEscena2D(tipo) {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) return;
    
    const container = canvas.parentElement;
    canvas.width = container.clientWidth || 360;
    canvas.height = container.clientHeight || 135;
    
    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, W, H);

    if (tipo.includes("VISITEO") || tipo.includes("ORACIÓN")) {
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(W - 40, 30, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#4CAF50";
        ctx.beginPath();
        ctx.arc(W * 0.25, H + 40, W * 0.45, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "#388E3C";
        ctx.beginPath();
        ctx.arc(W * 0.75, H + 40, W * 0.5, Math.PI, 0);
        ctx.fill();
        const cx = W / 2 - 25;
        ctx.fillStyle = "#E07A5F";
        ctx.fillRect(cx, H - 45, 50, 40);
        ctx.fillStyle = "#81171B";
        ctx.beginPath();
        ctx.moveTo(cx - 10, H - 45);
        ctx.lineTo(cx + 25, H - 72);
        ctx.lineTo(cx + 60, H - 45);
        ctx.fill();
        ctx.fillStyle = "#3D405B";
        ctx.fillRect(cx + 18, H - 28, 14, 25);
    } else if (tipo.includes("NIÑOS")) {
        ctx.fillStyle = "#F4A261";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#E76F51";
        ctx.fillRect(0, H - 35, W, 35);
        const colores = ["#264653", "#2A9D8F", "#E9C46A", "#E76F51", "#8338EC", "#3A86FF", "#FFBE0B"];
        const step = W / 8;
        for (let i = 0; i < 7; i++) {
            const x = step * (i + 1);
            ctx.fillStyle = colores[i];
            ctx.beginPath();
            ctx.arc(x, H - 42, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(x - 7, H - 32, 14, 18);
        }
    } else if (tipo.includes("ADULTOS")) {
        ctx.fillStyle = "#C85A17";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#7E2811";
        ctx.fillRect(0, H - 35, W, 35);
        const step = W / 7;
        for (let i = 0; i < 6; i++) {
            ctx.fillStyle = "#2B2D42";
            ctx.beginPath();
            ctx.arc(step * (i + 1), H - 35, 12, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "#D90429";
        ctx.beginPath();
        ctx.moveTo(W / 2, H - 22);
        ctx.lineTo(W / 2 + 12, H - 10);
        ctx.lineTo(W / 2 - 12, H - 10);
        ctx.fill();
    } else if (tipo.includes("ROSARIO") || tipo.includes("MISA")) {
        ctx.fillStyle = "#1D1E2C";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#E9C46A";
        ctx.beginPath();
        ctx.arc(W / 2, 50, 25, Math.PI, 0);
        ctx.lineTo(W / 2 + 25, 75);
        ctx.lineTo(W / 2 - 25, 75);
        ctx.fill();
        ctx.fillStyle = "#F4A261";
        ctx.fillRect(W / 2 - 3, 38, 6, 30);
        ctx.fillRect(W / 2 - 12, 46, 24, 6);
    } else if (tipo.includes("RETRO") || tipo === "noche") {
        ctx.fillStyle = "#0B132B";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#E0E1DD";
        ctx.beginPath();
        ctx.arc(W - 40, 30, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFF";
        [[25, 20], [80, 40], [140, 15], [220, 45], [W - 80, 20], [50, 65]].forEach(([x, y]) => {
            ctx.fillRect(x, y, 2.5, 2.5);
        });
    } else {
        ctx.fillStyle = "#1d3557";
        ctx.fillRect(0, 0, W, H);
    }
}
