const nombre = document.getElementById("nombre");
const email = document.getElementById("email");

const btnIniciar = document.getElementById("btnIniciar");
const btnTest = document.getElementById("btnTest");

const video = document.getElementById("video");

const videoSection = document.getElementById("videoSection");
const testSection = document.getElementById("testSection");
const registro = document.getElementById("registro");

videoSection.style.display = "none";
testSection.style.display = "none";

btnIniciar.disabled = true;
btnTest.disabled = true;

/* VALIDACIÓN FORMULARIO */

function validarFormulario() {

    const nombreValido = nombre.value.trim() !== "";
    const emailValido = email.value.trim() !== "";

    btnIniciar.disabled = !(nombreValido && emailValido);
}

nombre.addEventListener("input", validarFormulario);
email.addEventListener("input", validarFormulario);

/* INICIAR FORMACIÓN */

function iniciarVideo() {

    if (btnIniciar.disabled) {
        return;
    }

    registro.style.display = "none";

    videoSection.style.display = "block";

    video.currentTime = 0;

    video.play();
}

/* CONTROL DEL VÍDEO */

/* CONTROL DEL VÍDEO */

let tiempoMaximoVisto = 0;
let testActivado = false;
let ultimaPosicionValida = 0;

video.addEventListener("timeupdate", function () {

    if (!video.seeking) {

        ultimaPosicionValida = video.currentTime;

        if (video.currentTime > tiempoMaximoVisto) {
            tiempoMaximoVisto = video.currentTime;
        }
    }

    if (
        !testActivado &&
        video.duration > 0 &&
        tiempoMaximoVisto >= (video.duration - 1)
    ) {

        testActivado = true;

        btnTest.disabled = false;

        alert("Vídeo completado. Ya puede realizar el test.");
    }
});

/* ANTI-ADELANTO */

video.addEventListener("seeking", function () {

    if (video.currentTime > tiempoMaximoVisto + 1) {

        alert("Debe visualizar el vídeo completo. No se permite adelantar.");

        video.currentTime = ultimaPosicionValida;
    }
});

/* MOSTRAR TEST */

function mostrarTest() {

    if (btnTest.disabled) {

        alert("Debe visualizar el vídeo completo antes de realizar el test.");
        return;
    }

    testSection.style.display = "block";
}

/* FINALIZAR */

function finalizar() {

    const p1 = document.querySelector('input[name="p1"]:checked');
    const p2 = document.querySelector('input[name="p2"]:checked');
    const p3 = document.querySelector('input[name="p3"]:checked');
    const p4 = document.querySelector('input[name="p4"]:checked');
    const p5 = document.querySelector('input[name="p5"]:checked');

    if (!p1 || !p2 || !p3 || !p4 || !p5) {

        alert("Debe responder las 5 preguntas.");
        return;
    }

    let errores = 0;

    /* Correctas: P1=1, P2=2, P3=1, P4=1, P5=2 */

    if (p1 !== document.querySelectorAll('input[name="p1"]')[0]) errores++;
    if (p2 !== document.querySelectorAll('input[name="p2"]')[1]) errores++;
    if (p3 !== document.querySelectorAll('input[name="p3"]')[0]) errores++;
    if (p4 !== document.querySelectorAll('input[name="p4"]')[0]) errores++;
    if (p5 !== document.querySelectorAll('input[name="p5"]')[1]) errores++;

    if (errores > 0) {

        alert(
            "Test no superado.\n\n" +
            "Tiene " + errores + " pregunta(s) incorrecta(s).\n\n" +
            "Debe volver a realizar el test."
        );

        document
            .querySelectorAll('input[type="radio"]')
            .forEach(radio => radio.checked = false);

        return;
    }

    document.body.innerHTML = `
        <div style="text-align:center;padding:50px;">
            <h1>✅ Formación completada</h1>
            <p>Ha superado correctamente el test.</p>
            <p>Gracias por completar la formación de bienvenida de Frimancha Canarias.</p>
        </div>
    `;
}