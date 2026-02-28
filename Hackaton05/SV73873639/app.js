/**
 * app.js
 * - UI + lógica de flujo (sin adivinar Advance)
 * - Selectores reales: sucursales/técnicos/repuestos
 * - Asignación automática según marca
 */

const $ = (id) => document.getElementById(id);

const seedOut = $("seedOut");
const checkOut = $("checkOut");
const createOut = $("createOut");
const orderOut = $("orderOut");
const historyHost = $("history");

const badgeStatus = $("badgeStatus");
const pillApi = $("pillApi");
const timeline = $("timeline");
const toastEl = $("toast");
const chipsSeed = $("chipsSeed");

const nextStationName = $("nextStationName");
const nextStationHint = $("nextStationHint");
const stationChecklist = $("stationChecklist");

const btnAdvance = $("btnAdvance");
const btnFillMinDeposit = $("btnFillMinDeposit");
const btnAutoAssign = $("btnAutoAssign");

const onboarding = $("onboarding");
const coachText = $("coachText");
const chkNoMostrar = $("chkNoMostrar");
const btnCloseOnboarding = $("btnCloseOnboarding");

const helpModal = $("helpModal");
$("btnHelp").addEventListener("click", () => helpModal.showModal());
$("btnCloseHelp").addEventListener("click", () => helpModal.close());

btnCloseOnboarding.addEventListener("click", () => {
  if (chkNoMostrar.checked) localStorage.setItem("rep_onboard_hide", "1");
  onboarding.close();
});

let currentRepair = null;
let catalogs = { branches: [], technicians: [], parts: [] };

const STATUS_LABEL = {
  RECEIVED: "Recepción",
  INITIAL_REVIEW_DONE: "Revisión inicial completada",
  AWAITING_AUTH: "En espera de autorización",
  AUTHORIZED: "Autorizado",
  IN_REPAIR: "En reparación",
  QA: "Control de calidad",
  READY_FOR_PICKUP: "Listo para entrega",
  DELIVERED: "Entregado",
  REJECTED: "Rechazado",
};

const STATUS_STEPS = [
  "RECEIVED",
  "INITIAL_REVIEW_DONE",
  "AWAITING_AUTH",
  "AUTHORIZED",
  "IN_REPAIR",
  "QA",
  "READY_FOR_PICKUP",
  "DELIVERED",
];

const FINAL_STATES = new Set(["DELIVERED", "REJECTED"]);

const CODE_LABEL = {
  INVALID_STATE: "Acción no permitida en este estado",
  INSUFFICIENT_DEPOSIT: "Abono insuficiente",
  TECHNICIAN_SKILL_MISMATCH: "Técnico no compatible con la marca",
  TECHNICIAN_REQUIRED: "Falta asignar técnico de reparación",
  INCOMPATIBLE_PART: "Repuesto no compatible con la marca",
  DEVICE_REPORTED: "Equipo reportado",
  BRANCH_NOT_FOUND: "Sucursal inexistente",
  TECH_NOT_FOUND: "Técnico inexistente",
  PART_NOT_FOUND: "Repuesto inexistente",
  NOT_FOUND: "No encontrado",
  BAD_REQUEST: "Solicitud inválida",
  NO_TECH_FOR_BRAND: "No hay técnicos para esa marca",
  NO_NEXT_STATE: "No existe siguiente estación",
};

class ApiError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

class ApiClient {
  async request(path, { method = "GET", body } = {}) {
    const res = await fetch(path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(data?.error ?? `Http ${res.status}`, data?.code ?? "ERROR", data?.details);
    return data;
  }

  health() { return this.request("/api/health"); }
  seed() { return this.request("/api/seed", { method: "POST" }); }
  reset() { return this.request("/api/reset", { method: "POST" }); }

  listBranches() { return this.request("/api/branches"); }
  listTechnicians() { return this.request("/api/technicians"); }
  listParts() { return this.request("/api/parts"); }

  checkReported(imei, serial) {
    const q = new URLSearchParams({ imei, serial }).toString();
    return this.request(`/api/devices/reported?${q}`);
  }

  createRepair(payload) { return this.request("/api/repairs", { method: "POST", body: payload }); }
  getRepair(id) { return this.request(`/api/repairs/${encodeURIComponent(id)}`); }

  initialDiagnosis(id, payload) {
    return this.request(`/api/repairs/${encodeURIComponent(id)}/initial-diagnosis`, { method: "POST", body: payload });
  }

  addPart(id, payload) {
    return this.request(`/api/repairs/${encodeURIComponent(id)}/parts`, { method: "POST", body: payload });
  }

  authorize(id, payload) {
    return this.request(`/api/repairs/${encodeURIComponent(id)}/authorize`, { method: "POST", body: payload });
  }

  assignTechnician(id, payload) {
    return this.request(`/api/repairs/${encodeURIComponent(id)}/assign-technician`, { method: "POST", body: payload });
  }

  autoAssign(id) {
    return this.request(`/api/repairs/${encodeURIComponent(id)}/auto-assign`, { method: "POST" });
  }

  advance(id) {
    return this.request(`/api/repairs/${encodeURIComponent(id)}/advance`, { method: "POST" });
  }
}

const api = new ApiClient();

const print = (el, obj) => { el.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2); };

