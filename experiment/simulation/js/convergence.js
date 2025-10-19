let animationInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startAnimationBtn').addEventListener('click', startAnimation);
    document.getElementById('stopAnimationBtn').addEventListener('click', stopAnimation);
    // Initialize the animation plot view with the first variable
    plotAnimatedVariable(1); 
});

function runConvergence() {
    stopAnimation(); // Stop animation if it's running
    const omegaInput = document.getElementById('omega').value;
    const blockInput = document.getElementById('block').value;
    const observations = document.getElementById('observations');
    observations.innerHTML = ""; // Clear previous

    const omega = parseFloat(omegaInput);
    const k = parseInt(blockInput);

    if (isNaN(omega) || omega <= 0 || omega >= 1) {
        observations.innerHTML = `<p class="error">Please enter a valid ω in the open interval (0, 1).</p>`;
        return;
    }
    if (isNaN(k) || k <= 0) {
        observations.innerHTML = `<p class="error">Please enter a positive integer for the block number k.</p>`;
        return;
    }
    if (k >= 15) {
        observations.innerHTML = `<p class="error">Block number is too large for effective visualization. Please choose k < 15.</p>`;
        return;
    }

    const start_n = Math.pow(2, k - 1);
    const end_n = Math.pow(2, k) - 1;
    const interval_width = Math.pow(2, -(k-1));
    const j = Math.floor(omega / interval_width);
    const foundIndex = start_n + j;

    observations.innerHTML = `
        <h4>Analysis for Your Inputs:</h4>
        <p><strong>Selected Outcome (\\(\\omega\\)):</strong> <span class="result-highlight">${omega}</span></p>
        <p><strong>Selected Block (\\(k\\)):</strong> <span class="result-highlight">${k}</span></p>
        <p>This block contains variables from \\(X_{${start_n}}\\) to \\(X_{${end_n}}\\), each corresponding to an interval of width ${interval_width.toFixed(4)}.</p>
        <hr>
        <h4>Result:</h4>
        <p>For your chosen \\(\\omega\\), the random variable that equals 1 in this block is <strong class="result-highlight">\\(X_{${foundIndex}}\\)</strong>.</p>
        <p>This is because \\(\\omega=${omega}\\) falls into the interval (${(j * interval_width).toFixed(4)}, ${( (j+1) * interval_width).toFixed(4)}], which corresponds to \\(X_{${foundIndex}}\\).</p>
        <hr>
        <h4>Conclusion & Deeper Dive</h4>
        <p>Since for any \\(\\omega\\) and any block \\(k\\), we can always find an index \\(n\\) where \\(X_n(\\omega)=1\\), the sequence of outcomes never permanently settles at 0. Therefore, the sequence <strong>does not converge almost surely</strong>.</p>
        
        <div class="theory-box">
            <h5>Why is the answer always "does not converge"?</h5>
            <p>This experiment is a counterexample designed to show that a sequence can <strong>converge in probability</strong> (which this one does) without satisfying the stricter condition of <strong>almost sure convergence</strong>.</p>
        </div>
    `;
    
    if (window.MathJax) {
        MathJax.typeset([observations]);
    }

    plotRandomVariable(foundIndex, k, interval_width, j);
    plotOmegaSequence(omega, k);
}

function plotAnimatedVariable(n) {
    const k = Math.floor(Math.log2(n)) + 1;
    const start_n_of_block = Math.pow(2, k - 1);
    const width = Math.pow(2, -(k - 1));
    const j_index = n - start_n_of_block;

    const interval_start = j_index * width;
    const interval_end = (j_index + 1) * width;

    const data = [];
    data.push({x: 0, y: 0});
    data.push({x: interval_start, y: 0});
    data.push({x: interval_start, y: 1});
    data.push({x: interval_end, y: 1});
    data.push({x: interval_end, y: 0});
    data.push({x: 1, y: 0});

    const ctx = document.getElementById('animationPlot').getContext('2d');
    if (window.animChart) window.animChart.destroy();

    window.animChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `Plot of X_${n}(ω)`,
                data: data,
                borderColor: '#3e95cd',
                stepped: true,
                fill: true,
                backgroundColor: 'rgba(62, 149, 205, 0.2)',
                pointRadius: 0
            }]
        },
        options: {
            animation: false,
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Outcome ω' }, min: 0, max: 1 },
                y: { ticks: { stepSize: 1 }, title: { display: true, text: `Value of X_n(ω)` } }
            },
            plugins: { title: { display: true, text: `Plot of Random Variable X_${n}` } }
        }
    });
}

function startAnimation() {
    stopAnimation(); 
    const blockInput = document.getElementById('block').value;
    const k_max = parseInt(blockInput);

    if (isNaN(k_max) || k_max <= 0) {
        alert("Please enter a positive integer for the block number k to set the animation limit.");
        return;
    }
    if (k_max >= 12) {
        alert("Animating up to a large k may be slow. Consider k < 12.");
    }

    const max_n = Math.pow(2, k_max) - 1;
    let n = 1;

    const speed = 1050 - document.getElementById('speedSlider').value;

    plotAnimatedVariable(n);
    n++;

    animationInterval = setInterval(() => {
        if (n > max_n) {
            stopAnimation();
            return;
        }
        plotAnimatedVariable(n);
        n++;
    }, speed);
}

function stopAnimation() {
    clearInterval(animationInterval);
}

function plotRandomVariable(n, k, width, j_index) {
    const data = [];
    const interval_start = j_index * width;
    const interval_end = (j_index + 1) * width;

    data.push({x: 0, y: 0});
    data.push({x: interval_start, y: 0});
    data.push({x: interval_start, y: 1});
    data.push({x: interval_end, y: 1});
    data.push({x: interval_end, y: 0});
    data.push({x: 1, y: 0});
    
    const ctx = document.getElementById('randomVariablePlot').getContext('2d');
    if (window.rvChart) window.rvChart.destroy();

    window.rvChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `Plot of X_${n}(ω)`,
                data: data,
                borderColor: 'teal',
                stepped: true,
                fill: true,
                backgroundColor: 'rgba(0, 128, 128, 0.2)',
                pointRadius: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Outcome ω' }, min: 0, max: 1 },
                y: { ticks: { stepSize: 1 }, title: { display: true, text: `Value of X_${n}(ω)` } }
            },
            plugins: { title: { display: true, text: `Plot of Random Variable X_${n}` } }
        }
    });
}

function plotOmegaSequence(omega, max_k) {
    const sequence = [];
    const labels = [];
    
    for (let k = 1; k <= max_k; k++) {
        const start_n = Math.pow(2, k - 1);
        const end_n = Math.pow(2, k) - 1;
        const interval_width = Math.pow(2, -(k-1));
        const j = Math.floor(omega / interval_width);
        const active_n = start_n + j;

        for (let n = start_n; n <= end_n; n++) {
            labels.push(n);
            sequence.push(n === active_n ? 1 : 0);
        }
    }
    
    const ctx = document.getElementById('omegaSequencePlot').getContext('2d');
    if (window.seqChart) window.seqChart.destroy();

    window.seqChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Value of X_n(ω) for ω=${omega}`,
                data: sequence,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Index n' } },
                y: { ticks: { stepSize: 1, beginAtZero: true, max: 1 }, title: { display: true, text: 'Value' } }
            },
            plugins: { title: { display: true, text: `Sequence X_n(ω) up to k=${max_k}` } }
        }
    });
}