let jwtToken = null;

const signupForm = document.getElementById("signupForm");
const signupResult = document.getElementById("signupResult");

const loginForm = document.getElementById("loginForm");
const loginResult = document.getElementById("loginResult");
const tokenInfo = document.getElementById("tokenInfo");

const loadDashboardBtn = document.getElementById("loadDashboardBtn");
const dashboardResult = document.getElementById("dashboardResult");

const loadLogsBtn = document.getElementById("loadLogsBtn");
const logsResult = document.getElementById("logsResult");

const secureQueryForm = document.getElementById("secureQueryForm");
const secureQueryResult = document.getElementById("secureQueryResult");

const unsafeQueryForm = document.getElementById("unsafeQueryForm");
const unsafeQueryResult = document.getElementById("unsafeQueryResult");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;
  const role = document.getElementById("signupRole").value;

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role })
    });

    const data = await res.json();

    if (data.success) {
      signupResult.innerHTML = `
        <p class="success">${data.message}</p>
        <p>Username: ${username}</p>
        <p>Role: ${role}</p>
      `;
      signupForm.reset();
    } else {
      signupResult.innerHTML = `<p class="error">${data.message}</p>`;
    }
  } catch (error) {
    signupResult.innerHTML = `<p class="error">Signup failed.</p>`;
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      jwtToken = data.token;
      loginResult.innerHTML = `
        <p class="success">${data.message}</p>
        <p>Role: ${data.user.role}</p>
      `;
      tokenInfo.textContent = `JWT: ${jwtToken}`;
      loginForm.reset();
    } else {
      loginResult.innerHTML = `<p class="error">${data.message}</p>`;
      tokenInfo.textContent = "No valid token.";
      jwtToken = null;
    }
  } catch (error) {
    loginResult.innerHTML = `<p class="error">Login failed.</p>`;
    tokenInfo.textContent = "No valid token.";
    jwtToken = null;
  }
});

loadDashboardBtn.addEventListener("click", async () => {
  if (!jwtToken) {
    dashboardResult.innerHTML = `<p class="error">Login required.</p>`;
    return;
  }

  try {
    const res = await fetch("/api/dashboard", {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    });

    const data = await res.json();

    if (data.success) {
      dashboardResult.innerHTML = `
        <p class="success">Dashboard loaded.</p>
        <p>Total users: ${data.totalUsers}</p>
        <p>Total security logs: ${data.totalLogs}</p>
      `;
    } else {
      dashboardResult.innerHTML = `<p class="error">${data.message}</p>`;
    }
  } catch (error) {
    dashboardResult.innerHTML = `<p class="error">Dashboard failed.</p>`;
  }
});

loadLogsBtn.addEventListener("click", async () => {
  if (!jwtToken) {
    logsResult.innerHTML = `<p class="error">Login as admin required.</p>`;
    return;
  }

  try {
    const res = await fetch("/api/security-logs", {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    });

    const data = await res.json();

    if (data.success) {
      logsResult.innerHTML =
        data.logs.length === 0
          ? "<p>No logs.</p>"
          : data.logs
              .map(
                (log) =>
                  `<p><strong>${log.event_type}</strong> – ${log.created_at}<br/><span>${log.details}</span></p>`
              )
              .join("");
    } else {
      logsResult.innerHTML = `<p class="error">${data.message}</p>`;
    }
  } catch (error) {
    logsResult.innerHTML = `<p class="error">Logs load failed.</p>`;
  }
});

secureQueryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!jwtToken) {
    secureQueryResult.innerHTML = `<p class="error">Login required.</p>`;
    return;
  }

  const usernameFilter = document.getElementById("secureFilter").value;
  const capabilityCode = document.getElementById("capabilityCode").value;

  try {
    const res = await fetch("/api/secure-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ usernameFilter, capabilityCode })
    });

    const data = await res.json();

    if (data.success) {
      secureQueryResult.innerHTML = `
        <p class="success">${data.message}</p>
        <p><strong>Results:</strong></p>
        ${
          data.results.length === 0
            ? "<p>No matching users.</p>"
            : data.results
                .map(
                  (u) =>
                    `<p>${u.id} – ${u.username} (${u.role})</p>`
                )
                .join("")
        }
      `;
    } else {
      secureQueryResult.innerHTML = `<p class="error">${data.message}</p>`;
    }
  } catch (error) {
    secureQueryResult.innerHTML = `<p class="error">Secure query failed.</p>`;
  }
});

unsafeQueryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!jwtToken) {
    unsafeQueryResult.innerHTML = `<p class="error">Login required.</p>`;
    return;
  }

  const rawFilter = document.getElementById("unsafeFilter").value;

  try {
    const res = await fetch("/api/unsafe-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ rawFilter })
    });

    const data = await res.json();

    if (data.success) {
      unsafeQueryResult.innerHTML = `
        <p class="warning">Unsafe SQL (for demo):</p>
        <p>${data.sql}</p>
        <p><strong>Results:</strong></p>
        ${
          data.results.length === 0
            ? "<p>No rows returned.</p>"
            : data.results
                .map(
                  (u) =>
                    `<p>${u.id} – ${u.username} (${u.role})</p>`
                )
                .join("")
        }
      `;
    } else {
      unsafeQueryResult.innerHTML = `<p class="error">${data.message}</p>`;
    }
  } catch (error) {
    unsafeQueryResult.innerHTML = `<p class="error">Unsafe query failed.</p>`;
  }
});