function toast(msg, type = "warn") {
  toastEl.className = `toast show ${type}`;
  toastEl.textContent = msg;
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => {
    toastEl.className = "toast";
    toastEl.textContent = "";
  }, 4200);
}

function formatError(e) {
  if (!(e instanceof ApiError)) return String(e?.message ?? e);
  const codeLabel = CODE_LABEL[e.code] ?? e.code;
  const lines = [`${codeLabel}: ${e.message}`];

  if (e.details?.current) lines.push(`Estado actual: ${STATUS_LABEL[e.details.current] ?? e.details.current}`);
  if (Array.isArray(e.details?.allowed)) {
    const a = e.details.allowed.map((s) => STATUS_LABEL[s] ?? s).join(", ");
    lines.push(`Permitido en: ${a}`);
  }
  if (e.details && typeof e.details === "object" && !e.details.current && !e.details.allowed) {
    lines.push(`Detalles: ${JSON.stringify(e.details, null, 2)}`);
  }
  return lines.join("\n");
}

function setEnabled(el, enabled) {
  if (!el) return;
  el.disabled = !enabled;
  el.style.opacity = enabled ? "1" : ".55";
  el.style.pointerEvents = enabled ? "auto" : "none";
}

function setStatusBadge(status) {
  const pretty = STATUS_LABEL[status] ?? status ?? "—";
  badgeStatus.textContent = `Estado: ${pretty}`;
  badgeStatus.classList.remove("ok", "warn", "bad");

  if (!status) return;
  if (status === "DELIVERED") badgeStatus.classList.add("ok");
  else if (status === "REJECTED") badgeStatus.classList.add("bad");
  else badgeStatus.classList.add("warn");
}

function renderTimeline(status) {
  timeline.innerHTML = "";
  const idx = STATUS_STEPS.indexOf(status);
  for (let i = 0; i < STATUS_STEPS.length; i++) {
    const s = STATUS_STEPS[i];
    const div = document.createElement("div");
    div.className = "step";
    div.textContent = STATUS_LABEL[s] ?? s;
    if (i < idx) div.classList.add("done");
    if (i === idx) div.classList.add("active");
    timeline.appendChild(div);
  }
}

function titleCaseBrand(s) {
  const v = String(s ?? "").trim();
  if (!v) return v;
  return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
}

