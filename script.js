//---------------------------------------------
// CAMPOS DEL FORMULARIO
//---------------------------------------------

const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const dni = document.getElementById("dni");
const fechaNacimiento = document.getElementById("fechaNacimiento");
const telefono = document.getElementById("telefono");
const email = document.getElementById("email");
const direccion = document.getElementById("direccion");

const tallaCalzado = document.getElementById("tallaCalzado");
const tallaPantalon = document.getElementById("tallaPantalon");
const tallaCamisa = document.getElementById("tallaCamisa");

const aceptaRGPD = document.getElementById("aceptaRGPD");
const aceptaVideo = document.getElementById("aceptaVideo");


//---------------------------------------------
// BOTONES
//---------------------------------------------

const btnIniciar = document.getElementById("btnIniciar");
const btnTest = document.getElementById("btnTest");


//---------------------------------------------
// SECCIONES
//---------------------------------------------

const videoSection = document.getElementById("videoSection");
const testSection = document.getElementById("testSection");
const registro = document.getElementById("registro");


//---------------------------------------------
// VÍDEO
//---------------------------------------------

const video = document.getElementById("video");


//---------------------------------------------
// CONFIGURACIÓN INICIAL
//---------------------------------------------

videoSection.style.display = "none";
testSection.style.display = "none";

btnIniciar.disabled = true;
btnTest.disabled = true;

aceptaVideo.disabled = true;


//---------------------------------------------
// VALIDACIÓN DEL FORMULARIO
//---------------------------------------------

function validarFormulario() {

    const formularioCompleto =

        nombre.value.trim() !== "" &&
        apellidos.value.trim() !== "" &&
        dni.value.trim() !== "" &&
        fechaNacimiento.value !== "" &&
        telefono.value.trim() !== "" &&
        email.value.trim() !== "" &&
        direccion.value.trim() !== "" &&
        tallaCalzado.value !== "" &&
        tallaPantalon.value !== "" &&
        tallaCamisa.value !== "" &&
        aceptaRGPD.checked;


    btnIniciar.disabled = !formularioCompleto;
}


//---------------------------------------------
// EVENTOS DEL FORMULARIO
//---------------------------------------------

nombre.addEventListener("input", validarFormulario);
apellidos.addEventListener("input", validarFormulario);
dni.addEventListener("input", validarFormulario);
fechaNacimiento.addEventListener("input", validarFormulario);
telefono.addEventListener("input", validarFormulario);
email.addEventListener("input", validarFormulario);
direccion.addEventListener("input", validarFormulario);

// DESPLEGABLES

tallaCalzado.addEventListener("change", validarFormulario);
tallaPantalon.addEventListener("change", validarFormulario);
tallaCamisa.addEventListener("change", validarFormulario);

// CHECK RGPD

aceptaRGPD.addEventListener("change", validarFormulario);


//---------------------------------------------
// INICIAR FORMACIÓN
//---------------------------------------------

function iniciarVideo() {

    if (btnIniciar.disabled) {
        return;
    }

    registro.style.display = "none";

    videoSection.style.display = "block";

    video.currentTime = 0;

    video.play();

}


//---------------------------------------------
// CONTROL DEL VÍDEO
//---------------------------------------------

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


    // VÍDEO COMPLETADO

    if (
        !testActivado &&
        video.duration > 0 &&
        tiempoMaximoVisto >= (video.duration - 1)
    ) {

        testActivado = true;

        aceptaVideo.disabled = false;

        alert(
            "Vídeo completado.\n\n" +
            "Marque la casilla para continuar con el test."
        );

    }

});


//---------------------------------------------
// IMPEDIR ADELANTAR EL VÍDEO
//---------------------------------------------

video.addEventListener("seeking", function () {

    if (video.currentTime > tiempoMaximoVisto + 1) {

        alert(
            "Debe visualizar el vídeo completo.\n\n" +
            "No se permite adelantar el vídeo."
        );

        video.currentTime = ultimaPosicionValida;

    }

});


//---------------------------------------------
// CHECK DEL VÍDEO
//---------------------------------------------

aceptaVideo.addEventListener("change", function () {

    if (testActivado && aceptaVideo.checked) {

        btnTest.disabled = false;

    } else {

        btnTest.disabled = true;

    }

});


//---------------------------------------------
// MOSTRAR TEST
//---------------------------------------------

function mostrarTest() {

    if (btnTest.disabled) {

        alert(
            "Debe visualizar el vídeo completo y aceptar la declaración antes de realizar el test."
        );

        return;
    }

    testSection.style.display = "block";

}


//---------------------------------------------
// FINALIZAR TEST
//---------------------------------------------

function finalizar() {

    const p1 = document.querySelector('input[name="p1"]:checked');
    const p2 = document.querySelector('input[name="p2"]:checked');
    const p3 = document.querySelector('input[name="p3"]:checked');
    const p4 = document.querySelector('input[name="p4"]:checked');
    const p5 = document.querySelector('input[name="p5"]:checked');


    // COMPROBAR QUE SE HAN RESPONDIDO TODAS

    if (!p1 || !p2 || !p3 || !p4 || !p5) {

        alert("Debe responder las 5 preguntas.");

        return;
    }


    let errores = 0;


    // RESPUESTAS CORRECTAS

    if (p1 !== document.querySelectorAll('input[name="p1"]')[0]) errores++;
    if (p2 !== document.querySelectorAll('input[name="p2"]')[1]) errores++;
    if (p3 !== document.querySelectorAll('input[name="p3"]')[0]) errores++;
    if (p4 !== document.querySelectorAll('input[name="p4"]')[0]) errores++;
    if (p5 !== document.querySelectorAll('input[name="p5"]')[1]) errores++;


    // TEST NO SUPERADO

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


    // FORMACIÓN COMPLETADA

    alert(
        "¡Enhorabuena!\n\n" +
        "Ha completado correctamente la formación de bienvenida de Frimancha Canarias."
    );

}
