// console.log("Inicio de la aplicacion");

if (typeof (Storage) !== "undefined") {
    console.log("Si hay storage")
}
// else{
//     console.log("No hay storage")
// }

// localStorage.setItem("nombre","Roberto")
// console.log(localStorage.getItem("nombre"))
// localStorage.removeItem("nombre")

// sessionStorage.setItem("password","1234567");
// console.log(sessionStorage.getItem("password"));
// sessionStorage.removeItem("password");

// class Persona{
//     constructor(nombre, apellido, nroDocumento){
//         this.nombre = nombre;
//         this.apellido=apellido;
//         this.nroDocumento =nroDocumento;
//     }
// }

// let objPersona = new Persona("Roberto","Pineda","001575291");

// console.log(objPersona)

// console.log(JSON.stringify(objPersona))

// //localStorage.setItem("persona",JSON.stringify(objPersona))

// let objPersona2 = JSON.parse(localStorage.getItem("persona"))

// console.log(objPersona2)
// console.log(objPersona2.nombre)


// Sistema de inventario de Kits de Gundam
let arrKits = [];

class Gundam {
    constructor(nombre, descripcion, escala, img, isCustom = false, custom) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.escala = escala;
        this.img = img;
        this.isCustom = isCustom;
        this.custom = custom;
    }
}
let $table = $("#table");

const Inventario = function () {

    let franquicia, coleccionista;

    function configurar() {

        arrKits = JSON.parse(localStorage.getItem("kits") !== null ? localStorage.getItem("kits") : "[]");

        console.log(arrKits)

        $table.bootstrapTable({ data: arrKits });

        document.getElementById("txtColeccionista").innerText = coleccionista;
        let arrClassTitulo = document.getElementsByClassName("clsTitulo");
        console.log(arrClassTitulo)
        arrClassTitulo[0].innerText = "Sistema de Inventarios de " + franquicia;

        let arrP = document.getElementsByTagName("p")
        console.log(document.getElementsByName("dato"))

        console.log(arrP)

        $("#txtFranquicia").text(franquicia);
        $(".clsTitulo").css({ "backgroundColor": "Blue", "color": "white" })
        console.log($("p"))
    }
    function eventos() {
        document.getElementById("btnAgregar").addEventListener("click", agregar);
        $("#btnBorrar").on("click", (e) => {
            e.preventDefault();

            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    arrKits = [];
                    localStorage.setItem("kits", JSON.stringify(arrKits));
                    $table.bootstrapTable("load", arrKits);
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                }
            });



        })
    }

    async function agregar() {
        console.log("Hizo Click");

        const { value: formValues } = await Swal.fire({
            title: "Ingresa tus datos de vuelo",
            icon: "info",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            html: `
            <input id="nombre" type="text" placeholder="Escribe el nombre del kit"
    class="form-control input-md">
<input id="descripcion" type="text" placeholder="Escribe la descripcion"
    class="form-control input-md">
<input id="escala" type="text" placeholder="escribe la escala"
    class="form-control input-md">
    <input id="imagen" type="text" placeholder="Escribe el nombre de la imagen"
    class="form-control input-md">
<label for="checkboxes-0" class="checkbox-inline input-md">
            <input type="checkbox" name="" id="chkIsCustom" onchange="IsCustomCheck(this)" value="SI">
            SI es Custom
        </label>
    <div class="form-group input-md" id="divCustom" style="display: none;">
        <input type="text" id="custom" placeholder="Escribe el custom del Kit">
    </div>

            `,
            preConfirm: () => {
                return {
                    nombre: $("#nombre").val(),
                    descripcion: $("#descripcion").val(),
                    escala: $("#escala").val(),
                    img: $("#imagen").val(),
                    isCustom: $("#chkIsCustom:checked").val() == "SI" ? true : false,
                    custom: $("#custom").val().split(';')

                }
            }
        })
        if (formValues) {
            console.log(formValues);
            let objKit = new Gundam(
                formValues.nombre,
                formValues.descripcion,
                formValues.escala,
                formValues.img,
                formValues.isCustom,
                formValues.custom
            )
            arrKits.push(objKit);

            localStorage.setItem("kits", JSON.stringify(arrKits));
            $table.bootstrapTable("load", arrKits);
        }

    }

    return {
        init: function (parametros) {
            franquicia = parametros.franquicia;
            coleccionista = parametros.coleccionista;
            configurar();
            eventos();
        }
    }
}();

function IsCustomCheck(event) {
    console.log("Cambio el Check");
    if (event.checked) {
        $("#divCustom").toggle(1500);
    } else {
        $("#divCustom").toggle(1500);
    }
}


function accionFormatter(value, row, index){
return [
    `<a class="edit" href="javascript:void(0)" title="edit">`,
    `<i class="fas fa-edit"> </i> Editar</a>`,
    `<a class="delete" href="javascript:void(0)" title="delete">`,
    `<i class="fas fa-trash"> </i> Borrar</a>`
].join('');
}

window.kitsEvents = {
    'click .edit': (e,value, row,index)=>{
        console.log("Editar")
    },
    'click .delete': (e,value, row,index)=>{
        let inx = arrKits.indexOf(row);
        if(inx > -1) arrKits.splice(inx,1);

        localStorage.setItem('inventarioKits', JSON.stringify(arrKits));
        $table.bootstrapTable('load', arrKits);
    }

}

function detailFormatter(index, row) {
    console.log(row);
    let html = [];
    $.each(row, (key, value)=>{
        switch (key) {
            case "img":
                html.push(`<img src="img/${value}.webp" width="300px" />`)
                break;
            case "isCustom":
                if(value){
                    let htmlStr = `<b>MODIFICACIONES</b><ul>`;
                    console.log(row.custom)
                    $.each(row.custom, (a,b)=>{
                        htmlStr += `<li>${b}</li>`
                    })
                    htmlStr += `</ul>`
                    html.push(`<p>${htmlStr}</p>`)
                }
            case "custom":
                break;
            default:
                html.push(`<p><b> ${key.toUpperCase()}: </b> ${value} </p> `)
                break;
        }
    })
    return html.join('');
}