function renderHistory(order) {
  const h = Array.isArray(order?.history) ? order.history : [];
  if (!historyHost) return;

  if (h.length === 0) {
    historyHost.innerHTML = `<div class="muted small">Sin eventos todavía.</div>`;
    return;
  }

  const desc = [...h].reverse();
  historyHost.innerHTML = desc.map((ev) => {
    const when = new Date(ev.at).toLocaleString();
    const statusPretty = ev.status ? (STATUS_LABEL[ev.status] ?? ev.status) : "—";
    const actor = ev.actor ? ` · Actor: ${ev.actor}` : "";

    const meta = Object.entries(ev)
      .filter(([k]) => !["at","message","status","actor"].includes(k))
      .map(([k,v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
      .join("\n");

    return `
      <div class="event">
        <div class="top">
          <div>${ev.message ?? "Evento"}</div>
          <div class="muted">${when} · Estado: ${statusPretty}${actor}</div>
        </div>
        ${meta ? `<div class="meta">${meta}</div>` : ``}
      </div>
    `;
  }).join("");
}

function getAdvanceNext(status) {
  const nextMap = {
    AUTHORIZED: "IN_REPAIR",
    IN_REPAIR: "QA",
    QA: "READY_FOR_PICKUP",
    READY_FOR_PICKUP: "DELIVERED",
  };
  return nextMap[status] ?? null;
}

function guideFor(order) {
  const s = order?.status;

  if (!s) {
    return {
      next: null,
      hint: "Crea o carga una orden para ver la guía. Recomendación: Crear datos demo → Verificar → Crear orden.",
      checks: [],
    };
  }

  if (FINAL_STATES.has(s)) {
    return {
      next: null,
      hint: "Orden cerrada. Puedes revisar el historial (bitácora).",
      checks: [{ label: "Orden finalizada", ok: true }],
    };
  }

  if (s === "RECEIVED") {
    return {
      next: "AWAITING_AUTH",
      hint: "Paso requerido: registra el diagnóstico inicial para pasar a espera de autorización.",
      checks: [{ label: "Diagnóstico inicial registrado", ok: Boolean(order.initialDiagnosis) }],
    };
  }

  if (s === "AWAITING_AUTH") {
    return {
      next: "AUTHORIZED",
      hint: "Paso requerido: el cliente debe autorizar por escrito y abonar al menos el 50% del cotizado.",
      checks: [
        { label: "Autorización escrita", ok: Boolean(order.authorizationText) },
        { label: "Abono ≥ 50% (mínimo)", ok: Number(order.depositAmount) >= Number(order.minDeposit) },
      ],
    };
  }

  if (s === "AUTHORIZED") {
    const assigned = Boolean(order.assignedTechnicianId);
    return {
      next: "IN_REPAIR",
      hint: assigned
        ? "Técnico asignado ✅. Ahora, como usuario responsable del flujo, presiona el botón “Mover a: En reparación”. Luego continúa presionando “Mover a: …” en cada estación hasta finalizar."
        : "Paso requerido: asigna un técnico compatible con la marca (o usa Auto asignar). Después deberás presionar “Mover a: …” para avanzar estaciones.",
      checks: [{ label: "Técnico de reparación asignado", ok: assigned }],
    };
  }

  if (s === "IN_REPAIR") {
    return {
      next: "QA",
      hint: "Estás en reparación. Como usuario responsable del flujo, presiona “Mover a: Control de calidad” cuando el trabajo de reparación se considere completado.",
      checks: [],
    };
  }

  if (s === "QA") {
    return {
      next: "READY_FOR_PICKUP",
      hint: "Estás en control de calidad. Si el equipo pasa QA, presiona “Mover a: Listo para entrega”.",
      checks: [],
    };
  }

  if (s === "READY_FOR_PICKUP") {
    return {
      next: "DELIVERED",
      hint: "El equipo está listo. Cuando el cliente lo recoja, presiona “Mover a: Entregado” para cerrar la orden.",
      checks: [],
    };
  }

  // fallback
  return { next: null, hint: "Sigue el flujo indicado por el botón “Mover a: …”.", checks: [] };
}

function renderGuide(order) {
  const g = guideFor(order);
  const next = g.next;

  nextStationName.textContent = next ? (STATUS_LABEL[next] ?? next) : "—";
  nextStationHint.textContent = g.hint ?? "—";
  btnAdvance.textContent = next ? `Mover a: ${STATUS_LABEL[next] ?? next}` : "Mover a siguiente estación";

  stationChecklist.innerHTML = "";
  (g.checks ?? []).forEach((c) => {
    const li = document.createElement("li");
    const box = document.createElement("div");
    box.className = `check ${c.ok ? "ok" : "bad"}`;
    const text = document.createElement("div");
    text.innerHTML =
      `<div style="font-weight:800">${c.label}</div>` +
      (c.ok ? `<div class="muted small">Listo</div>` : `<div class="muted small">Pendiente</div>`);
    li.appendChild(box);
    li.appendChild(text);
    stationChecklist.appendChild(li);
  });

  const s = order?.status;
  const advNext = s ? getAdvanceNext(s) : null;
  if (advNext && ["AUTHORIZED","IN_REPAIR","QA","READY_FOR_PICKUP"].includes(s)) {
    btnAdvance.textContent = `Mover a: ${STATUS_LABEL[advNext] ?? advNext}`;
  } else {
    btnAdvance.textContent = "Mover a siguiente estación";
  }
}

function applyLocks(order) {
  const s = order?.status;
  if (!s) return;

  setEnabled(document.querySelector("#formDiag button[type='submit']"), s === "RECEIVED");
  setEnabled(document.querySelector("#formPart button[type='submit']"), s === "AWAITING_AUTH");
  setEnabled(document.querySelector("#formAuth button[type='submit']"), s === "AWAITING_AUTH");
  setEnabled(btnFillMinDeposit, s === "AWAITING_AUTH");

  setEnabled(document.querySelector("#formAssign button[type='submit']"), s === "AUTHORIZED");
  setEnabled(btnAutoAssign, s === "AUTHORIZED");

  setEnabled(btnAdvance, ["AUTHORIZED","IN_REPAIR","QA","READY_FOR_PICKUP"].includes(s));
}

function prettyOrder(order) {
  return {
    ...order,
    status: STATUS_LABEL[order.status] ?? order.status,
    statusCode: order.status,
    phone: {
      ...order.phone,
      brand: titleCaseBrand(order.phone?.brand),
    },
  };
}

function fillSelect(id, items, labelFn, placeholderText) {
  const sel = $(id);
  const current = sel.value;

  sel.innerHTML = `<option value="">${placeholderText}</option>`;
  for (const it of items) {
    const opt = document.createElement("option");
    opt.value = it.id;
    opt.textContent = labelFn(it);
    sel.appendChild(opt);
  }

  if (current && items.some((i) => i.id === current)) sel.value = current;
}

function techIsCompatible(tech, brandUpper) {
  const b = String(brandUpper ?? "").trim().toUpperCase();
  const skills = (tech.skills ?? []).map((s) => String(s).trim().toUpperCase());
  return skills.includes(b);
}

function refreshAssignSelectForOrder(order) {
  const sel = $("assignTechId");

  if (!order?.phone?.brand) {
    sel.innerHTML = `<option value="">Primero crea una orden (y autoriza)</option>`;
    return;
  }

  const brandUpper = String(order.phone.brand).trim().toUpperCase();
  const compatibles = catalogs.technicians.filter((t) => techIsCompatible(t, brandUpper));

  if (compatibles.length === 0) {
    sel.innerHTML = `<option value="">No hay técnicos compatibles con ${titleCaseBrand(brandUpper)}</option>`;
    return;
  }

  sel.innerHTML = `<option value="">Selecciona técnico compatible con ${titleCaseBrand(brandUpper)}</option>`;
  for (const t of compatibles) {
    const opt = document.createElement("option");
    opt.value = t.id;
    const jobs = Number.isFinite(t.activeJobs) ? t.activeJobs : 0;
    const skillsPretty = (t.skills ?? []).map(titleCaseBrand).join(", ");
    opt.textContent = `${t.name} (${skillsPretty}) · Carga: ${jobs}`;
    sel.appendChild(opt);
  }
}

async function loadCatalogsAndFillSelects() {
  const [branches, techs, parts] = await Promise.all([
    api.listBranches().catch(() => []),
    api.listTechnicians().catch(() => []),
    api.listParts().catch(() => []),
  ]);

  catalogs = { branches, technicians: techs, parts };

  fillSelect("branchId", branches, (b) => `${b.name}`, "Selecciona una sucursal (usa Seed)");
  fillSelect("diagTechId", techs, (t) => {
    const skillsPretty = (t.skills ?? []).map(titleCaseBrand).join(", ");
    return `${t.name} (${skillsPretty})`;
  }, "Selecciona un técnico (usa Seed)");

  fillSelect("partId", parts, (p) => {
    return `${p.name} ($${p.unitCost})`;
  }, "Selecciona un repuesto (usa Seed)");

  refreshAssignSelectForOrder(currentRepair);
}

function setSeedChips(payload) {
  chipsSeed.innerHTML = "";
  const add = (text) => {
    const d = document.createElement("div");
    d.className = "chip";
    d.textContent = text;
    chipsSeed.appendChild(d);
  };

  const bCount = payload?.branches?.length ?? 0;
  const tCount = payload?.technicians?.length ?? 0;
  const pCount = payload?.parts?.length ?? 0;

  add(`Sucursales: ${bCount}`);
  add(`Técnicos: ${tCount}`);
  add(`Repuestos: ${pCount}`);
}

function updateCoachText(order) {
  if (!coachText) return;

  if (!order?.status) {
    coachText.textContent = "Sugerencia: inicia con “Crear datos demo”, luego verifica Imei/Serial y crea una orden.";
    return;
  }

  const g = guideFor(order);
  const s = STATUS_LABEL[order.status] ?? order.status;
  const next = g.next ? (STATUS_LABEL[g.next] ?? g.next) : "—";
  coachText.textContent = `Estado actual: ${s}. Siguiente estación sugerida: ${next}. ${g.hint ?? ""}`;
}

function maybeShowOnboarding() {
  if (localStorage.getItem("rep_onboard_hide") === "1") return;
  onboarding.showModal();
}

/* ====== Service Worker bootstrap ====== */
async function registerSW() {
  if (!("serviceWorker" in navigator)) {
    pillApi.textContent = "Api: No compatible";
    toast("Service Worker no soportado.", "bad");
    return;
  }
  await navigator.serviceWorker.register("./sw.js", { scope: "./" });
  await navigator.serviceWorker.ready;
  await new Promise((r) => setTimeout(r, 150));
}

async function boot() {
  await registerSW();

  try {
    await api.health();
    pillApi.textContent = "Api: Activa";
    pillApi.style.borderColor = "rgba(39,192,125,.6)";
    toast("Api disponible ✅", "ok");

    await loadCatalogsAndFillSelects();
    maybeShowOnboarding();
    updateCoachText(null);
  } catch (e) {
    pillApi.textContent = "Api: Off";
    pillApi.style.borderColor = "rgba(255,77,77,.6)";
    print(orderOut, formatError(e));
    toast("Api Off. Abre con Live Server (localhost) y recarga.", "bad");
  }
}

async function refreshOrder() {
  const id = $("repairId").value.trim();
  if (!id) return toast("No hay Repair Id.", "warn");

  try {
    const data = await api.getRepair(id);
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    renderGuide(data);
    applyLocks(data);
    renderHistory(data);
    updateCoachText(data);

    $("deposit").value = Number(data.minDeposit ?? 0).toFixed(2);
    print(orderOut, prettyOrder(data));

    await loadCatalogsAndFillSelects();
    toast("Orden actualizada.", "ok");
  } catch (e) {
    print(orderOut, formatError(e));
    toast("No se pudo refrescar.", "bad");
  }
}

/* ====== Eventos ====== */
$("btnSeed").addEventListener("click", async () => {
  try {
    const data = await api.seed();
    setSeedChips(data);
    print(seedOut, data);

    await loadCatalogsAndFillSelects();
    toast("Datos demo creados.", "ok");
  } catch (e) {
    print(seedOut, formatError(e));
    toast("No se pudo crear seed.", "bad");
  }
});

$("btnReset").addEventListener("click", async () => {
  try {
    const data = await api.reset();
    print(seedOut, data);

    currentRepair = null;
    $("repairId").value = "";
    setStatusBadge(null);
    timeline.innerHTML = "";
    historyHost.innerHTML = "";
    nextStationName.textContent = "—";
    nextStationHint.textContent = "—";
    stationChecklist.innerHTML = "";
    chipsSeed.innerHTML = "";

    await loadCatalogsAndFillSelects();
    updateCoachText(null);

    toast("Db reiniciada.", "ok");
  } catch (e) {
    print(seedOut, formatError(e));
    toast("No se pudo resetear.", "bad");
  }
});

$("formCheck").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const imei = $("imei").value.trim();
    const serial = $("serial").value.trim();
    const data = await api.checkReported(imei, serial);

    print(checkOut, data);
    toast(data.reported ? "Equipo reportado ❌" : "Equipo no reportado ✅", data.reported ? "bad" : "ok");
  } catch (e) {
    print(checkOut, formatError(e));
    toast("Error al verificar.", "bad");
  }
});

