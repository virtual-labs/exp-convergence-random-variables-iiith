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
                    label: `Plot of X_n(ω)`, borderColor: '#3e95cd', backgroundColor: 'rgba(62, 149, 205, 0.3)',
                    fill: true, stepped: true, pointRadius: 0, order: 2
                },
                { // The vertical line for omega
                    label: 'Selected ω', borderColor: '#ff6384', borderWidth: 2, borderDash: [5, 5],
                    pointRadius: 0, fill: false, order: 1
                }
            ] 
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Outcome ω' }, min: 0, max: 1 },
                y: { ticks: { stepSize: 1 }, title: { display: true, text: `Value of X_n(ω)` }, min: 0, max: 1.1 }
            },
            plugins: { title: { display: true, text: `Plot of Random Variable X_n` } }
        }
    });

    // --- Plot 2: Probability P(X_n = 1) vs. n ---
    const probCtx = document.getElementById('probabilityPlot').getContext('2d');
    if (window.probChart) window.probChart.destroy();
    window.probChart = new Chart(probCtx, {
        type: 'line',
        data: { labels: [], datasets: [{
            label: 'P(X_n = 1)', data: [], borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.3)', fill: false,
            pointRadius: 2, pointHoverRadius: 5, borderWidth: 2
        }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Index n' } },
                y: { type: 'linear', title: { display: true, text: 'Probability' }, min: 0, max: 1.1 }
            },
            plugins: { title: { display: true, text: 'Convergence in Probability: P(X_n = 1) → 0' } }
        }
    });

    // --- Plot 3: Value of X_n(ω) for a fixed ω ---
    const omegaCtx = document.getElementById('omegaPlot').getContext('2d');
    if (window.omegaChart) window.omegaChart.destroy();
    window.omegaChart = new Chart(omegaCtx, {
        type: 'line',
        data: { labels: [], datasets: [{
            label: 'Value at selected ω', data: [], borderColor: '#f39c12',
            stepped: true, pointRadius: 2, pointHoverRadius: 5, borderWidth: 2
        }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Index n' } },
                y: { ticks: { stepSize: 1 }, title: { display: true, text: 'Value X_n(ω)' }, min: -0.1, max: 1.1 }
            },
            plugins: { title: { display: true, text: `Sample Path for a Fixed ω = ${initialOmega.toFixed(2)}` } }
        }
    });

    updateOmegaLine(initialOmega);
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
    let n = 1;

    const speed = 1050 - document.getElementById('speedSlider').value;

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

    let obsHTML = `<p>The animation ran for <strong>${total_n}</strong> steps (from n=1 to n=${total_n}).</p>`;
    
    obsHTML += `<p style="margin-top:1rem;"><strong>1. Overall Probability (Middle Plot)</strong></p>`;
    obsHTML += `<p>The green line shows that the probability \\(P(X_n=1)\\) steadily decreased from <strong>${probData[0].toFixed(2)}</strong> down to <strong>${probData[probData.length - 1].toFixed(4)}</strong>. This visually confirms that \\( P(X_n=1) \\to 0 \\), which is the definition of convergence in probability for this sequence.</p>`;

    obsHTML += `<p style="margin-top:1rem;"><strong>2. Specific Outcome at ω = ${selectedOmega.toFixed(2)} (Bottom Plot)</strong></p>`;
    obsHTML += `<p>For your chosen outcome \\(\\omega = ${selectedOmega.toFixed(2)}\\), the value of \\(X_n(\\omega)\\) was 1 (a "hit") a total of <strong>${totalHits}</strong> time(s).</p>`;
    
    if (totalHits > 0) {
        obsHTML += `<p>Even with these hits, the bottom plot clearly shows that as \\(n\\) became large, the value of \\(X_n(\\omega)\\) eventually became <strong>0</strong> and stayed there. This is the key takeaway: for any specific point \\(\\omega\\), the chance of it being "hit" becomes vanishingly small, and eventually, it is always "missed".</p>`;
    } else {
        obsHTML += `<p>For this specific \\(\\omega\\), the value of \\(X_n(\\omega)\\) was <strong>always 0</strong>. This is a perfect illustration of the convergence at this point.</p>`;
    }
    
    obsHTML += `<hr><p style="font-weight:bold;">This experiment demonstrates the essence of convergence in probability: while the non-zero part of the function is always *somewhere*, the probability of it landing on any *specific* point you choose tends to zero.</p>`;
    
    observationPanel.innerHTML = obsHTML;
    observationContainer.style.display = ''; // Use '' to revert to default display
    
    // Explicitly ask MathJax to re-render the new content in the observation panel
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([observationPanel]).catch(function (err) {
            console.log('MathJax typesetting failed: ' + err.message);
        });
    }
}