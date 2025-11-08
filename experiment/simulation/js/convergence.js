let animationInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for animation controls
    document.getElementById('startAnimationBtn').addEventListener('click', startAnimation);
    document.getElementById('stopAnimationBtn').addEventListener('click', stopAnimation);
    
    // Listener for the new omega slider
    const omegaSlider = document.getElementById('omegaSlider');
    const omegaValueSpan = document.getElementById('omegaValue');
    omegaSlider.addEventListener('input', (event) => {
        const omega = parseFloat(event.target.value);
        omegaValueSpan.textContent = omega.toFixed(2);
        updateOmegaLine(omega);
    });

    // Initialize the plots with a default empty state
    initializePlots();
});

/**
 * Sets up the initial state of all three charts.
 */
function initializePlots() {
    const initialOmega = parseFloat(document.getElementById('omegaSlider').value);

    // --- Plot 1: Animated random variable X_n ---
    const animCtx = document.getElementById('animationPlot').getContext('2d');
    if (window.animChart) window.animChart.destroy();
    window.animChart = new Chart(animCtx, {
        type: 'line',
        data: { 
            datasets: [
                { // The main rectangle
                    label: `Plot of X_n(ω)`,
                    borderColor: '#3e95cd',
                    backgroundColor: 'rgba(62, 149, 205, 0.4)',
                    borderWidth: 2.5,
                    fill: true,
                    stepped: true,
                    pointRadius: 0,
                    order: 2
                },
                { // The vertical line for omega
                    label: 'Selected ω',
                    borderColor: '#ff6384',
                    borderWidth: 3,
                    borderDash: [6, 6],
                    pointRadius: 0,
                    fill: false,
                    order: 1
                }
            ] 
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'Outcome ω', font: { size: 14 } },
                    min: 0, max: 1,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                },
                y: {
                    ticks: { stepSize: 1 },
                    title: { display: true, text: `Value of X_n(ω)`, font: { size: 14 } },
                    min: 0, max: 1.1,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                }
            },
            plugins: {
                title: { display: true, text: `Plot of Random Variable X_n`, font: { size: 16 } }
            }
        }
    });

    // --- Plot 2: Probability P(X_n = 1) vs. n ---
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
                pointRadius: 3,
                pointHoverRadius: 6,
                borderWidth: 2.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'Index n', font: { size: 14 } },
                    min: 1, // Start axis at n=1
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                },
                y: {
                    type: 'linear',
                    title: { display: true, text: 'Probability', font: { size: 14 } },
                    min: 0, max: 1.1,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                }
            },
            plugins: {
                title: { display: true, text: 'Convergence in Probability: P(X_n = 1) → 0', font: { size: 16 } }
            }
        }
    });

    // --- Plot 3: Value of X_n(ω) for a fixed ω ---
    const omegaCtx = document.getElementById('omegaPlot').getContext('2d');
    if (window.omegaChart) window.omegaChart.destroy();
    window.omegaChart = new Chart(omegaCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Value at selected ω',
                data: [],
                borderColor: '#f39c12',
                stepped: true,
                pointRadius: 3,
                pointHoverRadius: 6,
                borderWidth: 2.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'Index n', font: { size: 14 } },
                    min: 1, // Start axis at n=1
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                },
                y: {
                    ticks: { stepSize: 1 },
                    title: { display: true, text: 'Value X_n(ω)', font: { size: 14 } },
                    min: -0.1, max: 1.1,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                }
            },
            plugins: {
                title: { display: true, text: `Sample Path for a Fixed ω = ${initialOmega.toFixed(2)}`, font: { size: 16 } }
            }
        }
    });

    updateOmegaLine(initialOmega);
}

/**
 * Calculates an appropriate animation speed based on the number of blocks (k).
 * @param {number} k - The block number.
 * @returns {number} The interval delay in milliseconds.
 */