$("formCreate").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const imei = $("imei").value.trim();
    const serial = $("serial").value.trim();

    const check = await api.checkReported(imei, serial);
    if (check.reported) {
      print(createOut, { error: "Equipo reportado: no accede al servicio", imei, serial });
      toast("No se puede crear: equipo reportado.", "bad");
      return;
    }

    const payload = {
      branchId: $("branchId").value,
      customerName: $("customerName").value.trim(),
      laborCostEstimate: Number($("labor").value),
      phone: {
        imei,
        serial,
        brand: $("brand").value.trim(),
        model: $("model").value.trim(),
      },
    };

    const order = await api.createRepair(payload);
    currentRepair = order;

    $("repairId").value = order.id;

    setStatusBadge(order.status);
    renderTimeline(order.status);
    renderGuide(order);
    applyLocks(order);
    renderHistory(order);
    updateCoachText(order);

    $("deposit").value = Number(order.minDeposit ?? 0).toFixed(2);
    print(createOut, prettyOrder(order));
    print(orderOut, prettyOrder(order));

    await loadCatalogsAndFillSelects();
    toast("Orden creada ✅", "ok");
  } catch (e) {
    print(createOut, formatError(e));
    toast("No se pudo crear la orden.", "bad");
  }
});

$("btnRefresh").addEventListener("click", refreshOrder);

