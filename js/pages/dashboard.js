/* ============================================================
   OLMS — Dashboard Page Logic
   Animated counters, Chart.js graphs, activity feed
   ============================================================ */

const DashboardPage = (() => {
  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    animateStats();
    initCharts();
    renderActivity();
  }

  // ── Animated Counter Stats ──
  function animateStats() {
    const stats = DataStore.getStats();

    setTimeout(() => {
      Utils.animateCounter(document.getElementById('stat-total-books'), stats.totalBooks);
      Utils.animateCounter(document.getElementById('stat-issued-books'), stats.issuedBooks);
      Utils.animateCounter(document.getElementById('stat-available-books'), stats.availableBooks);
      // Fine is a float — special handling
      const fineEl = document.getElementById('stat-fines');
      if (fineEl) {
        const target = parseFloat(stats.totalFines);
        const start = 0;
        const duration = 1500;
        const startTime = performance.now();

        function updateFine(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - (1 - progress) * (1 - progress);
          const current = (start + (target - start) * eased).toFixed(2);
          fineEl.textContent = '$' + current;
          if (progress < 1) requestAnimationFrame(updateFine);
        }
        requestAnimationFrame(updateFine);
      }
    }, 400);
  }

  // ── Chart.js ──
  function initCharts() {
    // Monthly Issues vs Returns
    const monthlyCtx = document.getElementById('monthly-chart');
    if (monthlyCtx && typeof Chart !== 'undefined') {
      const data = DataStore.getMonthlyData();

      new Chart(monthlyCtx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: 'Books Issued',
              data: data.issues,
              borderColor: '#6C5CE7',
              backgroundColor: 'rgba(108, 92, 231, 0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: '#6C5CE7',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Books Returned',
              data: data.returns,
              borderColor: '#00CEC9',
              backgroundColor: 'rgba(0, 206, 201, 0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: '#00CEC9',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#8892A8',
                usePointStyle: true,
                padding: 20,
                font: { size: 12, family: "'Inter', sans-serif" }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(22, 27, 38, 0.95)',
              titleColor: '#F0F2F5',
              bodyColor: '#8892A8',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              cornerRadius: 10,
              padding: 12,
              titleFont: { size: 13, weight: '600' },
              bodyFont: { size: 12 },
              displayColors: true,
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
              ticks: { color: '#636E83', font: { size: 11 } }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
              ticks: { color: '#636E83', font: { size: 11 } },
              beginAtZero: true
            }
          }
        }
      });
    }

    // Category Distribution Doughnut
    const categoryCtx = document.getElementById('category-chart');
    if (categoryCtx && typeof Chart !== 'undefined') {
      const data = DataStore.getCategoryData();

      new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
          labels: data.labels,
          datasets: [{
            data: data.values,
            backgroundColor: [
              'rgba(108, 92, 231, 0.8)',
              'rgba(0, 206, 201, 0.8)',
              'rgba(253, 121, 168, 0.8)',
              'rgba(253, 203, 110, 0.8)',
              'rgba(116, 185, 255, 0.8)',
              'rgba(0, 184, 148, 0.8)',
            ],
            borderColor: 'rgba(22, 27, 38, 1)',
            borderWidth: 3,
            hoverOffset: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#8892A8',
                usePointStyle: true,
                padding: 16,
                font: { size: 11, family: "'Inter', sans-serif" }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(22, 27, 38, 0.95)',
              titleColor: '#F0F2F5',
              bodyColor: '#8892A8',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              cornerRadius: 10,
              padding: 12,
            }
          }
        }
      });
    }
  }

  // ── Activity Feed ──
  function renderActivity() {
    const container = document.getElementById('activity-list');
    if (!container) return;

    const activities = DataStore.getActivities();
    container.innerHTML = activities.slice(0, 8).map(a => {
      const iconMap = {
        issue: 'fas fa-arrow-right',
        return: 'fas fa-undo',
        fine: 'fas fa-exclamation-triangle',
        register: 'fas fa-user-plus'
      };

      return `
        <div class="activity-item">
          <div class="activity-icon ${a.type}">
            <i class="${iconMap[a.type]}"></i>
          </div>
          <div class="activity-content">
            <div class="activity-text">${a.text}</div>
            <div class="activity-time">${a.time}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  return { init };
})();
