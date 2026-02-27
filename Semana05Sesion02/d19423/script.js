const Reserva = function () {

    let nombre, ciudad;

    let avionIda, avionVuelta;

    function configurar() {
        $("#txtNombre").text(nombre);
        $("#txtCiudad").text(ciudad);
        avionIda = new Aviones("JA 7743", "Airbus 320 Neo", 192, 96, 10000);
        avionVuelta = new Aviones("JA 7742", "Airbus 320 Neo", 192, 96, 10000);
        $("#divReserva").hide();
    };
    function eventos() {
        console.log("Inicio de eventos");
        $("#btnReservar").on("click", reservar)
    };
    async function reservar(e) {
        console.log("Reservar");
        $("#divReserva").hide();
        e.preventDefault();
        const { value: formValues } = await Swal.fire({
            title: "Ingresa tus datos de vuelo",
            icon: "info",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            html: `
            <input id="origen" type="text" placeholder="Cual es la ciusdad de Origen"
    class="form-control input-md">
<input id="destino" type="text" placeholder="Cual es la Ciudad de Destino"
    class="form-control input-md">
<input id="fechaIda" type="text" placeholder="Cual es la fecha de ida"
    class="form-control input-md">
<input id="fechaVuelta" type="text" placeholder="Cual es la fecha de vuelta"
    class="form-control input-md">
            `,
            preConfirm: () => {
                return {
                    origen: $("#origen").val(),
                    destino: $("#destino").val(),
                    fechaIda: $("#fechaIda").val(),
                    fechaVuelta: $("#fechaVuelta").val()
                }
            }
        })

        if (formValues) {
            console.log(formValues);
            let objReserva = new Reservas(formValues.origen, formValues.destino, formValues.fechaIda, formValues.fechaVuelta);
            objReserva.asignarAvionIda(avionIda);
            objReserva.asignarAvionVuelta(avionVuelta);
            incluirPasajeros().then(data => {
                console.log(data);
                objReserva.avionIda.agregarPasajero(data);
                objReserva.avionVuelta.agregarPasajero(data);
                dibujarCheckOut(objReserva);
            }).catch(error => { console.error(error) })
        }

    }

    function dibujarCheckOut(objReserva) {
        console.log(objReserva);
        $("#idaNombre").val(objReserva.avionIda.arrPasajeros[0].nombres);
        $("#idaApellido").val(objReserva.avionIda.arrPasajeros[0].apellidos);
        $("#idaFecha").val(objReserva.fechaIda);
        $("#idaVuelo").val(objReserva.avionIda.matricula)
        $("#idaOrigen").val(objReserva.origen)
        $("#vueltaNombre").val(objReserva.avionVuelta.arrPasajeros[0].nombres);
        $("#vueltaApellido").val(objReserva.avionVuelta.arrPasajeros[0].apellidos)
        $("#vueltaFecha").val(objReserva.fechaVuelta)
        $("#vueltaVuelo").val(objReserva.avionVuelta.matricula)
        $("#vueltaDestino").val(objReserva.destino)
        $("#divReserva").show();
    }

    async function incluirPasajeros() {
        const { value: formValues } = await Swal.fire({
            title: "Ingresa tus datos de vuelo",
            icon: "info",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            html: `
            <input id="nombres" type="text" placeholder="Cual es tu nombre"
    class="form-control input-md">
<input id="apellidos" type="text" placeholder="Cual es tu apellido"
    class="form-control input-md">
<input id="documento" type="text" placeholder="Cual es documento"
    class="form-control input-md">
            `,
            preConfirm: () => {
                return {
                    nombres: $("#nombres").val(),
                    apellidos: $("#apellidos").val(),
                    dni: $("#documento").val()
                }
            }
        })

        if (formValues) {
            console.log(formValues);
            let objPasajero = new Cliente(formValues.dni, formValues.nombres, formValues.apellidos, "", "", formValues.dni);
            return objPasajero;
        }
    }

    return {
        init: function (parametros) {
            nombre = parametros.nombre;
            ciudad = parametros.ciudad;
            configurar();
            eventos();
        }
    }
}();

class Persona {
    #isLogged = false;
    constructor(dni, nombres, apellidos, direccion, telefono) {
        this.dni = dni;
        this.direccion = direccion;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.telefono = telefono;
    }
    getLogged() {
        return this.#isLogged;
    }
    setLogged(newLog) {
        //Verifico si ya tiene iniciada la sesion 
        if (this.#isLogged && newLog) {
            return "Ya tienes iniciada la sesion"
        }
        else {
            //por el loggin
            if (newLog) {
                this.#isLogged = newLog;
                return "Inicio de sesion correcto"
            }
            //por el logout
            else {
                this.#isLogged = newLog;
                return "Cierre de sesion correcto"
            }
        }
    }
    login() {
        console.log(this.setLogged(true));
    }
    logout() {
        console.log(this.setLogged(false))
    }
}

class Cliente extends Persona {
    constructor(dni, nombres, apellidos, direccion, telefono, codCliente) {
        super(dni, nombres, apellidos, direccion, telefono);
        this.codCliente = codCliente;
    }
    pagar(medioPago) {
        return `El cliente ${this.nombres} ${this.apellidos} esta pagando con ${medioPago}`;
    }
}

class Empleado extends Persona {
    constructor(dni, nombres, apellidos, direccion, telefono, codEmpleado) {
        super(dni, nombres, apellidos, direccion, telefono);
        this.codEmpleado = codEmpleado;
    }
    cobrar(cliente, medioPago, monto) {
        return `El cliente ${cliente.nombres} ${cliente.apellidos} esta pagando ${monto} con ${medioPago}`
    }
}

class Aviones {
    constructor(matricula, modelo, nroAsientos, capacidadMinima, costoVuelo) {
        this.matricula = matricula;
        this.nroAsientos = nroAsientos;
        this.modelo = modelo;
        this.capacidadMinima = capacidadMinima;
        this.costoVuelo = costoVuelo;

        this.arrPasajeros = [];
        this.habilitado = false;
        this.reservado = 0;
    }

    agregarPasajero(pasajero) {
        this.arrPasajeros.push(pasajero);
        this.reservado++;
        if (this.reservado >= this.capacidadMinima) this.habilitado = true;
    }
}

class Reservas {
    constructor(origen, destino, fechaIda, fechaVuelta) {
        this.origen = origen;
        this.destino = destino;
        this.fechaIda = fechaIda;
        this.fechaVuelta = fechaVuelta;

        this.avionIda = null;
        this.avionVuelta = null;
    }
    asignarAvionIda(avion) {
        this.avionIda = avion;
    }
    asignarAvionVuelta(avion) {
        this.avionVuelta = avion;
    }
}