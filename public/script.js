// Inject reusable header and footer
async function loadLayout() {
  const header = await fetch("header.html").then(res => res.text());
  const footer = await fetch("footer.html").then(res => res.text());
  document.getElementById("header-container").innerHTML = header;
  document.getElementById("footer-container").innerHTML = footer;
}

loadLayout();


document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("company-select");
  const tbody = document.getElementById("stock-data");

  async function fetchData(ticker) {
    tbody.innerHTML = "<tr><td colspan='8'>Loading...</td></tr>";

    try {
      const response = await fetch(`/api/stock?ticker=${ticker}`);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        tbody.innerHTML = "<tr><td colspan='8'>No data found.</td></tr>";
        return;
      }

      tbody.innerHTML = "";
      data.results.forEach((result) => {
        const row = document.createElement("tr");
        const date = new Date(result.t);
        row.innerHTML = `
          <td>${date.toLocaleDateString()}</td>
          <td>${result.v?.toLocaleString()}</td>
          <td>${result.vw?.toFixed(2)}</td>
          <td>${result.o?.toFixed(2)}</td>
          <td>${result.c?.toFixed(2)}</td>
          <td>${result.h?.toFixed(2)}</td>
          <td>${result.l?.toFixed(2)}</td>
          <td>${result.n?.toLocaleString()}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error("Fetch error:", err);
      tbody.innerHTML = `<tr><td colspan='8'>Error loading data: ${err.message}</td></tr>`;
    }
  }

  select.addEventListener("change", () => {
    const ticker = select.value;
    fetchData(ticker);
  });

  // Initial load
  fetchData(select.value);
});

