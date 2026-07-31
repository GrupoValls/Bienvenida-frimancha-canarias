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

const btnBorrarFirma = document.getElementById("btnBorrarFirma");
const btnAceptarFirma = document.getElementById("btnAceptarFirma");

//---------------------------------------------
// VÍDEO
//---------------------------------------------

const video = document.getElementById("video");

//---------------------------------------------
// SECCIONES
//---------------------------------------------

const registro = document.getElementById("registro");
const videoSection = document.getElementById("videoSection");
const testSection = document.getElementById("testSection");
const firmaSection = document.getElementById("firmaSection");
const pantallaFinal = document.getElementById("pantallaFinal");

//---------------------------------------------
// FIRMA
//---------------------------------------------

const canvas = document.getElementById("signature-pad");

let signaturePad = null;

//---------------------------------------------
// CONFIGURACIÓN INICIAL
//---------------------------------------------

videoSection.style.display = "none";
testSection.style.display = "none";
firmaSection.style.display = "none";
pantallaFinal.style.display = "none";

btnIniciar.disabled = true;
btnTest.disabled = true;

aceptaVideo.disabled = true;

//---------------------------------------------
// VALIDACIÓN FORMULARIO
//---------------------------------------------

function validarFormulario() {

    const completo =
        nombre.value.trim() !== "" &&
        apellidos.value.trim() !== "" &&
        dni.value.trim() !== "" &&
        fechaNacimiento.value.trim() !== "" &&
        telefono.value.trim() !== "" &&
        email.value.trim() !== "" &&
        direccion.value.trim() !== "" &&
        tallaCalzado.value !== "" &&
        tallaPantalon.value !== "" &&
        tallaCamisa.value !== "" &&
        aceptaRGPD.checked;

    btnIniciar.disabled = !completo;
}

[
    nombre,
    apellidos,
    dni,
    fechaNacimiento,
    telefono,
    email,
    direccion
].forEach(campo => {
    campo.addEventListener("input", validarFormulario);
});

[
    tallaCalzado,
    tallaPantalon,
    tallaCamisa
].forEach(campo => {
    campo.addEventListener("change", validarFormulario);
});

aceptaRGPD.addEventListener("change", validarFormulario);

//---------------------------------------------
// INICIAR VÍDEO
//---------------------------------------------

function iniciarVideo() {

    if (btnIniciar.disabled) return;

    registro.style.display = "none";

    videoSection.style.display = "block";

    video.currentTime = 0;

    video.play();
}

//---------------------------------------------
// CONTROL ANTIADELANTO
//---------------------------------------------

let tiempoMaximoVisto = 0;
let ultimaPosicionValida = 0;
let testActivado = false;

video.addEventListener("timeupdate", () => {

    if (!video.seeking) {

        ultimaPosicionValida = video.currentTime;

        if (video.currentTime > tiempoMaximoVisto) {
            tiempoMaximoVisto = video.currentTime;
        }
    }

    if (
        !testActivado &&
        video.duration > 0 &&
        tiempoMaximoVisto >= video.duration - 1
    ) {

        testActivado = true;

        aceptaVideo.disabled = false;

        alert(
            "Vídeo completado.\n\nYa puede realizar el test."
        );
    }
});

video.addEventListener("seeking", () => {

    if (video.currentTime > tiempoMaximoVisto + 1) {

        alert("No puede adelantar el vídeo.");

        video.currentTime = ultimaPosicionValida;
    }
});

aceptaVideo.addEventListener("change", () => {

    btnTest.disabled = !(
        aceptaVideo.checked &&
        testActivado
    );
});

//---------------------------------------------
// MOSTRAR TEST
//---------------------------------------------

function mostrarTest() {

    if (btnTest.disabled) {

        alert(
            "Debe completar el vídeo antes de realizar el test."
        );

        return;
    }

    testSection.style.display = "block";

    testSection.scrollIntoView({
        behavior: "smooth"
    });
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

    if (!p1 || !p2 || !p3 || !p4 || !p5) {

        alert("Debe responder las 5 preguntas.");

        return;
    }

    let errores = 0;

    // RESPUESTAS CORRECTAS

    if (p1 !== document.querySelectorAll('input[name="p1"]')[0]) errores++;
    if (p2 !== document.querySelectorAll('input[name="p2"]')[0]) errores++;
    if (p3 !== document.querySelectorAll('input[name="p3"]')[0]) errores++;
    if (p4 !== document.querySelectorAll('input[name="p4"]')[0]) errores++;
    if (p5 !== document.querySelectorAll('input[name="p5"]')[0]) errores++;

    if (errores > 0) {

        alert(
            "Test no superado.\n\n" +
            "Tiene " + errores + " respuesta(s) incorrecta(s).\n\n" +
            "Debe volver a realizar el test."
        );

        document
            .querySelectorAll('input[type="radio"]')
            .forEach(radio => {
                radio.checked = false;
            });

        return;
    }

    alert(
        "¡¡ENHORABUENA!!\n\n" +
        "Ha superado correctamente el test.\n\n" +
        "Proceda a realizar su firma digital."
    );

    testSection.style.display = "none";

    firmaSection.style.display = "block";

    setTimeout(() => {

        inicializarFirma();

        firmaSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);
}

//---------------------------------------------
// INICIALIZAR FIRMA
//---------------------------------------------

function inicializarFirma() {

    if (!canvas) {

        console.error(
            "No se encontró el canvas de firma."
        );

        return;
    }

    const ratio =
        Math.max(window.devicePixelRatio || 1, 1);

    canvas.width =
        canvas.offsetWidth * ratio;

    canvas.height =
        250 * ratio;

    const ctx =
        canvas.getContext("2d");

    ctx.scale(ratio, ratio);

    signaturePad = new SignaturePad(
        canvas,
        {
            backgroundColor: "white",
            penColor: "black"
        }
    );
}

//---------------------------------------------
// BORRAR FIRMA
//---------------------------------------------

btnBorrarFirma.addEventListener("click", () => {

    if (signaturePad) {

        signaturePad.clear();
    }
});

//---------------------------------------------
// FINALIZAR FORMACIÓN
//---------------------------------------------

btnAceptarFirma.addEventListener("click", () => {

    if (!signaturePad || signaturePad.isEmpty()) {

        alert(
            "Debe realizar su firma digital para finalizar la formación."
        );

        return;
    }

    document.querySelector(".container").style.display = "none";

    pantallaFinal.style.display = "flex";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
