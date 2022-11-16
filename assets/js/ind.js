const btn = document.querySelector('#btn');
const formulario = document.querySelector('#formulario');
const respuesta = document.querySelector('#respuesta');

/*Funcion para sacar los datos del Formulario con FormData*/

const getData = () => {
    const datos = new FormData(formulario);
    const datosProcesados = Object.fromEntries(datos.entries());
    console.log(datosProcesados)
    formulario.reset();
    return datosProcesados;
}


/*Funcion para colocar los datos en el Servidor */

const postData = async () => {
/* SE USO JSON SERVER PARA SIMULAR UNA API. https://www.digitalocean.com/community/tutorials/json-server */
/* PONER EN LA TERMINAL:
npm init
npm install -g json-server
json-server --watch db.json
npm start
npm run server */
const newUser = getData();
    try{
    const response = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newUser)
    });
    if(response.ok){
        const jsonResponse = await response.json();

        /* Codigo a ejecutarse con la respuesta*/

        const {email, nombre, telefono, auto} = jsonResponse;

        respuesta.innerHTML = 
        `<div class="conteiner block respuesta">
            <h2>¡Muchas gracias, ${nombre}! Pronto va a recibir las mejores ofertas de ${auto} a ${email} o al ${telefono}</h2>
        </div>`
        respuesta.style.display = 'block'
    }
    }catch(error){
        console.log(error);
    }
}

btn.addEventListener('click', (event) => {
    event.preventDefault();
    postData();
})