function getDynamicSpeed(k) {
    if (k <= 2) return 700; // Very slow for the first few steps
    if (k === 3) return 500;
    if (k === 4) return 300;
    if (k === 5) return 150;
    if (k === 6) return 80;
    if (k === 7) return 40;
    if (k === 8) return 20;
    if (k === 9) return 10;
    return 5; // Max speed for k=10 and above
}

/**
 * Updates the ω line position and the ω chart's title when the slider is moved.
 * @param {number} omega - The current value from the omega slider.
 */
function updateOmegaLine(omega) {
    if (window.animChart) {
        window.animChart.data.datasets[1].data = [{x: omega, y: 0}, {x: omega, y: 1.1}];
        window.animChart.update('none');
    }
    if (window.omegaChart) {
        window.omegaChart.options.plugins.title.text = `Sample Path for a Fixed ω = ${omega.toFixed(2)}`;
        window.omegaChart.update('none');
    }
}

/**
 * Updates all three plots for a given step n.
 * @param {number} n - The index of the random variable to plot.
 */
function plotAndUpdate(n) {
    const k = Math.floor(Math.log2(n)) + 1;
    const start_n_of_block = Math.pow(2, k - 1);
    const width = Math.pow(2, -(k - 1));
    const j_index = n - start_n_of_block;

    const interval_start = j_index * width;
    const interval_end = (j_index + 1) * width;
    const omega = parseFloat(document.getElementById('omegaSlider').value);

    // --- Determine if the selected ω is a "hit" or "miss" ---
    const valueAtOmega = (omega >= interval_start && omega < interval_end) ? 1 : 0;

    // --- Update Plot 1 (Animation) ---
    const animData = [
        {x: 0, y: 0}, {x: interval_start, y: 0}, {x: interval_start, y: 1},
        {x: interval_end, y: 1}, {x: interval_end, y: 0}, {x: 1, y: 0}
    ];
    window.animChart.data.datasets[0].data = animData;
    window.animChart.data.datasets[0].label = `Plot of X_${n}(ω)`;
    
    const omegaLine = window.animChart.data.datasets[1];
    omegaLine.borderColor = valueAtOmega === 1 ? '#2ecc71' : '#ff6384'; 
    omegaLine.label = valueAtOmega === 1 ? `ω is HIT (X_${n}(ω)=1)` : `ω is MISS (X_${n}(ω)=0)`;
    
    window.animChart.options.plugins.title.text = `Plot of Random Variable X_${n}`;
    window.animChart.update('none');

    // --- Update Plot 2 (Probability) ---
    window.probChart.data.labels.push(n);
    window.probChart.data.datasets[0].data.push(width);
    window.probChart.update('none');

    // --- Update Plot 3 (Omega Path) ---
    window.omegaChart.data.labels.push(n);
    window.omegaChart.data.datasets[0].data.push(valueAtOmega);
    window.omegaChart.options.plugins.title.text = `Sample Path for ω = ${omega.toFixed(2)} | At n=${n}, X_n(ω) = ${valueAtOmega}`;
    window.omegaChart.update('none');
}

/**
 * Starts the animation loop.
 */
