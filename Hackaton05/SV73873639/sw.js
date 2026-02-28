/**
 * sw.js — API REST simulada (sin Node)
 * Endpoints:
 *  - GET  /api/health
 *  - POST /api/reset
 *  - POST /api/seed
 *  - GET  /api/branches
 *  - GET  /api/technicians
 *  - GET  /api/parts
 *  - GET  /api/devices/reported?imei=...&serial=...
 *  - POST /api/repairs
 *  - GET  /api/repairs/:id
 *  - POST /api/repairs/:id/initial-diagnosis
 *  - POST /api/repairs/:id/parts
 *  - POST /api/repairs/:id/authorize
 *  - POST /api/repairs/:id/assign-technician
 *  - POST /api/repairs/:id/auto-assign
 *  - POST /api/repairs/:id/advance
 */

const DB_CACHE = "repair-db-v6";
const DB_KEY = "/__db__/state.json";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const clean = (v) => v?.toString?.().trim?.() ?? "";
const upper = (v) => clean(v).toUpperCase();
const uuid = () => (self.crypto?.randomUUID ? self.crypto.randomUUID() : `id-${Math.random().toString(16).slice(2)}-${Date.now()}`);

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });

class DomainError extends Error {
  constructor(message, code = "DOMAIN_ERROR", details = undefined) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.details = details;
  }
}
const assert = (cond, msg, code = "ASSERTION_FAILED", details) => {
  if (!cond) throw new DomainError(msg, code, details);
};

const RepairStatus = Object.freeze({
  RECEIVED: "RECEIVED",
  INITIAL_REVIEW_DONE: "INITIAL_REVIEW_DONE",
  AWAITING_AUTH: "AWAITING_AUTH",
  AUTHORIZED: "AUTHORIZED",
  IN_REPAIR: "IN_REPAIR",
  QA: "QA",
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  DELIVERED: "DELIVERED",
  REJECTED: "REJECTED",
});

const NextAfterAdvance = Object.freeze({
  AUTHORIZED: "IN_REPAIR",
  IN_REPAIR: "QA",
  QA: "READY_FOR_PICKUP",
  READY_FOR_PICKUP: "DELIVERED",
});

class Phone {
  constructor({ imei, serial, brand, model }) {
    const imeiC = clean(imei);
    const serialC = clean(serial);

    assert(imeiC.length > 0, "Imei requerido", "BAD_REQUEST");
    assert(serialC.length > 0, "Serial requerido", "BAD_REQUEST");
    assert(imeiC.length >= 8, "Imei demasiado corto (mín. 8)", "BAD_REQUEST");
    assert(serialC.length >= 4, "Serial demasiado corto (mín. 4)", "BAD_REQUEST");

    this.imei = imeiC;
    this.serial = serialC;
    this.brand = upper(brand || "UNKNOWN");
    this.model = clean(model || "UNKNOWN");
  }
}

class Technician {
  constructor({ id, name, skills = [], activeJobs = 0 }) {
    assert(clean(name).length > 0, "Nombre de técnico requerido", "BAD_REQUEST");
    this.id = id ?? uuid();
    this.name = clean(name);
    this.skills = [...new Set(skills.map((s) => upper(s)))];
    this.activeJobs = Number.isFinite(activeJobs) ? activeJobs : 0;
  }
  canHandle(brandUpper) { return this.skills.includes(upper(brandUpper)); }
}

class SparePart {
  constructor({ id, name, unitCost, compatibleBrands = [] }) {
    assert(clean(name).length > 0, "Nombre de repuesto requerido", "BAD_REQUEST");
    assert(Number.isFinite(unitCost) && unitCost >= 0, "Costo unitario inválido", "BAD_REQUEST");
    this.id = id ?? uuid();
    this.name = clean(name);
    this.unitCost = unitCost;
    this.compatibleBrands = [...new Set(compatibleBrands.map((b) => upper(b)))];
  }
  isCompatible(brandUpper) {
    if (this.compatibleBrands.length === 0) return true;
    return this.compatibleBrands.includes(upper(brandUpper));
  }
}

class Branch {
  constructor({ id, name }) {
    assert(clean(name).length > 0, "Nombre de sucursal requerido", "BAD_REQUEST");
    this.id = id ?? uuid();
    this.name = clean(name);
  }
}