$("btnAdvance").addEventListener("click", async () => {
  try {
    const id = $("repairId").value.trim();
    const data = await api.advance(id);
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    renderGuide(data);
    applyLocks(data);
    renderHistory(data);
    updateCoachText(data);

    print(orderOut, prettyOrder(data));
    toast(`Avance: ${STATUS_LABEL[data.status] ?? data.status}`, "ok");
  } catch (e) {
    print(orderOut, formatError(e));
    toast("No se pudo avanzar.", "bad");
  }
});

$("formDiag").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const id = $("repairId").value.trim();
    const payload = {
      technicianId: $("diagTechId").value,
      diagnosis: $("diagnosis").value.trim(),
    };

    const data = await api.initialDiagnosis(id, payload);
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    renderGuide(data);
    applyLocks(data);
    renderHistory(data);
    updateCoachText(data);

    $("deposit").value = Number(data.minDeposit ?? 0).toFixed(2);
    print(orderOut, prettyOrder(data));

    await loadCatalogsAndFillSelects();
    toast("Diagnóstico guardado.", "ok");
  } catch (e) {
    print(orderOut, formatError(e));
    toast("No se pudo guardar diagnóstico.", "bad");
  }
});

$("formPart").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const id = $("repairId").value.trim();
    const payload = {
      partId: $("partId").value,
      qty: Number($("qty").value),
    };

    const data = await api.addPart(id, payload);
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    renderGuide(data);
    applyLocks(data);
    renderHistory(data);
    updateCoachText(data);

    $("deposit").value = Number(data.minDeposit ?? 0).toFixed(2);
    print(orderOut, prettyOrder(data));

    toast("Repuesto agregado.", "ok");
  } catch (e) {
    print(orderOut, formatError(e));
    toast("No se pudo agregar repuesto.", "bad");
  }
});