function startAnimation() {
    stopAnimation(); 
    document.getElementById('observation-container').style.display = 'none'; // Hide old results
    initializePlots(); 

    const blockInput = document.getElementById('block').value;
    const k_max = parseInt(blockInput);

    if (isNaN(k_max) || k_max <= 0) {
        alert("Please enter a positive integer for the block number 'k'.");
        return;
    }
    if (k_max > 10) {
        alert("Animating up to a large 'k' may be slow. Consider k <= 10 for better performance.");
    }

    const max_n = Math.pow(2, k_max) - 1;

    // Handle x-axis scaling based on the number of steps.
    if (max_n > 1) {
        // Normal case for k > 1: Fit the axis to the data range.
        if (window.probChart) window.probChart.options.scales.x.max = max_n;
        if (window.omegaChart) window.omegaChart.options.scales.x.max = max_n;
    } else if (max_n === 1) {
        // Special case for k = 1: Center the single point at n=1 by setting the axis from 0 to 2.
        if (window.probChart) {
            window.probChart.options.scales.x.min = 0;
            window.probChart.options.scales.x.max = 2;
        }
        if (window.omegaChart) {
            window.omegaChart.options.scales.x.min = 0;
            window.omegaChart.options.scales.x.max = 2;
        }
    }

    let n = 1;
    const speed = getDynamicSpeed(k_max); // Use the dynamic speed

    animationInterval = setInterval(() => {
        if (n > max_n) {
            stopAnimation();
            displayFinalObservation(max_n); // Call the observation function
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

/**
 * Generates and displays the final summary after the animation is complete.
 * @param {number} total_n - The total number of steps the animation ran for.
 */
function displayFinalObservation(total_n) {
    const observationContainer = document.getElementById('observation-container');
    const observationPanel = document.getElementById('observation-panel');
    
    const omegaData = window.omegaChart.data.datasets[0].data;
    const selectedOmega = parseFloat(document.getElementById('omegaSlider').value);
    const probData = window.probChart.data.datasets[0].data;
    const totalHits = omegaData.reduce((sum, value) => sum + value, 0);

    let obsHTML = `<p>The animation ran for <strong>${total_n}</strong> steps (from n=1 to n=${total_n}).</p><hr>`;
    
    obsHTML += `<h4>1. Convergence in Probability (Middle Plot)</h4>`;
    obsHTML += `<p>The green line shows that the probability \\(P(X_n=1)\\) steadily decreased from <strong>${probData[0].toFixed(2)}</strong> down to <strong>${probData[probData.length - 1].toFixed(4)}</strong>. This visually confirms that \\( \\lim_{n \\to \\infty} P(X_n = 1) = 0 \\).</p>`;
    obsHTML += `<p>Since \\(X_n\\) can only be 0 or 1, the event \\(|X_n - 0| > \\epsilon\\) (for any \\(0 < \\epsilon < 1\\)) is exactly the same as the event \\(X_n = 1\\). Therefore, the plot demonstrates that \\( \\lim_{n \\to \\infty} P(|X_n - 0| > \\epsilon) = 0 \\), which is the formal definition of <strong>convergence in probability</strong>.</p>`;

    obsHTML += `<h4 style="margin-top:1.5rem;">2. Why the Sequence Does NOT Converge Almost Surely (Bottom Plot)</h4>`;
    obsHTML += `<p>Almost sure convergence requires that for a specific \\(\\omega\\), the sequence \\(X_n(\\omega)\\) eventually becomes 0 and <strong>stays 0 forever</strong>. The bottom plot, however, shows this is not the case.</p>`;
    obsHTML += `<p>For your chosen outcome \\(\\omega = ${selectedOmega.toFixed(2)}\\), you observed <strong>${totalHits}</strong> "hit(s)". While the animation stops and the value might be 0 at the end, the underlying pattern of the moving rectangle guarantees that it will eventually sweep over your chosen \\(\\omega\\) again if we let \\(n\\) grow infinitely large. In fact, for any \\(\\omega\\), \\(X_n(\\omega)\\) will equal 1 for infinitely many values of \\(n\\).</p>`;
    
    obsHTML += `<p style="margin-top:1rem; font-weight:bold;">Because the sequence \\(X_n(\\omega)\\) never permanently settles at 0 for any given \\(\\omega\\), it fails the condition for almost sure convergence. This experiment provides an example of a sequence that converges in probability but does not converge almost surely.</p>`;
    
    observationPanel.innerHTML = obsHTML;
    observationContainer.style.display = ''; // Use '' to revert to default display
    
    // Explicitly ask MathJax to re-render the new content in the observation panel
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([observationPanel]).catch(function (err) {
            console.log('MathJax typesetting failed: ' + err.message);
        });
    }
}