const idempotencyStore = new Map();

function createFingerprint(body) {
  return JSON.stringify(body || {});
}

function getSavedResponse(key) {
  return idempotencyStore.get(key);
}

function saveResponse(key, body, response) {
  const fingerprint = createFingerprint(body);
  idempotencyStore.set(key, { fingerprint, response });
}

function isSamePayload(saved, body) {
  return saved.fingerprint === createFingerprint(body);
}

module.exports = {
  getSavedResponse,
  saveResponse,
  isSamePayload
};
