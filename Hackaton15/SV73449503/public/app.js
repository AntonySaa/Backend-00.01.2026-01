const state = {
  user: null,
  trackingCode: '',
  package: null,
};

const socket = io();

const els = {
  statusBanner: document.getElementById('statusBanner'),
  loginForm: document.getElementById('loginForm'),
  createForm: document.getElementById('createForm'),
  trackForm: document.getElementById('trackForm'),
  messageForm: document.getElementById('messageForm'),
  locationForm: document.getElementById('locationForm'),
  receiveBtn: document.getElementById('receiveBtn'),
  loginResult: document.getElementById('loginResult'),
  trackingInput: document.getElementById('trackingInput'),
  packageMeta: document.getElementById('packageMeta'),
  timelineList: document.getElementById('timelineList'),
  messagesList: document.getElementById('messagesList'),
  locationsList: document.getElementById('locationsList'),
};

function notify(message, isError = false) {
  els.statusBanner.textContent = message;
  els.statusBanner.style.borderLeftColor = isError ? '#c81d25' : '#0f8b8d';
  els.statusBanner.style.background = isError ? 'rgba(200, 29, 37, 0.12)' : 'rgba(15, 139, 141, 0.12)';
  els.statusBanner.style.color = isError ? '#730d12' : '#0d5859';
}

function clearLists() {
  els.timelineList.innerHTML = '';
  els.messagesList.innerHTML = '';
  els.locationsList.innerHTML = '';
}

function makeItem(text) {
  const li = document.createElement('li');
  li.textContent = text;
  return li;
}

function formatDate(isoLike) {
  if (!isoLike) return 'N/A';
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return isoLike;
  return date.toLocaleString();
}

function renderPackage(pkg) {
  state.package = pkg;

  if (!pkg) {
    els.packageMeta.textContent = 'Sin paquete cargado.';
    clearLists();
    return;
  }

  els.packageMeta.innerHTML = [
    `<strong>Tracking:</strong> ${pkg.tracking_code}`,
    `<strong>Estado:</strong> ${pkg.status}`,
    `<strong>Remitente:</strong> ${pkg.sender}`,
    `<strong>Destinatario:</strong> ${pkg.recipient}`,
    `<strong>Destino:</strong> ${pkg.destination_address}`,
    `<strong>Creado por:</strong> ${pkg.created_by}`,
    `<strong>Recibido:</strong> ${pkg.received_at ? formatDate(pkg.received_at) : 'Pendiente'}`,
  ].join('<br>');

  clearLists();

  pkg.timeline.forEach((event) => {
    const line = `${formatDate(event.event_time)} | ${event.event_type} | ${event.actor}: ${event.detail}`;
    els.timelineList.appendChild(makeItem(line));
  });

  pkg.messages.forEach((message) => {
    const line = `${formatDate(message.created_at)} | ${message.username}: ${message.message}`;
    els.messagesList.appendChild(makeItem(line));
  });

  pkg.locations.forEach((location) => {
    const line = `${formatDate(location.created_at)} | ${location.username} -> (${location.latitude}, ${location.longitude}) ${location.address || ''} ${location.note || ''}`;
    els.locationsList.appendChild(makeItem(line));
  });
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Error de servidor');
  }
  return data;
}

async function loadPackage(trackingCode) {
  const data = await api(`/api/packages/${trackingCode}`);
  renderPackage(data.package);
  state.trackingCode = trackingCode;
  socket.emit('join_package', { trackingCode });
  notify(`Suscrito a ${trackingCode}. Esperando eventos en tiempo real.`);
}

els.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(els.loginForm);
  const username = String(formData.get('username') || '').trim();

  if (!username) return;

  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
    state.user = data.user;
    els.loginResult.textContent = `Sesion activa: ${data.user.username} (id ${data.user.id})`;
    notify(`Login correcto: ${data.user.username}`);
  } catch (error) {
    notify(error.message, true);
  }
});

els.createForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state.user) {
    notify('Debes iniciar sesion primero.', true);
    return;
  }

  const formData = new FormData(els.createForm);
  const payload = {
    sender: String(formData.get('sender') || '').trim(),
    recipient: String(formData.get('recipient') || '').trim(),
    destinationAddress: String(formData.get('destinationAddress') || '').trim(),
    userId: state.user.id,
  };

  try {
    const data = await api('/api/packages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const trackingCode = data.package.tracking_code;
    els.trackingInput.value = trackingCode;
    await loadPackage(trackingCode);
    notify(`Paquete creado: ${trackingCode}`);
    els.createForm.reset();
  } catch (error) {
    notify(error.message, true);
  }
});

els.trackForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const trackingCode = String(new FormData(els.trackForm).get('trackingCode') || '').trim();
  if (!trackingCode) return;

  try {
    await loadPackage(trackingCode);
  } catch (error) {
    notify(error.message, true);
  }
});

els.messageForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state.user || !state.trackingCode) {
    notify('Necesitas login y tracking cargado.', true);
    return;
  }

  const message = String(new FormData(els.messageForm).get('message') || '').trim();
  if (!message) {
    notify('Escribe un mensaje.', true);
    return;
  }

  try {
    await api(`/api/packages/${state.trackingCode}/messages`, {
      method: 'POST',
      body: JSON.stringify({ userId: state.user.id, message }),
    });
    els.messageForm.reset();
  } catch (error) {
    notify(error.message, true);
  }
});

els.locationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state.user || !state.trackingCode) {
    notify('Necesitas login y tracking cargado.', true);
    return;
  }

  const formData = new FormData(els.locationForm);
  const payload = {
    userId: state.user.id,
    latitude: Number(formData.get('latitude')),
    longitude: Number(formData.get('longitude')),
    address: String(formData.get('address') || '').trim(),
    note: String(formData.get('note') || '').trim(),
  };

  try {
    await api(`/api/packages/${state.trackingCode}/location`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    els.locationForm.reset();
  } catch (error) {
    notify(error.message, true);
  }
});

els.receiveBtn.addEventListener('click', async () => {
  if (!state.user || !state.trackingCode) {
    notify('Necesitas login y tracking cargado.', true);
    return;
  }

  try {
    await api(`/api/packages/${state.trackingCode}/receive`, {
      method: 'POST',
      body: JSON.stringify({ userId: state.user.id }),
    });
  } catch (error) {
    notify(error.message, true);
  }
});

socket.on('connect', () => {
  notify('Socket conectado. Listo para recibir eventos.');
});

socket.on('package:created', (payload) => {
  if (payload.tracking_code !== state.trackingCode) return;
  notify(`Evento: paquete ${payload.tracking_code} creado.`);
  loadPackage(state.trackingCode).catch(() => {});
});

socket.on('package:message', (payload) => {
  if (payload.trackingCode !== state.trackingCode) return;
  notify(`Evento: nuevo mensaje por ${payload.username}.`);
  loadPackage(state.trackingCode).catch(() => {});
});

socket.on('package:location', (payload) => {
  if (payload.trackingCode !== state.trackingCode) return;
  notify(`Evento: nueva ubicacion (${payload.latitude}, ${payload.longitude}).`);
  loadPackage(state.trackingCode).catch(() => {});
});

socket.on('package:received', (payload) => {
  if (payload.tracking_code !== state.trackingCode) return;
  notify(`Evento: paquete ${payload.tracking_code} recibido.`);
  loadPackage(state.trackingCode).catch(() => {});
});
