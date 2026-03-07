
  class Telefono {
      constructor(serie, imei, marca, modelo, propietario) {
        this.serie = serie;
        this.imei = imei;
        this.marca = marca;
        this.modelo = modelo;
        this.propietario = propietario;
        this.diagnostico = null;
        this.autorizado = false;
        this.abono = 0;
        this.tecnico = null;
        this.repuestos = [];
        this.estado = "INGRESADO";
      }

      resumen() {
        return `${this.marca} ${this.modelo} . ${this.propietario}`;
      }
    }
    class Diagnostico {
      constructor(descripcion, costoEstimado) {
        this.descripcion = descripcion;
        this.costoEstimado = Number(costoEstimado);
        this.fecha = new Date().toLocaleDateString("es-PE");
      }
    }
    class Tecnico {
      constructor(nombre, skills = []) {
        this.nombre = nombre;
        this.skills = skills;
      }

      puedeAtender(marca) {
        return this.skills
          .map((item) => item.toLowerCase())
          .includes(marca.toLowerCase());
      }
    }

    class Repuesto {
      constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = Number(precio);
      }
    }
    class SistemaReparacion {
      constructor() {
        this.telefonos = new Map();
        this.bloqueados = {
          series: new Set(["12321321"]),
          imeis: new Set(["IMEI123123"]),
        };

        this.tecnicos = [
          new Tecnico("Carlos Perez", ["samsung", "huawei"]),
          new Tecnico("Marta Perez", ["huawei"]),
          new Tecnico("juan Perez", ["apple", "samsung"]),
        ];
      }

      registrarTelefono(serie, imei, marca, modelo, propietario) {
        const tel = new Telefono(serie, imei, marca, modelo, propietario);
        this.telefonos.set(serie, tel);
        return tel;
      }

      diagnosticar(serie, descripcion, costoEstimado) {
        const tel = this._get(serie);
        if (!descripcion || !costoEstimado)
          throw new Error("Completar descripcion y costo estimado");
        tel.diagnostico = new Diagnostico(descripcion, costoEstimado);
        tel.estado = "DIAGNOSTICADO";


        return tel.diagnostico;
      }

      autorizar(serie) {
        const tel = this._get(serie);

        if (!tel.diagnostico) throw new Error("Primero diagnostica");

        tel.autorizado = true;
        tel.abono = tel.diagnostico.costoEstimado * 0.5;
        tel.estado = "AUTORIZADO";

        console.log(tel);
        return { abono: tel.abono, costo: tel.diagnostico.costoEstimado };
      }

      asignarTecnico(serie, nombreTecnico) {
        const tel = this._get(serie);

        if (!tel.autorizado) throw new Error("El equipo no esta autorizado.");

        const tec = this.tecnicos.find(
          (tecnico) => tecnico.nombre === nombreTecnico,
        );

        if (!tec) throw new Error("El tecnico no existe");

        if (!tec.puedeAtender(tel.marca))
          throw new Error(
            `El Tecnico ${nombreTecnico} no puede antender ${tel.marca}`,
          );

        tel.tecnico = tec;
        tel.estado = "EN REPARACION";

        console.log("tel: ", tel);
        return tel;
      }

      agregarRepuesto(serie, nombre, precio) {
        const tel = this._get(serie);

        if (!nombre || !precio)
          throw new Error("Ingrese nombre y precio del respuesto");

        const rep = new Repuesto(nombre, precio);

        tel.repuestos.push(rep);

        return rep;
      }

      verEstado(serie) {
        return this._get(serie);
      }

      _get(serie) {
        const tel = this.telefonos.get(serie);
        if (!tel) throw new Error(`Equipo con serie: ${serie} no existe.`);

        return tel;
      }
    }


    const sistema = new SistemaReparacion();
    let currentStep = 0;
    let currentSerie = null;
    let tecnicoSelected = null;

    const STEPS = [
      { label: `<span class="text-black">inicio</span>'`, icon: `<i class="bi bi-house-fill text-dark"></i> `},
      { label: `<span class="text-black">registrar</span>'`, icon: `<i class="bi bi-table text-dark"></i>` },
      { label: `<span class="text-black">diagnostico</span>`, icon: `<i class="bi bi-clipboard2-pulse text-dark"></i>` },
      { label: `<span class="text-black">automatizacion</span>`, icon: `<i class="bi bi-bounding-box text-dark"></i>`},
      { label: `<span class="text-black">tecnico</span>`, icon: `<i class="bi bi-hammer text-dark"></i>` },
      { label: `<span class="text-black">repuestos</span>`, icon: `<i class="bi bi-gear-wide-connected text-dark"></i>` },
      { label: `<span class="text-black">estado final</span>`, icon: `<i class="bi bi-inbox-fill text-dark"></i>` },
    ];


    function renderStepper() {
      const container = document.getElementById("stepper");
      container.innerHTML = "";

      STEPS.forEach((s, i) => {
        const done = i < currentStep;
        const active = i === currentStep;

        const accessible = i <= currentStep || (currentSerie && i <= 6);

        if (i > 0) {
          const line = document.createElement("div");
          line.className = `w-0.5 h-4 ml-[13px] ${done ? "bg-emerald-500" : "bg-zinc-800"}`;
          container.appendChild(line);
        }
        const row = document.createElement("div");
        row.className = `flex items-center gap-3 ${accessible ? "cursor-pointer" : "cursor-default"} group py-0.5`;

        if (accessible) row.onclick = () => goStep(i);

        row.innerHTML = `
              <div class="step-dot ${done ? "done" : active ? "active" : "idle"} w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300">
        ${done ? "✓" : i}
      </div>
      <p class="text-xs transition-colors ${active ? "text-white font-bold" : done ? "text-emerald-400 group-hover:text-emerald-300" : accessible ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-700"}">${s.icon} ${s.label}</p>
    `;
        container.appendChild(row);
      });
    }

    function updateTelPanel() {
      const panel = document.getElementById("telActivo");
      if (!currentSerie) {
        panel.classList.add("hidden");
        return;
      }
      const tel = sistema.telefonos.get(currentSerie);
      if (!tel) return;
      panel.classList.remove("hidden");
      document.getElementById("telActivoNombre").textContent =
        `${tel.marca} ${tel.modelo}`;
      document.getElementById("telActivoSerie").textContent =
        `Serie: ${tel.serie}`;
      const el = document.getElementById("telActivoEstado");
      const cls = {
        INGRESADO: "bg-blue-500/20 text-blue-300 border-blue-600/40",
        DIAGNOSTICADO: "bg-yellow-500/20 text-yellow-300 border-yellow-600/40",
        AUTORIZADO: "bg-purple-500/20 text-purple-300 border-purple-600/40",
        "EN REPARACIÓN":
          "bg-emerald-500/20 text-emerald-300 border-emerald-600/40",
      };
      el.className = `inline-block mt-1 text-xs px-2 py-0.5 rounded-full border font-bold ${cls[tel.estado] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`;
      el.textContent = tel.estado;
    }

    function v(id) {
      const el = document.getElementById(id);
      return el ? el.value.trim() : "";
    }

    function goStep(n) {
      currentStep = n;
      renderStepper();
      updateTelPanel();
      const tpl = document.getElementById(`tpl-${n}`);
      // console.log(tpl);
      const content = document.getElementById("stepContent");
      content.innerHTML = "";
      if (!tpl) return;
      content.appendChild(tpl.content.cloneNode(true));

      if (n === 2) populateStep2();
      if (n === 3) populateStep3();
      if (n === 4) populateStep4();
      if (n === 6) populateStep6();
    }

    // FUNCION ACTIONS
    function step1Action() {
      try {
        const tel = sistema.registrarTelefono(
          v("s1_serie"),
          v("s1_imei"),
          v("s1_marca"),
          v("s1_modelo"),
          v("s1_prop"),
        );
        currentSerie = tel.serie;

        goStep(2);
      } catch (e) {
      }
    }

    function step2Action() {
      if (!currentSerie) return;

      try {
        const d = sistema.diagnosticar(
          currentSerie,
          v("s2_desc"),
          v("s2_costo"),
        );

        goStep(3);
      } catch (error) {
        console.log(error);
      }
    }

    function step3Action() {
      const chk = document.getElementById("s3_check");
      if (!chk || !chk.checked) return;

      try {
        const { abono, costo } = sistema.autorizar(currentSerie);
        goStep(4);
      } catch (error) {
        console.log(error);
      }
    }

    function step4Action() {
      if (!tecnicoSelected) return;

      try {
        const tec = sistema.asignarTecnico(currentSerie, tecnicoSelected);

        goStep(5);
      } catch (error) {
        console.log(error);
      }
    }

    function infoCard(tel) {
      return `<div class="flex items-center gap-3"><span class="text-2xl">📱</span><div><p class="font-bold text-sm">${tel.marca} ${tel.modelo}</p><p class="text-xs text-zinc-400">${tel.propietario}</p> . <code class="text-emerald-400">${tel.serie}</code></div></div>`;
    }
    function populateStep2() {
      const el = document.getElementById("s2_telInfo");
      if (currentSerie) {
        el.innerHTML = infoCard(sistema.telefonos.get(currentSerie));
      } else {
        el.innerHTML = `<p class="text-xs text-red-400">Primero registra un telefono en el paso 1</p>`;
      }
    }

    function populateStep3() {
      if (!currentSerie) return;

      const tel = sistema.telefonos.get(currentSerie);
      document.getElementById("s3_telInfo").innerHTML = infoCard(tel);

      if (tel.diagnostico) {
        document.getElementById("s3_costoTotal").textContent =
          `s/ ${tel.diagnostico.costoEstimado}`;
        document.getElementById("s3_abono").textContent =
          `s/ ${tel.diagnostico.costoEstimado * 0.5}`;
      }
    }

    function populateStep4() {
      if (!currentSerie) return;
      const tel = sistema.telefonos.get(currentSerie);
      document.getElementById("s4_telInfo").innerHTML = infoCard(tel);
      const lista = document.getElementById("s4_tecnicos");
      lista.innerHTML = "";
      tecnicoSelected = null;
      sistema.tecnicos.forEach((tec) => {
        const puede = tec.puedeAtender(tel.marca);
        const div = document.createElement("div");
        div.className = `flex items-center justify-between p-4 rounded-xl border transition-all ${puede ? "border-zinc-700 hover:border-emerald-500 bg-zinc-900 cursor-pointer" : "border-zinc-800 bg-zinc-900/30 opacity-40 cursor-not-allowed"}`;
        div.innerHTML = `
      <div>
        <p class="font-bold text-sm ${puede ? "text-white" : "text-zinc-500"}">${tec.nombre}</p>
        <p class="text-xs text-zinc-500 mt-0.5">Skills: ${tec.skills.join(", ")}</p>
      </div>
      ${
        puede
          ? `<span class="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded-full">✓ ${tel.marca}</span>`
          : `<span class="text-xs bg-red-500/10 text-red-400 border border-red-800/30 px-2 py-0.5 rounded-full">Sin skill para ${tel.marca}</span>`
      }
    `;
        if (puede) {
          div.onclick = () => {
            document
              .querySelectorAll("#s4_tecnicos > div")
              .forEach((d) =>
                d.classList.remove(
                  "border-emerald-500",
                  "bg-emerald-950/20",
                  "ring-2",
                  "ring-emerald-500/30",
                ),
              );
            div.classList.add(
              "border-emerald-500",
              "bg-emerald-950/20",
              "ring-2",
              "ring-emerald-500/30",
            );
            tecnicoSelected = tec.nombre;
          };
        }
        lista.appendChild(div);
      });
    }

    function populateStep6() {
      const el = document.getElementById("s6_contenido");
      if (!currentSerie) {
        el.innerHTML = `<p class="text-red-400 text-sm">No hay equipo en flujo. Vuelve al Paso 1.</p>`;
        return;
      }
      const tel = sistema.verEstado(currentSerie);
      const total = tel.repuestos.reduce((s, r) => s + r.precio, 0);
      const esCls = {
        INGRESADO: "text-blue-400",
        DIAGNOSTICADO: "text-yellow-400",
        AUTORIZADO: "text-purple-400",
        "EN REPARACIÓN": "text-emerald-400",
      };

      const estaciones = [
        {
          paso: "Paso 1 · Ingreso",
          hecho: true,
          detalle: `Serie: ${tel.serie} | IMEI: ${tel.imei}`,
        },
        {
          paso: "Paso 2 · Diagnóstico",
          hecho: !!tel.diagnostico,
          detalle: tel.diagnostico
            ? `"${tel.diagnostico.descripcion}" — S/${tel.diagnostico.costoEstimado}`
            : "Pendiente",
        },
        {
          paso: "Paso 3 · Autorización",
          hecho: tel.autorizado,
          detalle: tel.autorizado
            ? `Firmada · Abono: S/${tel.abono}`
            : "Pendiente",
        },
        {
          paso: "Paso 4 · Técnico",
          hecho: !!tel.tecnico,
          detalle: tel.tecnico
            ? `${tel.tecnico.nombre} (${tel.tecnico.skills.join(", ")})`
            : "Sin asignar",
        },
        {
          paso: "Paso 5 · Repuestos",
          hecho: tel.repuestos.length > 0,
          detalle:
            tel.repuestos.length > 0
              ? `${tel.repuestos.length} pieza(s) — Total S/${total}`
              : "Sin repuestos",
        },
      ];

      el.innerHTML = `
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-5">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-lg font-extrabold">${tel.marca} ${tel.modelo}</p>
          <p class="text-zinc-400 text-sm">${tel.propietario} · Serie: ${tel.serie}</p>
        </div>
        <span class="text-xs font-extrabold ${esCls[tel.estado] || "text-zinc-400"} bg-zinc-800 px-3 py-1 rounded-full">${tel.estado}</span>
      </div>
    </div>
    <p class="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-3">Recorrido del equipo</p>
    <div class="space-y-2 mb-5">
      ${estaciones
        .map(
          (e) => `
        <div class="flex items-start gap-3 bg-zinc-900 border ${e.hecho ? "border-emerald-800/40" : "border-zinc-800"} rounded-xl p-4">
          <span class="text-lg mt-0.5">${e.hecho ? "✅" : "⏳"}</span>
          <div>
            <p class="font-bold text-sm ${e.hecho ? "text-white" : "text-zinc-500"}">${e.paso}</p>
            <p class="text-xs text-zinc-400 mt-0.5">${e.detalle}</p>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center"><p class="text-xs text-zinc-500 mb-1">Costo estimado</p><p class="text-lg font-extrabold">S/ ${tel.diagnostico?.costoEstimado || 0}</p></div>
      <div class="bg-purple-950/30 border border-purple-800/30 rounded-xl p-4 text-center"><p class="text-xs text-purple-400 mb-1">Abono pagado</p><p class="text-lg font-extrabold text-purple-300">S/ ${tel.abono}</p></div>
      <div class="bg-orange-950/30 border border-orange-800/30 rounded-xl p-4 text-center"><p class="text-xs text-orange-400 mb-1">Total repuestos</p><p class="text-lg font-extrabold text-orange-300">S/ ${total}</p></div>
    </div>
  `;
    }

    function step5AddRepuesto() {
      if (!currentSerie) return;

      try {
        const rep = sistema.agregarRepuesto(
          currentSerie,
          v("s5_nombre"),
          v("s5_precio"),
        );

        renderRepuestos();
      } catch (error) {
        console.log(error);
      }
    }

    function renderRepuestos() {
      const tel = sistema.telefonos.get(currentSerie);

      if (!tel) return;

      const lista = document.getElementById("s5_lista");
      const totalEl = document.getElementById("s5_total");
      const totalNum = document.getElementById("s5_totalNum");

      if (!lista) return;

      lista.innerHTML = tel.repuestos
        .map(
          (r, i) =>
            `<div class="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm">
      <span class="text-zinc-300">${i + 1}. ${r.nombre}</span>
      <span class="text-orange-400 font-bold">S/ ${r.precio}</span>
    </div>`,
        )
        .join("");
      const total = tel.repuestos.reduce((s, r) => s + r.precio, 0);
      console.log("tel: ", tel);
      if (totalEl)
        totalEl.classList.toggle("hidden", tel.repuestos.length === 0);
      if (totalNum) totalNum.textContent = `s/ ${total}`;
    }

    function resetAll() {
      currentSerie = null;
      tecnicoSelected = null;
      sistema.telefonos.clear();
      goStep(0);
    }

    goStep(0);