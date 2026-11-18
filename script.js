const { createApp } = Vue;

createApp({
    // Variables principales del temporizador
    data() {
        return {
            minTrabajo: 25,
            minDescanso: 5,
            minDescansoLargo: 15,
            tiempoRestante: 1500, // 25 minutos en segundos
            corriendo: false,
            tipoSesion: "Trabajo",
            sesionesCompletadas: 0,
            intervalo: null
        }
    },

    // Calcula el formato de reloj 
    computed: {
        tiempoFormateado() {
            let minutos = Math.floor(this.tiempoRestante / 60);
            let segundos = this.tiempoRestante % 60;
            // padStart agrega un 0 si el número es de una cifra
            return minutos + ":" + String(segundos).padStart(2, '0');
        }
    },

    // Acciones que pasan al hacer clic o al terminar el tiempo
    methods: {
        iniciar() {
            this.corriendo = true;
            // Resta 1 segundo cada 1000 mil milisegundos
            this.intervalo = setInterval(this.restarSegundo, 1000);
        },
        
        pausar() {
            this.corriendo = false;
            clearInterval(this.intervalo); // Detiene el reloj
        },

        reiniciar() {
            this.pausar();
            this.tipoSesion = "Trabajo";
            this.tiempoRestante = this.minTrabajo * 60;
        },

        restarSegundo() {
            this.tiempoRestante--;
            
            // Si el tiempo llega a cero cambia de sesión
            if (this.tiempoRestante === 0) {
                this.sonarAlarma();
                this.cambiarSesion();
            }
        },

        cambiarSesion() {
            this.pausar();

            if (this.tipoSesion === "Trabajo") {
                this.sesionesCompletadas++;
                // Cada 4 sesiones se toma descanso largo Si no, uno corto
                if (this.sesionesCompletadas % 4 === 0) {
                    this.tipoSesion = "Descanso largo";
                    this.tiempoRestante = this.minDescansoLargo * 60;
                } else {
                    this.tipoSesion = "Descanso corto";
                    this.tiempoRestante = this.minDescanso * 60;
                }
            } else {
                // Si termina el descanso vuelve al trabajo
                this.tipoSesion = "Trabajo";
                this.tiempoRestante = this.minTrabajo * 60;
            }
            this.iniciar(); // Arranca el nuevo tiempo automáticamente
        },

        sonarAlarma() {
            // Reproduce un sonido de internet
            let sonido = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
            sonido.play();
        }
    },

    // Si se cambian los minutos, el reloj se actualiza si está pausado
    watch: {
        minTrabajo(nuevoValor) {
            if (!this.corriendo && this.tipoSesion === "Trabajo") {
                this.tiempoRestante = nuevoValor * 60;
            }
        }
    }
}).mount("#app");