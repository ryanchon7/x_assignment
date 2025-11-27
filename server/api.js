// api.js

const API_BASE = ""; // same-origin with backend

export function saveAuth(token, userid) {
  localStorage.setItem("token", token);
  localStorage.setItem("userid", userid);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("userid");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUserid() {
  return localStorage.getItem("userid");
}

export function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "/login.html";
  }
}

export async function apiRequest(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(API_BASE + path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let msg = "";
    try {
      const data = await res.json();
      msg = data.message || JSON.stringify(data);
    } catch {
      msg = await res.text();
    }
    throw new Error(msg || res.statusText);
  }

  // some endpoints might return no content (204)
  if (res.status === 204) return null;
  return res.json();
}