class RepairOrder {
  constructor(data) {
    const {
      id, branchId, phone, customerName, laborCostEstimate,
      status, history, parts, initialDiagnosis, authorizationText,
      depositAmount, initialTechnicianId, assignedTechnicianId
    } = data ?? {};

    assert(clean(branchId).length > 0, "Sucursal requerida", "BAD_REQUEST");
    assert(clean(customerName).length > 0, "Cliente requerido", "BAD_REQUEST");
    assert(Number.isFinite(laborCostEstimate) && laborCostEstimate >= 0, "Mano de obra inválida", "BAD_REQUEST");

    this.id = id ?? uuid();
    this.branchId = branchId;

    this.phone = phone instanceof Phone ? phone : new Phone(phone);
    this.customerName = clean(customerName);
    this.laborCostEstimate = laborCostEstimate;

    this.status = status ?? RepairStatus.RECEIVED;
    this.history = history ?? [{
      at: new Date().toISOString(),
      message: "Recepción de equipo",
      status: this.status,
      actor: "Sistema",
    }];

    this.parts = parts ?? [];
    this.initialDiagnosis = initialDiagnosis ?? null;

    this.authorizationText = authorizationText ?? null;
    this.depositAmount = depositAmount ?? 0;

    this.initialTechnicianId = initialTechnicianId ?? null;
    this.assignedTechnicianId = assignedTechnicianId ?? null;
  }

  push(message, meta = {}) {
    this.history.push({ at: new Date().toISOString(), message, ...meta });
  }

  get quotedPartsTotal() { return this.parts.reduce((acc, p) => acc + p.unitCost * p.qty, 0); }
  get quotedTotal() { return this.laborCostEstimate + this.quotedPartsTotal; }
  get minDeposit() { return 0.5 * this.quotedTotal; }

  requireStatus(allowed) {
    assert(allowed.includes(this.status), `Operación no permitida en estado ${this.status}`, "INVALID_STATE", {
      current: this.status,
      allowed,
    });
  }

  recordInitialDiagnosis({ diagnosis, technicianId }) {
    this.requireStatus([RepairStatus.RECEIVED]);
    assert(clean(diagnosis).length > 0, "Diagnóstico requerido", "BAD_REQUEST");
    assert(clean(technicianId).length > 0, "Técnico requerido", "BAD_REQUEST");

    this.initialDiagnosis = clean(diagnosis);
    this.initialTechnicianId = technicianId;

    this.push("Diagnóstico inicial registrado", { status: this.status, actor: "Técnico", technicianId });

    this.status = RepairStatus.INITIAL_REVIEW_DONE;
    this.push("Revisión inicial completada", { status: this.status, actor: "Sistema" });

    this.status = RepairStatus.AWAITING_AUTH;
    this.push("En espera de autorización", { status: this.status, actor: "Sistema" });
  }

  addPart({ part, qty }) {
    this.requireStatus([RepairStatus.AWAITING_AUTH]);

    assert(part instanceof SparePart, "Repuesto inválido", "BAD_REQUEST");
    assert(Number.isInteger(qty) && qty > 0, "Cantidad inválida", "BAD_REQUEST");
    assert(part.isCompatible(this.phone.brand), "Repuesto no compatible con la marca", "INCOMPATIBLE_PART", {
      brand: this.phone.brand,
      partId: part.id,
    });

    const idx = this.parts.findIndex((p) => p.id === part.id);
    if (idx >= 0) this.parts[idx].qty += qty;
    else this.parts.push({ id: part.id, name: part.name, unitCost: part.unitCost, qty });

    this.push("Repuesto agregado/actualizado", { status: this.status, actor: "Técnico", partId: part.id, qty });
  }

