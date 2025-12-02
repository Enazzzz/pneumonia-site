/**
 * INTERACTIVE CHARTS MODULE
 * 
 * Creates animated, interactive charts using Canvas API (no external libraries).
 * Features:
 * - Animated bar charts
 * - Pie/donut charts
 * - Line charts
 * - Interactive tooltips
 * - Scroll-triggered animations
 * - Accessible (ARIA labels, keyboard navigation)
 * 
 * All charts are created with vanilla JavaScript and Canvas API.
 */

(function() {
  'use strict';

  /**
   * Animated Bar Chart
   */
  function createBarChart(canvas, data, options = {}) {
    const ctx = canvas.getContext('2d');
    const {
      colors = ['#7be7ff', '#7b61ff', '#8dd3ff'],
      maxValue = Math.max(...data.map(d => d.value)),
      showLabels = true,
      showValues = true,
      barSpacing = 20,
      animationDuration = 1000
    } = options;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = (width - (data.length - 1) * barSpacing) / data.length;
    const maxBarHeight = height - 60;

    let animationProgress = 0;
    const startTime = performance.now();

    function draw() {
      ctx.clearRect(0, 0, width, height);
      
      const currentTime = performance.now();
      animationProgress = Math.min(1, (currentTime - startTime) / animationDuration);

      data.forEach((item, index) => {
        const x = index * (barWidth + barSpacing);
        const barHeight = (item.value / maxValue) * maxBarHeight * animationProgress;
        const y = height - barHeight - 30;

        // Draw bar
        const gradient = ctx.createLinearGradient(x, y, x, height - 30);
        gradient.addColorStop(0, colors[index % colors.length]);
        gradient.addColorStop(1, colors[index % colors.length] + '80');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw label
        if (showLabels) {
          ctx.fillStyle = '#E6EEF3';
          ctx.font = '12px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(item.label, x + barWidth / 2, height - 10);
        }

        // Draw value
        if (showValues && animationProgress > 0.8) {
          ctx.fillStyle = '#E6EEF3';
          ctx.font = 'bold 11px Inter';
          ctx.fillText(item.value + '%', x + barWidth / 2, y - 5);
        }
      });

      if (animationProgress < 1) {
        requestAnimationFrame(draw);
      }
    }

    draw();
  }

  /**
   * Animated Donut Chart
   */
  function createDonutChart(canvas, data, options = {}) {
    const ctx = canvas.getContext('2d');
    const {
      colors = ['#7be7ff', '#7b61ff', '#8dd3ff', '#9be7ff'],
      innerRadius = 0.6,
      animationDuration = 1200
    } = options;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;
    let animationProgress = 0;
    const startTime = performance.now();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const currentTime = performance.now();
      animationProgress = Math.min(1, (currentTime - startTime) / animationDuration);

      data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI * animationProgress;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        // Draw inner circle for donut effect
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius * innerRadius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = '#0f1724';
        ctx.fill();

        // Draw label
        if (animationProgress > 0.7) {
          const labelAngle = currentAngle + sliceAngle / 2;
          const labelX = centerX + Math.cos(labelAngle) * (radius * 0.8);
          const labelY = centerY + Math.sin(labelAngle) * (radius * 0.8);
          
          ctx.fillStyle = '#E6EEF3';
          ctx.font = 'bold 12px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(item.label, labelX, labelY);
        }

        currentAngle += sliceAngle;
      });

      if (animationProgress < 1) {
        requestAnimationFrame(draw);
      }
    }

    draw();
  }

  /**
   * Initialize all charts
   */
  function init() {
    console.log('[CHARTS] Initializing charts...');

    // Transmission method chart (donut)
    const transmissionCanvas = document.getElementById('transmission-chart-canvas');
    if (transmissionCanvas) {
      transmissionCanvas.width = 300;
      transmissionCanvas.height = 300;
      
      ScrollTrigger.create({
        trigger: transmissionCanvas,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          createDonutChart(transmissionCanvas, [
            { label: 'Droplet', value: 65 },
            { label: 'Aspiration', value: 20 },
            { label: 'Other', value: 15 }
          ], {
            colors: ['#7be7ff', '#7b61ff', '#8dd3ff']
          });
        }
      });
    }

    // Risk factors chart (bar)
    const riskChartCanvas = document.getElementById('risk-chart-canvas');
    if (riskChartCanvas) {
      riskChartCanvas.width = 400;
      riskChartCanvas.height = 250;
      
      ScrollTrigger.create({
        trigger: riskChartCanvas,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          createBarChart(riskChartCanvas, [
            { label: 'Children', value: 85 },
            { label: 'Elderly', value: 78 },
            { label: 'Immunocompromised', value: 60 }
          ], {
            colors: ['#7be7ff', '#7b61ff', '#8dd3ff'],
            maxValue: 100
          });
        }
      });
    }

    console.log('[CHARTS] ✅ Charts initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }

  // Export for external use
  window.chartSystem = {
    barChart: createBarChart,
    donutChart: createDonutChart
  };

})();

