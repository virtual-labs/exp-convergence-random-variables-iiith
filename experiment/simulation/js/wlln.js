document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const distributionType = document.getElementById('distribution-type');
    const parameterControls = document.getElementById('parameter-controls');
    const sampleSizeSlider = document.getElementById('sample-size');
    const sampleSizeValue = document.getElementById('sample-size-value');
    const runBtn = document.getElementById('run-btn');
    const resetBtn = document.getElementById('reset-btn');
    const theoreticalMean = document.getElementById('theoretical-mean');
    const currentMean = document.getElementById('current-mean');
    const absoluteError = document.getElementById('absolute-error');
    const convergenceRate = document.getElementById('convergence-rate');
    
    // Chart setup
    const ctx = document.getElementById('convergence-chart').getContext('2d');
    let convergenceChart;
    
    // Distribution parameters
    let params = {
        bernoulli: { p: 0.5 },
        uniform: { a: 0, b: 1 },
        normal: { mu: 0, sigma: 1 },
        exponential: { lambda: 1 }
    };
    
    // Current distribution
    let currentDist = 'bernoulli';
    
    // Initialize
    updateParameterControls();
    updateSampleSizeValue();
    
    // Event listeners
    distributionType.addEventListener('change', function() {
        currentDist = this.value;
        updateParameterControls();
    });
    
    sampleSizeSlider.addEventListener('input', updateSampleSizeValue);
    runBtn.addEventListener('click', runExperiment);
    resetBtn.addEventListener('click', resetExperiment);
    
    // Functions
    // function updateParameterControls() {
    //     let html = '';
        
    //     switch(currentDist) {
    //         case 'bernoulli':
    //             html = `
    //                 <div class="field">
    //                     <label class="label">Probability (p)</label>
    //                     <input id="bernoulli-p" class="input" type="number" min="0" max="1" step="0.01" value="${params.bernoulli.p}">
    //                 </div>
    //             `;
    //             break;
    //         case 'uniform':
    //             html = `
    //                 <div class="field">
    //                     <label class="label">Min (a)</label>
    //                     <input id="uniform-a" class="input" type="number" value="${params.uniform.a}">
    //                 </div>
    //                 <div class="field">
    //                     <label class="label">Max (b)</label>
    //                     <input id="uniform-b" class="input" type="number" value="${params.uniform.b}">
    //                 </div>
    //             `;
    //             break;
    //         case 'normal':
    //             html = `
    //                 <div class="field">
    //                     <label class="label">Mean (µ)</label>
    //                     <input id="normal-mu" class="input" type="number" value="${params.normal.mu}">
    //                 </div>
    //                 <div class="field">
    //                     <label class="label">Std Dev (σ)</label>
    //                     <input id="normal-sigma" class="input" type="number" min="0" step="0.1" value="${params.normal.sigma}">
    //                 </div>
    //             `;
    //             break;
    //         case 'exponential':
    //             html = `
    //                 <div class="field">
    //                     <label class="label">Rate (λ)</label>
    //                     <input id="exponential-lambda" class="input" type="number" min="0.1" step="0.1" value="${params.exponential.lambda}">
    //                 </div>
    //             `;
    //             break;
    //     }
        
    //     parameterControls.innerHTML = html;
    //     updateTheoreticalMean();
    // }

    function updateParameterControls() {
        let html = '';
        
        switch(currentDist) {
            case 'bernoulli':
                html = `
                    <div class="field is-horizontal">
                        <div class="field-body">
                            <div class="field">
                                <label class="label">Probability (p)</label>
                                <div class="control">
                                    <input id="bernoulli-p" class="input" type="number" min="0" max="1" step="0.01" value="${params.bernoulli.p}">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'uniform':
                html = `
                    <div class="field is-horizontal">
                        <div class="field-body">
                            <div class="field">
                                <label class="label">Min (a)</label>
                                <div class="control">
                                    <input id="uniform-a" class="input" type="number" value="${params.uniform.a}">
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Max (b)</label>
                                <div class="control">
                                    <input id="uniform-b" class="input" type="number" value="${params.uniform.b}">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'normal':
                html = `
                    <div class="field is-horizontal">
                        <div class="field-body">
                            <div class="field">
                                <label class="label">Mean (µ)</label>
                                <div class="control">
                                    <input id="normal-mu" class="input" type="number" value="${params.normal.mu}">
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Std Dev (σ)</label>
                                <div class="control">
                                    <input id="normal-sigma" class="input" type="number" min="0" step="0.1" value="${params.normal.sigma}">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'exponential':
                html = `
                    <div class="field is-horizontal">
                        <div class="field-body">
                            <div class="field">
                                <label class="label">Rate (λ)</label>
                                <div class="control">
                                    <input id="exponential-lambda" class="input" type="number" min="0.1" step="0.1" value="${params.exponential.lambda}">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }
        
        parameterControls.innerHTML = html;
        updateTheoreticalMean();
    }

    function updateSampleSizeValue() {
        sampleSizeValue.textContent = sampleSizeSlider.value;
    }
    
    function updateTheoreticalMean() {
        let mean;
        
        switch(currentDist) {
            case 'bernoulli':
                mean = document.getElementById('bernoulli-p')?.value || params.bernoulli.p;
                break;
            case 'uniform':
                const a = document.getElementById('uniform-a')?.value || params.uniform.a;
                const b = document.getElementById('uniform-b')?.value || params.uniform.b;
                mean = (parseFloat(a) + parseFloat(b)) / 2;
                break;
            case 'normal':
                mean = document.getElementById('normal-mu')?.value || params.normal.mu;
                break;
            case 'exponential':
                const lambda = document.getElementById('exponential-lambda')?.value || params.exponential.lambda;
                mean = 1 / parseFloat(lambda);
                break;
        }
        
        theoreticalMean.textContent = parseFloat(mean).toFixed(4);
    }
    
    function runExperiment() {
        // Get parameters
        let distParams = {};
        let sampleMean = 0;
        const maxSamples = parseInt(sampleSizeSlider.value);
        const step = Math.max(1, Math.floor(maxSamples / 200)); // Number of points to plot
        const means = [];
        const sampleCounts = [];
        
        // Update theoretical mean
        updateTheoreticalMean();
        const trueMean = parseFloat(theoreticalMean.textContent);
        
        // Generate random variables based on distribution
        switch(currentDist) {
            case 'bernoulli':
                distParams.p = parseFloat(document.getElementById('bernoulli-p').value);
                break;
            case 'uniform':
                distParams.a = parseFloat(document.getElementById('uniform-a').value);
                distParams.b = parseFloat(document.getElementById('uniform-b').value);
                break;
            case 'normal':
                distParams.mu = parseFloat(document.getElementById('normal-mu').value);
                distParams.sigma = parseFloat(document.getElementById('normal-sigma').value);
                break;
            case 'exponential':
                distParams.lambda = parseFloat(document.getElementById('exponential-lambda').value);
                break;
        }
        
        // Generate samples and compute running mean
        let sum = 0;
        for (let n = 1; n <= maxSamples; n++) {
            const x = generateRandomVariable(currentDist, distParams);
            sum += x;
            
            if (n % step === 0 || n === maxSamples) {
                means.push(sum / n);
                sampleCounts.push(n);
                
                // Update display for the last point
                if (n === maxSamples) {
                    currentMean.textContent = (sum / n).toFixed(4);
                    absoluteError.textContent = Math.abs(sum / n - trueMean).toFixed(4);
                }
            }
        }
        
        // Calculate convergence rate (approximate)
        // const lastQuarter = Math.floor(means.length * 0.75);
        // if (lastQuarter > 10) {
        //     const rates = [];
        //     for (let i = lastQuarter; i < means.length - 1; i++) {
        //         rates.push(Math.abs(means[i+1] - trueMean) / Math.abs(means[i] - trueMean));
        //     }
        //     const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
        //     convergenceRate.textContent = avgRate.toFixed(4);
        // } else {
        //     convergenceRate.textContent = "N/A";
        // }
        
        // Create or update chart
        if (convergenceChart) {
            convergenceChart.data.labels = sampleCounts;
            convergenceChart.data.datasets[0].data = means;
            convergenceChart.data.datasets[1].data = Array(sampleCounts.length).fill(trueMean);
            convergenceChart.update();
        } else {
            convergenceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: sampleCounts,
                    datasets: [
                        {
                            label: 'Sample Mean',
                            data: means,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1,
                            pointRadius: 0
                        },
                        {
                            label: 'Theoretical Mean (µ)',
                            data: Array(sampleCounts.length).fill(trueMean),
                            borderColor: 'rgb(255, 99, 132)',
                            borderWidth: 1,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Number of Samples (n)'
                            },
                            type: 'linear'
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Sample Mean'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Convergence of Sample Mean to Theoretical Mean'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.y.toFixed(4)}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    function resetExperiment() {
        if (convergenceChart) {
            convergenceChart.destroy();
            convergenceChart = null;
        }
        currentMean.textContent = '-';
        absoluteError.textContent = '-';
        convergenceRate.textContent = '-';
    }
    
    function generateRandomVariable(dist, params) {
        switch(dist) {
            case 'bernoulli':
                return Math.random() < params.p ? 1 : 0;
            case 'uniform':
                return params.a + Math.random() * (params.b - params.a);
            case 'normal':
                // Box-Muller transform
                let u = 0, v = 0;
                while(u === 0) u = Math.random();
                while(v === 0) v = Math.random();
                const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
                return params.mu + z * params.sigma;
            case 'exponential':
                return -Math.log(1 - Math.random()) / params.lambda;
            default:
                return 0;
        }
    }
    
    // Update theoretical mean when parameters change
    parameterControls.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT') {
            updateTheoreticalMean();
        }
    });
});