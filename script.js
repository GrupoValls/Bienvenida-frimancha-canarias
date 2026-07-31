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

let signaturePad;

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

function validarFormulario(){

    const completo=

        nombre.value.trim()!="" &&
        apellidos.value.trim()!="" &&
        dni.value.trim()!="" &&
        fechaNacimiento.value!="" &&
        telefono.value.trim()!="" &&
        email.value.trim()!="" &&
        direccion.value.trim()!="" &&
        tallaCalzado.value!="" &&
        tallaPantalon.value!="" &&
        tallaCamisa.value!="" &&
        aceptaRGPD.checked;

    btnIniciar.disabled=!completo;

}

[
nombre,
apellidos,
dni,
fechaNacimiento,
telefono,
email,
direccion
].forEach(campo=>campo.addEventListener("input",validarFormulario));

[
tallaCalzado,
tallaPantalon,
tallaCamisa
].forEach(campo=>campo.addEventListener("change",validarFormulario));

aceptaRGPD.addEventListener("change",validarFormulario);

//---------------------------------------------
// INICIAR
//---------------------------------------------

function iniciarVideo(){

    if(btnIniciar.disabled) return;

    registro.style.display="none";

    videoSection.style.display="block";

    video.currentTime=0;

    video.play();

}

//---------------------------------------------
// CONTROL VIDEO
//---------------------------------------------

let tiempoMaximoVisto=0;
let ultimaPosicionValida=0;
let testActivado=false;

video.addEventListener("timeupdate",()=>{

    if(!video.seeking){

        ultimaPosicionValida=video.currentTime;

        if(video.currentTime>tiempoMaximoVisto){

            tiempoMaximoVisto=video.currentTime;

        }

    }

    if(

        !testActivado &&
        video.duration>0 &&
        tiempoMaximoVisto>=video.duration-1

    ){

        testActivado=true;

        aceptaVideo.disabled=false;

        alert("Vídeo completado.\n\nYa puede realizar el test.");

    }

});

video.addEventListener("seeking",()=>{

    if(video.currentTime>tiempoMaximoVisto+1){

        alert("No puede adelantar el vídeo.");

        video.currentTime=ultimaPosicionValida;

    }

});

aceptaVideo.addEventListener("change",()=>{

    btnTest.disabled=!(aceptaVideo.checked && testActivado);

});

//---------------------------------------------
// MOSTRAR TEST
//---------------------------------------------

function mostrarTest(){

    if(btnTest.disabled){

        alert("Debe completar el vídeo.");

        return;

    }

    testSection.style.display="block";

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


    //---------------------------------------------
    // TEST SUPERADO
    //---------------------------------------------

    alert(

        "¡¡ENHORABUENA!!\n\n" +

        "HA SUPERADO CORRECTAMENTE EL TEST FINAL.\n\n" +

        "POR FAVOR, PROCEDA A REALIZAR SU FIRMA DIGITAL PARA FINALIZAR LA FORMACIÓN."

    );


    // Mostramos la zona de firma

    firmaSection.style.display = "block";


    // Inicializamos la firma

    inicializarFirma();


    // Bajamos automáticamente hasta la firma

    firmaSection.scrollIntoView({

        behavior: "smooth"

    });

}


//---------------------------------------------
// INICIALIZAR FIRMA DIGITAL
//---------------------------------------------

function inicializarFirma() {

    // Si ya existe una firma anterior la eliminamos
    if (signaturePad) {
        signaturePad.off();
    }

    // Ajustamos el canvas al tamaño visible
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Creamos la firma
    signaturePad = new SignaturePad(canvas);

}


//---------------------------------------------
// BORRAR FIRMA
//---------------------------------------------

btnBorrarFirma.addEventListener("click", function () {

    if (signaturePad) {
        signaturePad.clear();
    }

});


//---------------------------------------------
// FINALIZAR FORMACIÓN
//---------------------------------------------

btnAceptarFirma.addEventListener("click", function () {

    if (!signaturePad || signaturePad.isEmpty()) {

        alert(
            "DEBE REALIZAR SU FIRMA DIGITAL PARA FINALIZAR LA FORMACIÓN."
        );

        return;

    }

    document.body.innerHTML = `

        <div style="
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            height:100vh;
            text-align:center;
            font-family:Arial;
            padding:40px;
            background:#f4f6f8;
        ">

            <img src="logo.png"
                 style="width:250px;margin-bottom:30px;">

            <h1 style="
                font-size:60px;
                color:#f47c20;
                margin-bottom:20px;
            ">
                ¡GRACIAS!
            </h1>

            <h2>
                Formación completada correctamente.
            </h2>

            <p>
                Gracias por completar el proceso de acogida de
                Frimancha Canarias.
            </p>

        </div>

    `;

});
