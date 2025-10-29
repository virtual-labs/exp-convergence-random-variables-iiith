let animationInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for animation controls
    document.getElementById('startAnimationBtn').addEventListener('click', startAnimation);
    document.getElementById('stopAnimationBtn').addEventListener('click', stopAnimation);
    
    // Initialize the plots with a default empty state
    initializePlots();
});

/**
 * Sets up the initial state of both charts before any animation runs.
 */
function initializePlots() {
    // Plot for the animated random variable X_n
    const animCtx = document.getElementById('animationPlot').getContext('2d');
    if (window.animChart) window.animChart.destroy();
    window.animChart = new Chart(animCtx, {
        type: 'line',
        data: { 
            datasets: [{ 
                label: `Plot of X_n(ω)`,
                borderColor: '#3e95cd',
                backgroundColor: 'rgba(62, 149, 205, 0.3)',
                fill: true,
                stepped: true,
                pointRadius: 0
            }] 
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Outcome ω' }, min: 0, max: 1 },
                y: { ticks: { stepSize: 0.5 }, title: { display: true, text: `Value of X_n(ω)` }, min: 0, max: 1.1 }
            },
            plugins: { title: { display: true, text: `Plot of Random Variable X_n` } }
        }
    });

    // Plot for the probability P(X_n = 1) vs. n
    const probCtx = document.getElementById('probabilityPlot').getContext('2d');
    if (window.probChart) window.probChart.destroy();
    window.probChart = new Chart(probCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'P(X_n = 1)',
                data: [],
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.3)',
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 5,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Index n' } },
                y: { type: 'linear', title: { display: true, text: 'Probability' }, min: 0, max: 1.1 }
            },
            plugins: { title: { display: true, text: 'Convergence in Probability: P(X_n = 1) → 0' } }
        }
    });
}

/**
 * Updates both the animation plot and the probability trend plot for a given n.
 * @param {number} n - The index of the random variable to plot.
 */
function plotAndUpdate(n) {
    const k = Math.floor(Math.log2(n)) + 1;
    const start_n_of_block = Math.pow(2, k - 1);
    const width = Math.pow(2, -(k - 1)); // This is P(X_n = 1)
    const j_index = n - start_n_of_block;

    const interval_start = j_index * width;
    const interval_end = (j_index + 1) * width;

    // --- Update Animation Plot (Top Chart) ---
    const animData = [
        {x: 0, y: 0}, {x: interval_start, y: 0}, {x: interval_start, y: 1},
        {x: interval_end, y: 1}, {x: interval_end, y: 0}, {x: 1, y: 0}
    ];
    window.animChart.data.datasets[0].data = animData;
    window.animChart.data.datasets[0].label = `Plot of X_${n}(ω)`;
    window.animChart.options.plugins.title.text = `Plot of Random Variable X_${n}`;
    window.animChart.update('none'); // Update without animation

    // --- Update Probability Plot (Bottom Chart) ---
    window.probChart.data.labels.push(n);
    window.probChart.data.datasets[0].data.push(width);
    window.probChart.update('none'); // Update without animation
}

/**
 * Starts the animation loop.
 */
function startAnimation() {
    stopAnimation(); 
    initializePlots(); // Reset charts to a clean state

    const blockInput = document.getElementById('block').value;
    const k_max = parseInt(blockInput);

    if (isNaN(k_max) || k_max <= 0) {
        alert("Please enter a positive integer for the block number 'k'.");
        return;
    }
    if (k_max > 10) {
        alert("Animating up to a large 'k' may be slow. Consider k <= 10 for better performance.");
        return;
    }

    const max_n = Math.pow(2, k_max) - 1;
    let n = 1;

    // Speed is inverted: higher slider value means faster animation (shorter interval)
    const speed = 1050 - document.getElementById('speedSlider').value;

    animationInterval = setInterval(() => {
        if (n > max_n) {
            stopAnimation();
            return;
        }
        plotAndUpdate(n);
        n++;
    }, speed);
}

/**
 * Stops the animation by clearing the interval.
 */
function stopAnimation() {
    clearInterval(animationInterval);
}