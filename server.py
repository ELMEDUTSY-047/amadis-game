import http.server
import socketserver
import subprocess
import json
import urllib.parse
import os

# Puerto: lee la variable de entorno de la nube (Render) o usa 8000 por defecto en local
PORT = int(os.environ.get("PORT", 8000))

# Estado global del juego en memoria (Equivalente a variables globales / structs en C)
ESTADO_JUEGO = {
    "iniciada": False,
    "jugadores": {},  # id -> { id, nombre, rol, equipo_id, equipo_nombre, listo }
    "puntos_equipos": {}, # equipo_id -> total_puntos
    "siguiente_id": 1
}

def get_wifi_ip():
    try:
        output = subprocess.check_output(["ipconfig", "getifaddr", "en0"]).decode("utf-8").strip()
        if output:
            return output
    except Exception:
        pass
    return "192.168.100.8"

class AmadisMultiplayerHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Desactivar caché para que los móviles siempre tengan datos frescos
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/estado':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            
            # Formato de respuesta JSON
            payload = {
                "iniciada": ESTADO_JUEGO["iniciada"],
                "jugadores": list(ESTADO_JUEGO["jugadores"].values()),
                "puntos_equipos": ESTADO_JUEGO["puntos_equipos"]
            }
            self.wfile.write(json.dumps(payload).encode('utf-8'))
            return
            
        # Para cualquier otra ruta, servir los archivos estáticos normales (HTML, JS, CSS)
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        try:
            datos = json.loads(post_data) if post_data else {}
        except Exception:
            datos = {}

        if parsed.path == '/api/unirse':
            j_id = str(ESTADO_JUEGO["siguiente_id"])
            ESTADO_JUEGO["siguiente_id"] += 1
            
            jugador = {
                "id": j_id,
                "nombre": datos.get("nombre", "Misionero"),
                "rol": datos.get("rol", "Estrella"),
                "equipo_id": datos.get("equipo_id", 1),
                "equipo_nombre": datos.get("equipo_nombre", "Equipo"),
                "listo": False
            }
            ESTADO_JUEGO["jugadores"][j_id] = jugador
            eq_id = str(jugador["equipo_id"])
            if eq_id not in ESTADO_JUEGO["puntos_equipos"]:
                ESTADO_JUEGO["puntos_equipos"][eq_id] = 0

            self.responder_json({"exito": True, "jugador": jugador})

        elif parsed.path == '/api/alistar':
            j_id = str(datos.get("jugador_id"))
            if j_id in ESTADO_JUEGO["jugadores"]:
                ESTADO_JUEGO["jugadores"][j_id]["listo"] = bool(datos.get("listo", True))
                self.responder_json({"exito": True, "jugador": ESTADO_JUEGO["jugadores"][j_id]})
            else:
                self.responder_json({"exito": False, "error": "Jugador no encontrado"})

        elif parsed.path == '/api/iniciar':
            ESTADO_JUEGO["iniciada"] = True
            self.responder_json({"exito": True, "iniciada": True})

        elif parsed.path == '/api/sumar_puntos':
            eq_id = str(datos.get("equipo_id", 1))
            puntos = int(datos.get("puntos", 0))
            ESTADO_JUEGO["puntos_equipos"][eq_id] = ESTADO_JUEGO["puntos_equipos"].get(eq_id, 0) + puntos
            self.responder_json({"exito": True, "puntos_actuales": ESTADO_JUEGO["puntos_equipos"][eq_id]})

        elif parsed.path == '/api/reiniciar':
            ESTADO_JUEGO["iniciada"] = False
            for j in ESTADO_JUEGO["jugadores"].values():
                j["listo"] = False
            self.responder_json({"exito": True})

        else:
            self.send_error(404, "Endpoint no encontrado")

    def responder_json(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    wifi_ip = get_wifi_ip()
    
    with socketserver.TCPServer(("", PORT), AmadisMultiplayerHandler) as httpd:
        print("=" * 65)
        print("🎮 ¡SERVIDOR MULTIJUGADOR DE AMADIS GAME INICIADO!")
        print("=" * 65)
        print(f"👉 En tu Mac: http://localhost:{PORT}")
        print(f"📱 En teléfonos/iPads (Wi-Fi): http://{wifi_ip}:{PORT}")
        print("=" * 65)
        print("Sincronizando hasta 10 equipos en tiempo real.")
        print("Presiona Ctrl + C en esta terminal para detener el servidor.\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Servidor detenido con éxito.")
