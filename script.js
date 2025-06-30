let chart = null;

// Function to render Chart.js line chart
function renderChart(dates, closes, ticker) {
  const ctx = document.getElementById("stockChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: `${ticker} Closing Price`,
          data: closes,
          fill: false,
          borderColor: "#0070f3",
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: { title: { display: true, text: "Close ($)" } }
      }
    }
  });
}

// Load reusable header and footer HTML
async function loadLayout() {
  const header = await fetch("header.html").then(res => res.text());
  const footer = await fetch("footer.html").then(res => res.text());
  document.getElementById("header-container").innerHTML = header;
  document.getElementById("footer-container").innerHTML = footer;
}

loadLayout();

// Main app logic after DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("company-select");
  const tbody = document.getElementById("stock-data");

  async function fetchData(ticker) {
    tbody.innerHTML = "<tr><td colspan='8'>Loading...</td></tr>";

    try {
      const response = await fetch(`/api/stock?ticker=${ticker}`);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      console.log("Response data:", data);

      if (!data.results || data.results.length === 0) {
        tbody.innerHTML = "<tr><td colspan='8'>No data found.</td></tr>";
        return;
      }

      // Populate table rows
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

      // Render chart
      const dates = data.results.map(r => new Date(r.t).toLocaleDateString());
      const closes = data.results.map(r => r.c);
      renderChart(dates, closes, ticker);

    } catch (err) {
      console.error("Fetch error:", err);
      tbody.innerHTML = `<tr><td colspan='8'>Error loading data: ${err.message}</td></tr>`;
    }
  }

  select.addEventListener("change", () => {
    fetchData(select.value);
  });

  // Initial load
  fetchData(select.value);
});