$("btnFillMinDeposit").addEventListener("click", () => {
  const min = currentRepair?.minDeposit ?? 0;
  $("deposit").value = Number(min).toFixed(2);
  toast("Abono mínimo aplicado.", "ok");
});

$("formAuth").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const id = $("repairId").value.trim();
    const payload = {
      authorizationText: $("authText").value.trim(),
      depositAmount: Number($("deposit").value),
    };

    const data = await api.authorize(id, payload);
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    renderGuide(data);
    applyLocks(data);
    renderHistory(data);
    updateCoachText(data);

    print(orderOut, prettyOrder(data));

    await loadCatalogsAndFillSelects();
    toast("Autorización registrada. Ahora asigna técnico o usa Auto asignar.", "ok");
  } catch (e) {
    print(orderOut, formatError(e));
    toast("No se pudo autorizar.", "bad");
  }
});

$("formAssign").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const id = $("repairId").value.trim();
    const techId = $("assignTechId").value;
    if (!techId) {
      toast("Selecciona un técnico compatible (o usa Auto asignar).", "warn");
      return;
    }

    const data = await api.assignTechnician(id, { technicianId: techId });
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    renderGuide(data);
    applyLocks(data);
    renderHistory(data);
    updateCoachText(data);

    print(orderOut, prettyOrder(data));
    await loadCatalogsAndFillSelects();

    toast("Técnico asignado. Luego puedes pasar a En reparación.", "ok");
  } catch (e) {
    print(orderOut, formatError(e));
    toast("No se pudo asignar técnico.", "bad");
  }
});

btnAutoAssign.addEventListener("click", async () => {
  try {
    const id = $("repairId").value.trim();
    const data = await api.autoAssign(id);
    currentRepair = data;

    setStatusBadge(data.status);
    renderTimeline(data.status);
    renderGuide(data);
    applyLocks(data);
    renderHistory(data);
    updateCoachText(data);

    print(orderOut, prettyOrder(data));
    await loadCatalogsAndFillSelects();

    toast("Auto asignación realizada (según marca y carga).", "ok");
  } catch (e) {
    print(orderOut, formatError(e));
    toast("No se pudo auto asignar.", "bad");
  }
});

/* Inicio */
(() => {
  if (localStorage.getItem("rep_onboard_hide") !== "1") onboarding.showModal();
  boot();
})();