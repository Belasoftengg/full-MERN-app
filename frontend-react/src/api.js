const API_BASE = "http://localhost:5000";

async function json(res) {
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw (data || { error: "Request failed" });
  return data;
}

export const api = {
  // Auth
  register: (payload) =>
    fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }).then(json),

  login: (payload) =>
    fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }).then(json),

  me: () =>
    fetch(`${API_BASE}/api/auth/me`, {
      credentials: "include",
    }).then(json),

  logout: () =>
    fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).then(json),

  // Products
  listProducts: () =>
    fetch(`${API_BASE}/api/products`, {
      credentials: "include",
    }).then(json),

  createProduct: (payload) =>
    fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }).then(json),

  updateProduct: (id, payload) =>
    fetch(`${API_BASE}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }).then(json),

  deleteProduct: (id) =>
    fetch(`${API_BASE}/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (!res.ok) throw { error: "Delete failed" };
      return true;
    }),
};
