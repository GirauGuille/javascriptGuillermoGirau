import autos from './utilities/autos.js';


let insertDOMcontent = document.querySelector("#insertDOMcontent");
let listaCarrito = document.querySelector("#listaCarrito");
let autosSeleccionados = []
let total = 0

/* FUNCIÓN PARA IMPRIMIR BASE DE DATOS EN EL DOM */
function printData(object) {
    object.forEach((element, index) => {
        insertDOMcontent.innerHTML += `<div class="col-md-4">
                <div class="card mb-5">
                    <img class="imgFitFull" src="${element.foto}${index}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <div class="info-card">
                            <h2 class="card-title">${element.nombre}</h5>
                            <small>${element.marca}</small>
                            <p class="precio"> <span class="u-pull-right">$${element.precio}</span></p>
                            <hr>
                            <p class="card-text"></p>
                            <div class="d-grid gap-2">
                        <a href="#" class="btn btn-info agregar-carrito" id="${element._id}">Agregar al carrito</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

printData(autos);


/* 1° EVENTO ESCUCHAR CLICK A AGREGAR CARRITO */
let buttonCard = document.querySelectorAll("#insertDOMcontent .card a");

buttonCard.forEach((element) => {
    element.addEventListener("click", (e) => {
        e.preventDefault();
        let id = e.target.id;
        buscarAuto(id, autos);
    });
});



/* 2° FUNCIÓN PARA BUSCAR AUTO SELECIONADO EN EL ARRAY PARA LUEGO INSERTAR EN EL ARRAY CARRITO */

function buscarAuto(idAutos, buscarAuto) {
    let autoSeleccionado = buscarAuto.find((element) => idAutos == element._id);
    let auto = [];
    auto.push(autoSeleccionado);
    /* SPREAT OPERATOR PARA ACUMULAR AUTOS AL CARRITO */
    autosSeleccionados = [...autosSeleccionados, ...auto];
    console.log(autosSeleccionados)
    agregarAutoAlcarro();
};


/* 3° FUNCIÓN PARA QUE SE AGREGUE EL AUTO SELECIONADO AL CARRITO Y FIGURE AHÍ MISMO*/
function agregarAutoAlcarro() {
    listaCarrito.innerHTML = ``;
    autosSeleccionados.forEach((element, index) => {
        listaCarrito.innerHTML += `<tr>
            <td><img class="imgFitMiniatura" src="${element.foto}${index}" alt="${element.nombre}"></td>
            <td>${element.marca} ${element.nombre}</td>
            <td class="text-center">$ ${element.precio}</td>
            <td class="text-center"><a href="#" id="${element._id}" class="borrar-auto" data-id="1">X</a></td>
        </tr>`;
    });

    /* FUNCIÓN PARA ELIMIAR AUTO DEL CARRITO */
    let buttonDelete = document.querySelectorAll('#listaCarrito tr td a');
    buttonDelete.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            let id = e.target.id
            autosSeleccionados = autosSeleccionados.filter(autos => autos._id !== id);
            console.log('Salida de autosSeleccionados', autosSeleccionados)
            agregarAutoAlcarro()
        })
    });
    /* FUNCIÓN PARA SACAR TOTAL DEL CARRITO */

    total = autosSeleccionados.reduce((acc, element) => acc + element.precio, 0)
    console.log(total);
    document.getElementById("totalCompra").innerHTML = "$ " + `${total}`;

    sincronizarConLocalStorage();

    /* FUNCIÓN DEL BOTÓN COMPRAR CON CONDICIONALES */
    let botonComprar = document.getElementById('compraste');

    botonComprar.addEventListener('click', (e) => {
        if (autosSeleccionados == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Uups, carrito vacío',
                text: 'Tiene que haber, al menos, un auto en el carrito o más.',
            })
        } else {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })

            swalWithBootstrapButtons.fire({
                title: '¿Estás seguro que deseas terminar la compra?',
                text: "Puedes elegir todos los que quieras",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Si, estoy seguro!',
                cancelButtonText: '¡No, continuemos!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    swalWithBootstrapButtons.fire(
                        '¡BIEN, YA CASI ES TUYO!',
                        'llene los siguientes datos',
                        'info'
                    )
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire(
                        '¡BIEN!',
                        'Continuemos',
                        'success',
                    )
                }
            })
        }
    });

}

/* FUNCIÓN PARA QUE SE ALMACENE LOS ITEMS DEL listaCarrito EN EL LOCAL STORAGE Y NO SE VAYA CUANDO REFRESCAMOS EL NAVEGADOR */
function sincronizarConLocalStorage() {
    localStorage.setItem("autos", JSON.stringify(autosSeleccionados));
};


document.addEventListener("DOMContentLoaded", () => {
    autosSeleccionados = JSON.parse(localStorage.getItem("autos")) || [];
    agregarAutoAlcarro();
});


/* BUSCAR AUTO EN EL ARCHIVO JSON*/

const formulario = document.querySelector('#formulario')
const contentSpinnerLoading = document.querySelector('.contentSpinnerLoading')
contentSpinnerLoading.style.display = 'none';

/* ESCRIBE AUTO A BUSCAR */
formulario.addEventListener('submit', function (e) {
    e.preventDefault()//PARA QUE NO SE REFRESQUE
    const inputBuscador = document.querySelector('#escribeAuto').value
    if (inputBuscador.length > 0) {//si imput es mayor a un digito.
        findAuto(inputBuscador)
    }
})

const findAuto = ()=>{
    contentSpinnerLoading.style.display = 'flex';
    fetch(`https://mocki.io/v1/4ec1b27e-29d3-41e6-943c-c897f4a7bf72`) // fackke api form https://mocki.io/fake-json-api

        .then( response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            response.json()
                .then( data =>{
                    console.log(data)
                    const { Search } = data 
                    imprimirData( Search )
                    contentSpinnerLoading.style.display = 'none';
                })
        .catch(
        Swal.fire('error')
        )
        })
}


/* IMPRIMIR AUTO BUSCADO SI ES QUE EXISTE EN EL JSON */
const imprimirData = ( cardAuto ) => {
console.log(cardAuto)
    if( cardAuto !== undefined ){
        data.forEach(( element) => {
            const { foto, nombre, marca, precio, _id } = element//desectructuración del resultado de la busqueda
            insertDOMcontent.innerHTML += `<div class="col-md-4">
            <div class="card mb-5">
                <img class="imgFitFull" src="${foto}" class="card-img-top" alt="...">
                <div class="card-body">
                    <div class="info-card">
                        <h2 class="card-title">${nombre}</h5>
                        <small>${marca}</small>
                        <p class="precio"> <span class="u-pull-right">$${precio}</span></p>
                        <hr>
                        <p class="card-text"></p>
                        <div class="d-grid gap-2">
                    <a href="#" class="btn btn-info agregar-carrito" id="${_id}">Agregar al carrito</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        });
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Uups, lo siento',
            text: 'No tenemos en stock ese auto',
        })
    }
}