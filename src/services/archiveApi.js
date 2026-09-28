const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request(path, signal) {
  const response = await fetch(`${API_BASE}/api${path}`, {
    headers: { Accept: "application/json" }, signal,
  });
  if (!response.ok) throw new Error(`Archive API returned ${response.status}`);
  return response.json();
}

export const getCelestialBodies = (signal) => request("/bodies", signal);
export const getArtifacts = (body, signal) =>
  request(`/artifacts${body ? `?body=${encodeURIComponent(body)}` : ""}`, signal);
export const getArtifact = (slug, signal) =>
  request(`/artifacts/${encodeURIComponent(slug)}`, signal);
