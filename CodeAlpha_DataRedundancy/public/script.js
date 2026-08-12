const loginForm = document.getElementById("loginForm");
const loginSection = document.getElementById("loginSection");
const adminPanel = document.getElementById("adminPanel");
const loginMsg = document.getElementById("loginMsg");

const recordForm = document.getElementById("recordForm");
const resultBox = document.getElementById("resultBox");
const recordsList = document.getElementById("recordsList");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const totalRecords = document.getElementById("totalRecords");
const verifiedRecords = document.getElementById("verifiedRecords");
const exportBtn = document.getElementById("exportBtn");

// Admin login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("adminUser").value;
  const password = document.getElementById("adminPass").value;

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      loginMsg.style.color = "green";
      loginMsg.textContent = "Login successful";
      loginSection.classList.add("hidden");
      adminPanel.classList.remove("hidden");
      loadDashboard();
      loadRecords();
    } else {
      loginMsg.style.color = "red";
      loginMsg.textContent = data.message;
    }
  } catch (error) {
    loginMsg.style.color = "red";
    loginMsg.textContent = "Login failed";
  }
});

// Add record + validation
recordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const recordData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    department: document.getElementById("department").value
  };

  try {
    const response = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recordData)
    });

    const data = await response.json();

    if (data.success) {
      resultBox.innerHTML = `
        <p class="unique">Status: ${data.status}</p>
        <p>${data.message}</p>
        <p><strong>Name:</strong> ${data.record.name}</p>
        <p><strong>Email:</strong> ${data.record.email}</p>
        <p><strong>Phone:</strong> ${data.record.phone}</p>
        <p><strong>Department:</strong> ${data.record.department}</p>
      `;
      recordForm.reset();
      loadDashboard();
      loadRecords();
    } else {
      if (data.status === "Redundant") {
        resultBox.innerHTML = `
          <p class="redundant">Status: ${data.status}</p>
          <p>${data.message}</p>
          <p><strong>Duplicate Name:</strong> ${data.duplicate.name}</p>
          <p><strong>Duplicate Email:</strong> ${data.duplicate.email}</p>
          <p><strong>Duplicate Phone:</strong> ${data.duplicate.phone}</p>
        `;
      } else {
        resultBox.innerHTML = `
          <p class="false-positive">Status: ${data.status}</p>
          <p>${data.message}</p>
        `;
      }
    }
  } catch (error) {
    resultBox.innerHTML = `<p class="false-positive">Server error.</p>`;
  }
});

// Search button
searchBtn.addEventListener("click", loadRecords);

// CSV export
exportBtn.addEventListener("click", () => {
  window.open("/api/export/csv", "_blank");
});

// Dashboard data
async function loadDashboard() {
  try {
    const response = await fetch("/api/dashboard");
    const data = await response.json();

    if (data.success) {
      totalRecords.textContent = data.totalRecords;
      verifiedRecords.textContent = data.verifiedRecords;
    }
  } catch (error) {
    console.log("Dashboard load failed");
  }
}

// Load records list
async function loadRecords() {
  const search = searchInput.value;
  const status = statusFilter.value;

  recordsList.innerHTML = "<p>Loading records...</p>";

  try {
    const response = await fetch(
      `/api/records?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`
    );
    const data = await response.json();

    if (data.success && data.records.length > 0) {
      recordsList.innerHTML = data.records
        .map(
          (record) => `
        <div class="record-item">
          <p><strong>Name:</strong> ${record.name}</p>
          <p><strong>Email:</strong> ${record.email}</p>
          <p><strong>Phone:</strong> ${record.phone}</p>
          <p><strong>Department:</strong> ${record.department}</p>
          <p><strong>Status:</strong> ${record.status}</p>
          <button class="delete-btn" onclick="deleteRecord('${record.id}')">Delete</button>
        </div>
      `
        )
        .join("");
    } else {
      recordsList.innerHTML = "<p>No matching records found.</p>";
    }
  } catch (error) {
    recordsList.innerHTML = "<p>Failed to load records.</p>";
  }
}

// Delete record
async function deleteRecord(id) {
  try {
    const response = await fetch(`/api/records/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (data.success) {
      loadDashboard();
      loadRecords();
    } else {
      alert("Delete failed");
    }
  } catch (error) {
    alert("Server error");
  }
}