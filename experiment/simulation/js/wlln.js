document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const distributionType = document.getElementById('distribution-type');
    const parameterControls = document.getElementById('parameter-controls');
    const sampleSizeSlider = document.getElementById('sample-size');
    const sampleSizeValue = document.getElementById('sample-size-value');
    const runBtn = document.getElementById('run-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Observation panel elements
    const obsContext = document.getElementById('obs-context');
    const obsRealtime = document.getElementById('obs-realtime');
    const obsConclusion = document.getElementById('obs-conclusion');
    const currentMeanSpan = document.getElementById('current-mean');
    const absoluteErrorSpan = document.getElementById('absolute-error');
    const conclusionText = document.getElementById('conclusion-text');
    
    // Chart and animation state
    const ctx = document.getElementById('convergence-chart').getContext('2d');
    let convergenceChart;
    let animationFrameId = null;

    let params = {
        bernoulli: { p: 0.5 }, uniform: { a: 0, b: 1 },
        normal: { mu: 0, sigma: 1 }, exponential: { lambda: 1 }
    };
    let currentDist = 'bernoulli';
    
    // --- INITIALIZATION ---
    updateParameterControls();
    
    // --- EVENT LISTENERS ---
    distributionType.addEventListener('change', () => { currentDist = distributionType.value; updateParameterControls(); });
    sampleSizeSlider.addEventListener('input', () => { sampleSizeValue.textContent = sampleSizeSlider.value; });
    runBtn.addEventListener('click', runExperiment);
    resetBtn.addEventListener('click', resetExperiment);
    parameterControls.addEventListener('input', (e) => { if (e.target.tagName === 'INPUT') updateTheoreticalMean(); });

    // --- CORE FUNCTIONS ---
    function updateParameterControls() {
        let html = '';
        switch(currentDist) {
            case 'bernoulli': html = `<div class="param-item"><label>p:</label><input id="bernoulli-p" type="number" min="0" max="1" step="0.01" value="${params.bernoulli.p}"></div>`; break;
            case 'uniform': html = `<div class="param-item"><label>a:</label><input id="uniform-a" type="number" value="${params.uniform.a}"></div><div class="param-item"><label>b:</label><input id="uniform-b" type="number" value="${params.uniform.b}"></div>`; break;
            case 'normal': html = `<div class="param-item"><label>µ:</label><input id="normal-mu" type="number" value="${params.normal.mu}"></div><div class="param-item"><label>σ:</label><input id="normal-sigma" type="number" min="0" step="0.1" value="${params.normal.sigma}"></div>`; break;
            case 'exponential': html = `<div class="param-item"><label>λ:</label><input id="exponential-lambda" type="number" min="0.1" step="0.1" value="${params.exponential.lambda}"></div>`; break;
        }
        parameterControls.innerHTML = html;
        updateTheoreticalMean();
    }
    
    function getTheoreticalMean() {
        const distParams = getDistParams();
        switch(currentDist) {
            case 'bernoulli': return distParams.p;
            case 'uniform': return (distParams.a + distParams.b) / 2;
            case 'normal': return distParams.mu;
            case 'exponential': return 1 / distParams.lambda;
        }
    }
    
    function updateTheoreticalMean() {
        const mean = getTheoreticalMean();
        const theoreticalMeanSpan = document.querySelector('#obs-context #theoretical-mean');
        if (theoreticalMeanSpan) {
            theoreticalMeanSpan.textContent = mean.toFixed(4);
        }
    }

    function runExperiment() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        runBtn.disabled = true;
        resetBtn.disabled = true;

        const trueMean = getTheoreticalMean();
        const maxSamples = parseInt(sampleSizeSlider.value);
        const distParams = getDistParams();
        
        obsContext.innerHTML = `
            <h4>Experiment Setup</h4>
            <p><strong>Distribution:</strong> <span class="result-highlight">${currentDist.charAt(0).toUpperCase() + currentDist.slice(1)}</span></p>
            <p><strong>Theoretical Mean (µ):</strong> <span id="theoretical-mean" class="result-highlight">${trueMean.toFixed(4)}</span></p>
        `;
        obsRealtime.style.display = 'block';
        obsConclusion.style.display = 'none';

        const { yMin, yMax } = getFixedYAxisRange(currentDist, distParams, trueMean);

        let sum = 0;
        let n = 0;
        const animationDuration = 5000;
        let startTime = null;

        if (convergenceChart) convergenceChart.destroy();
        convergenceChart = createChart(trueMean, yMin, yMax);

        function animationStep(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            const targetN = Math.floor(progress * maxSamples);

            if (targetN > n) {
                for (let i = n + 1; i <= targetN; i++) {
                    sum += generateRandomVariable(currentDist, distParams);
                }
                n = targetN;

                if (n > 0) {
                    const sampleMean = sum / n;
                    convergenceChart.data.labels.push(n);
                    convergenceChart.data.datasets[0].data.push(sampleMean);
                    convergenceChart.data.datasets[1].data.push(trueMean);
                    currentMeanSpan.textContent = sampleMean.toFixed(4);
                    absoluteErrorSpan.textContent = Math.abs(sampleMean - trueMean).toFixed(4);
                }
            }
            convergenceChart.update('none');

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animationStep);
            } else {
                // --- DYNAMIC CONCLUSION LOGIC ---
                const finalMean = sum / maxSamples;
                const finalError = Math.abs(finalMean - trueMean);
                let conclusionString = '';

                // Use relative error, but fall back to absolute error if mean is close to zero
                const relativeError = trueMean !== 0 ? finalError / Math.abs(trueMean) : Infinity;
                const isErrorSmall = trueMean !== 0 ? relativeError < 0.05 : finalError < 0.05;

                if (maxSamples > 500 && isErrorSmall) {
                    conclusionString = `With a large number of samples (n=${maxSamples}), the final sample mean (${finalMean.toFixed(4)}) is extremely close to the theoretical mean. The small final error visually confirms the WLLN: the sample average reliably converges as n increases.`;
                } else if (maxSamples <= 500 && isErrorSmall) {
                    conclusionString = `Even with a relatively small number of samples (n=${maxSamples}), the sample mean (${finalMean.toFixed(4)}) landed close to the theoretical mean. While this is consistent with the WLLN, try running the experiment with a larger n to see a more reliable convergence.`;
                } else if (maxSamples > 500 && !isErrorSmall) {
                    conclusionString = `With a large n=${maxSamples} samples, the sample mean (${finalMean.toFixed(4)}) is still somewhat far from the theoretical mean. This demonstrates that convergence can be slow, especially for high-variance distributions. The WLLN guarantees convergence as n approaches infinity.`;
                } else { // maxSamples <= 500 && !isErrorSmall
                    conclusionString = `With a small number of samples (n=${maxSamples}), the sample mean (${finalMean.toFixed(4)}) has not yet converged. The relatively large error is expected for small n. Increase the number of samples to see the WLLN in effect.`;
                }

                conclusionText.textContent = conclusionString;
                obsConclusion.style.display = 'block';
                runBtn.disabled = false;
                resetBtn.disabled = false;
            }
        }
        
        animationFrameId = requestAnimationFrame(animationStep);
    }
    
    function getFixedYAxisRange(dist, params, mean) {
        let stdDev, range, yMin, yMax;
        switch(dist) {
            case 'bernoulli': return { yMin: -0.1, yMax: 1.1 };
            case 'uniform':
                range = Math.abs(params.b - params.a);
                return { yMin: params.a - 0.1 * range, yMax: params.b + 0.1 * range };
            case 'normal':
                stdDev = params.sigma;
                yMin = mean - 4 * stdDev;
                yMax = mean + 4 * stdDev;
                return { yMin, yMax };
            case 'exponential':
                stdDev = 1 / params.lambda; // Same as mean
                yMin = -0.1 * (mean + 4 * stdDev);
                yMax = mean + 4 * stdDev;
                return { yMin, yMax };
            default: return {};
        }
    }

    function resetExperiment() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (convergenceChart) convergenceChart.destroy();
        animationFrameId = null;
        convergenceChart = null;
        
        obsContext.innerHTML = `<p class="placeholder">Configure your experiment and click "Run" to see the analysis.</p>`;
        obsRealtime.style.display = 'none';
        obsConclusion.style.display = 'none';
        currentMeanSpan.textContent = '-';
        absoluteErrorSpan.textContent = '-';
        runBtn.disabled = false;
    }
    
    function createChart(trueMean, yMin, yMax) {
        return new Chart(ctx, {
            type: 'line',
            data: { labels: [], datasets: [
                {
                    label: 'Sample Mean', data: [], borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)', borderWidth: 2.5,
                    tension: 0.1, pointRadius: 0
                },
                {
                    label: 'Theoretical Mean (µ)', data: [], borderColor: 'rgb(255, 159, 64)',
                    borderWidth: 2.5, pointRadius: 0, borderDash: [6, 6]
                }
            ]},
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Number of Samples (n)' }, type: 'linear', beginAtZero: true },
                    y: { title: { display: true, text: 'Sample Mean' }, min: yMin, max: yMax }
                },
                plugins: {
                    title: { display: true, text: 'Convergence of Sample Mean' },
                    tooltip: { enabled: false }
                },
                animation: false
            }
        });
    }

    function getDistParams() {
        const p = {};
        switch(currentDist) {
            case 'bernoulli': p.p = parseFloat(document.getElementById('bernoulli-p').value); break;
            case 'uniform': p.a = parseFloat(document.getElementById('uniform-a').value); p.b = parseFloat(document.getElementById('uniform-b').value); break;
            case 'normal': p.mu = parseFloat(document.getElementById('normal-mu').value); p.sigma = parseFloat(document.getElementById('normal-sigma').value); break;
            case 'exponential': p.lambda = parseFloat(document.getElementById('exponential-lambda').value); break;
        }
        return p;
    }

    function generateRandomVariable(dist, params) {
        switch(dist) {
            case 'bernoulli': return Math.random() < params.p ? 1 : 0;
            case 'uniform': return params.a + Math.random() * (params.b - params.a);
            case 'normal':
                let u=0,v=0; while(u===0)u=Math.random(); while(v===0)v=Math.random();
                return params.mu + Math.sqrt(-2.0*Math.log(u))*Math.cos(2.0*Math.PI*v)*params.sigma;
            case 'exponential': return -Math.log(1 - Math.random()) / params.lambda;
            default: return 0;
        }
    }
});