  authorizeAndDeposit({ authorizationText, depositAmount }) {
    this.requireStatus([RepairStatus.AWAITING_AUTH]);

    assert(clean(authorizationText).length > 0, "Autorización escrita requerida", "BAD_REQUEST");
    assert(Number.isFinite(depositAmount) && depositAmount >= 0, "Abono inválido", "BAD_REQUEST");

    assert(depositAmount >= this.minDeposit, "Abono insuficiente (mínimo 50% del cotizado)", "INSUFFICIENT_DEPOSIT", {
      quotedTotal: this.quotedTotal,
      minDeposit: this.minDeposit,
      received: depositAmount,
    });

    this.authorizationText = clean(authorizationText);
    this.depositAmount = depositAmount;

    this.push("Autorización y abono registrados", {
      status: this.status,
      actor: "Cliente",
      depositAmount,
      quotedTotal: this.quotedTotal,
    });

    this.status = RepairStatus.AUTHORIZED;
    this.push("Orden autorizada", { status: this.status, actor: "Sistema" });
  }

  assignTechnician({ technician }) {
    this.requireStatus([RepairStatus.AUTHORIZED]);

    assert(technician instanceof Technician, "Técnico inválido", "BAD_REQUEST");
    assert(technician.canHandle(this.phone.brand), "Técnico sin skill compatible", "TECHNICIAN_SKILL_MISMATCH", {
      brand: this.phone.brand,
      technicianId: technician.id,
    });

    this.assignedTechnicianId = technician.id;
    this.push("Técnico de reparación asignado", { status: this.status, actor: "Sistema", technicianId: technician.id });
  }

  advance() {
    this.requireStatus(["AUTHORIZED", "IN_REPAIR", "QA", "READY_FOR_PICKUP"]);

    if (this.status === "AUTHORIZED") {
      assert(!!this.assignedTechnicianId, "Debe asignarse un técnico antes de pasar a reparación", "TECHNICIAN_REQUIRED", {
        required: "assignedTechnicianId",
      });
    }

    const next = NextAfterAdvance[this.status];
    assert(next, `No existe siguiente estado desde ${this.status}`, "NO_NEXT_STATE", { current: this.status });

    this.status = next;
    this.push("Avance de estación", { status: this.status, actor: "Sistema" });
  }

  toJSON() {
    return {
      id: this.id,
      branchId: this.branchId,
      customerName: this.customerName,
      phone: this.phone,
      laborCostEstimate: this.laborCostEstimate,
      parts: this.parts,
      quotedTotal: this.quotedTotal,
      minDeposit: this.minDeposit,
      initialDiagnosis: this.initialDiagnosis,
      authorizationText: this.authorizationText,
      depositAmount: this.depositAmount,
      initialTechnicianId: this.initialTechnicianId,
      assignedTechnicianId: this.assignedTechnicianId,
      status: this.status,
      history: this.history,
    };
  }
}

function defaultState() {
  return {
    version: 6,
    reported: {
      imeis: ["356789012345678", "111111111111111"],
      serials: ["SN-LOST-0001"],
    },
    branches: [],
    technicians: [],
    parts: [],
    repairs: [],
  };
}

async function loadState() {
  const cache = await caches.open(DB_CACHE);
  const res = await cache.match(DB_KEY);
  if (!res) return defaultState();
  const st = await res.json().catch(() => defaultState());
  return st?.version ? st : defaultState();
}

async function saveState(state) {
  const cache = await caches.open(DB_CACHE);
  await cache.put(DB_KEY, json(state));
  return state;
}

function pickBestTechnician(techs, brandUpper) {
  const b = upper(brandUpper);
  const compatibles = techs.filter((t) => (t.skills ?? []).includes(b));
  if (compatibles.length === 0) return null;

  compatibles.sort((a, b2) => {
    const wa = Number.isFinite(a.activeJobs) ? a.activeJobs : 0;
    const wb = Number.isFinite(b2.activeJobs) ? b2.activeJobs : 0;
    if (wa !== wb) return wa - wb;
    return String(a.name).localeCompare(String(b2.name));
  });

  return compatibles[0];
}

function incJobs(state, techId, delta) {
  const i = state.technicians.findIndex((t) => t.id === techId);
  if (i < 0) return;
  const cur = Number(state.technicians[i].activeJobs) || 0;
  state.technicians[i].activeJobs = Math.max(0, cur + delta);
}

/* ===== SW lifecycle ===== */
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    self.skipWaiting();
    await saveState(await loadState());
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) event.respondWith(handleApi(event.request));
});

