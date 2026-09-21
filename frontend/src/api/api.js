const API_BASE_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/* Authentication */

export function registerUser(data) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function loginUser(data) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCurrentUser() {
  return request("/api/auth/me");
}

/* RFQs */

export function createRFQ(data) {
  return request("/api/rfqs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getRFQs(search = "", location = "") {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (location) {
    params.append("location", location);
  }

  const query = params.toString();

  return request(
    `/api/rfqs${query ? `?${query}` : ""}`
  );
}

export function getMyRFQs() {
  return request("/api/rfqs/my");
}

export function getRFQ(id) {
  return request(`/api/rfqs/${id}`);
}

export function updateRFQ(id, data) {
  return request(`/api/rfqs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteRFQ(id) {
  return request(`/api/rfqs/${id}`, {
    method: "DELETE",
  });
}

/* Quotations */

export function createQuotation(rfqId, data) {
  return request(
    `/api/rfqs/${rfqId}/quotations`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function getRFQQuotations(rfqId) {
  return request(
    `/api/rfqs/${rfqId}/quotations`
  );
}

export function getMyQuotations() {
  return request("/api/quotations/my");
}