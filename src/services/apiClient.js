// The ONE place that talks to the backend with fetch().
// Components never call fetch() themselves.

// Vite exposes variables that start with VITE_ through import.meta.env.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Demonstration mode is ON when no backend URL is set, or when VITE_USE_MOCK is "true".
export const isDemoMode =
  import.meta.env.VITE_USE_MOCK === "true" || API_BASE_URL === "";

// A custom error type so the UI can read the HTTP status code.
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// path   example: "/api/investigations"
// options: { method, body, signal }  (signal lets a request be cancelled)
export async function apiRequest(path, { method = "GET", body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include", // send the session cookie; the backend owns authentication
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error; // a cancelled request is not a failure
    throw new ApiError("Could not reach the server. Check your connection and the API URL.");
  }

  // Expired session: tell the app shell so it can show a message.
  if (response.status === 401) {
    window.dispatchEvent(new Event("session-expired"));
    throw new ApiError("Your session has expired. Sign in again to continue.", 401);
  }

  if (!response.ok) {
    let message = `The server returned an error (${response.status}).`;
    try {
      const data = await response.json();
      if (data && data.message) message = data.message;
    } catch {
      // The error body was not JSON. Keep the default message.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return null; // "No Content"
  return response.json();
}