async function handleApi(req) {
  try {
    await delay(120 + Math.floor(Math.random() * 220));

    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === "GET" && path === "/api/health") return json({ ok: true });

    if (req.method === "POST" && path === "/api/reset") {
      await saveState(defaultState());
      return json({ ok: true, message: "Db reiniciada" });
    }

    if (req.method === "GET" && path === "/api/branches") {
      const st = await loadState();
      return json(st.branches);
    }

    if (req.method === "GET" && path === "/api/technicians") {
      const st = await loadState();
      return json(st.technicians);
    }

    if (req.method === "GET" && path === "/api/parts") {
      const st = await loadState();
      return json(st.parts);
    }

    if (req.method === "GET" && path === "/api/devices/reported") {
      const imei = clean(url.searchParams.get("imei"));
      const serial = clean(url.searchParams.get("serial"));
      if (!imei || !serial) return json({ error: "imei y serial son requeridos", code: "BAD_REQUEST" }, 400);

      const st = await loadState();
      const reported = st.reported.imeis.includes(imei) || st.reported.serials.includes(serial);
      return json({ imei, serial, reported });
    }

    if (req.method === "POST" && path === "/api/seed") {
      const st = await loadState();

      st.branches = [
        new Branch({ name: "Sucursal Centro" }),
        new Branch({ name: "Sucursal Norte" }),
        new Branch({ name: "Sucursal Sur" }),
      ];

      st.technicians = [
        new Technician({ name: "Téc. Ana",   skills: ["Samsung", "Xiaomi", "Oppo"], activeJobs: 0 }),
        new Technician({ name: "Téc. Luis",  skills: ["Apple", "OnePlus"],          activeJobs: 0 }),
        new Technician({ name: "Téc. Marta", skills: ["Huawei", "Honor"],           activeJobs: 0 }),
        new Technician({ name: "Téc. Diego", skills: ["Oppo", "Realme", "Vivo"],    activeJobs: 0 }),
        new Technician({ name: "Téc. Carla", skills: ["Motorola", "Samsung", "Honor"], activeJobs: 0 }),
        new Technician({ name: "Téc. Pablo", skills: ["Xiaomi", "Samsung"],         activeJobs: 0 }),
      ];

      st.parts = [
        new SparePart({ name: "Batería (Genérica)", unitCost: 30, compatibleBrands: [] }),
        new SparePart({ name: "Módulo de Pantalla", unitCost: 95, compatibleBrands: ["Apple", "Samsung", "Xiaomi"] }),
        new SparePart({ name: "Conector de carga", unitCost: 18, compatibleBrands: [] }),
        new SparePart({ name: "Cámara trasera", unitCost: 45, compatibleBrands: ["Oppo", "Huawei", "Honor"] }),
      ];

      st.repairs = [];
      await saveState(st);

      return json({ branches: st.branches, technicians: st.technicians, parts: st.parts });
    }

    if (req.method === "POST" && path === "/api/repairs") {
      const body = await req.json().catch(() => ({}));
      const st = await loadState();

      const branchId = clean(body.branchId);
      assert(st.branches.some((b) => b.id === branchId), "Sucursal inexistente", "BRANCH_NOT_FOUND", { branchId });

      const phone = new Phone(body.phone ?? {});
      const isReported = st.reported.imeis.includes(phone.imei) || st.reported.serials.includes(phone.serial);
      assert(!isReported, "Equipo reportado: no accede al servicio", "DEVICE_REPORTED", { imei: phone.imei, serial: phone.serial });

      const labor = Number(body.laborCostEstimate);
      const order = new RepairOrder({
        branchId,
        phone,
        customerName: body.customerName,
        laborCostEstimate: labor,
      });

      st.repairs.push(order.toJSON());
      await saveState(st);
      return json(order.toJSON(), 201);
    }

    if (req.method === "GET" && /^\/api\/repairs\/[^/]+$/.test(path)) {
      const id = path.split("/").pop();
      const st = await loadState();
      const found = st.repairs.find((r) => r.id === id);
      if (!found) return json({ error: "Orden no encontrada", code: "NOT_FOUND" }, 404);
      return json(found);
    }

    const match = path.match(/^\/api\/repairs\/([^/]+)\/(.+)$/);
    if (match) {
      const [, id, action] = match;
      const st = await loadState();

      const idx = st.repairs.findIndex((r) => r.id === id);
      if (idx < 0) return json({ error: "Orden no encontrada", code: "NOT_FOUND" }, 404);

      const order = new RepairOrder(st.repairs[idx]);

      if (req.method === "POST" && action === "initial-diagnosis") {
        const body = await req.json().catch(() => ({}));
        const techId = clean(body.technicianId);
        assert(st.technicians.some((t) => t.id === techId), "Técnico inexistente", "TECH_NOT_FOUND", { techId });

        order.recordInitialDiagnosis({ diagnosis: body.diagnosis, technicianId: techId });
        st.repairs[idx] = order.toJSON();
        await saveState(st);
        return json(st.repairs[idx]);
      }

      if (req.method === "POST" && action === "parts") {
        const body = await req.json().catch(() => ({}));
        const partId = clean(body.partId);
        const qty = Number(body.qty);

        const partRaw = st.parts.find((p) => p.id === partId);
        assert(partRaw, "Repuesto inexistente", "PART_NOT_FOUND", { partId });
        assert(Number.isInteger(qty) && qty > 0, "Cantidad inválida", "BAD_REQUEST");

        const part = new SparePart(partRaw);
        order.addPart({ part, qty });

        st.repairs[idx] = order.toJSON();
        await saveState(st);
        return json(st.repairs[idx]);
      }

      if (req.method === "POST" && action === "authorize") {
        const body = await req.json().catch(() => ({}));
        order.authorizeAndDeposit({
          authorizationText: body.authorizationText,
          depositAmount: Number(body.depositAmount),
        });

        st.repairs[idx] = order.toJSON();
        await saveState(st);
        return json(st.repairs[idx]);
      }

      if (req.method === "POST" && action === "assign-technician") {
        const body = await req.json().catch(() => ({}));
        const techId = clean(body.technicianId);

        const techRaw = st.technicians.find((t) => t.id === techId);
        assert(techRaw, "Técnico inexistente", "TECH_NOT_FOUND", { techId });

        const tech = new Technician(techRaw);
        order.assignTechnician({ technician: tech });

        incJobs(st, techId, +1);
        order.push("Carga de trabajo incrementada", { status: order.status, actor: "Sistema", technicianId: techId });

        st.repairs[idx] = order.toJSON();
        await saveState(st);
        return json(st.repairs[idx]);
      }

      if (req.method === "POST" && action === "auto-assign") {
        order.requireStatus([RepairStatus.AUTHORIZED]);

        const best = pickBestTechnician(st.technicians, order.phone.brand);
        assert(best, "No hay técnicos para esa marca", "NO_TECH_FOR_BRAND", { brand: order.phone.brand });

        const tech = new Technician(best);
        order.assignTechnician({ technician: tech });

        incJobs(st, best.id, +1);
        order.push("Auto asignación de técnico", { status: order.status, actor: "Sistema", technicianId: best.id, brand: order.phone.brand });

        st.repairs[idx] = order.toJSON();
        await saveState(st);
        return json(st.repairs[idx]);
      }

      if (req.method === "POST" && action === "advance") {
        const before = order.status;
        const techId = order.assignedTechnicianId;

        order.advance();

        // Si se entregó, libera carga del técnico (simulación)
        if (order.status === RepairStatus.DELIVERED && techId) {
          incJobs(st, techId, -1);
          order.push("Caso cerrado: carga de trabajo liberada", { status: order.status, actor: "Sistema", technicianId: techId });
        }

        order.push("Transición registrada", { status: order.status, actor: "Sistema", from: before, to: order.status });

        st.repairs[idx] = order.toJSON();
        await saveState(st);
        return json(st.repairs[idx]);
      }

      return json({ error: "Acción no soportada", code: "NOT_FOUND" }, 404);
    }

    return json({ error: "Endpoint no soportado", code: "NOT_FOUND" }, 404);
  } catch (e) {
    if (e instanceof DomainError) return json({ error: e.message, code: e.code, details: e.details }, 400);
    return json({ error: "Error interno", code: "ERROR", details: String(e?.message ?? e) }, 500);
  }
}