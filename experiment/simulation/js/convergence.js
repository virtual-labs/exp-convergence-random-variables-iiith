function runConvergence() {
    const omegaInput = document.getElementById('omega').value;
    const blockInput = document.getElementById('block').value;
    const observations = document.getElementById('observations');

    observations.innerHTML = ""; // Clear previous

    const omega = parseFloat(omegaInput);
    const k = parseInt(blockInput);

    if (isNaN(omega) || omega <= 0 || omega >= 1) {
        observations.innerHTML = `<div id="error">Please enter a valid omega in (0, 1).</div>`;
        return;
    }

    if (isNaN(k) || k <= 0) {
        observations.innerHTML = `<div id="error">Please enter a positive integer for block number.</div>`;
        return;
    }

    if (k >= 12) {
        observations.innerHTML = `<div id="error">Block number very large. Results will be visually unobservable. Choose a smaller block number.</div>`;
        return;
    }

    const start = Math.pow(2, k - 1);
    const end = Math.pow(2, k) - 1;
    let foundIndex = -1;
    // console.log(start, end, omega, k);
    for (let n = start; n <= end; n++){
        j = n-Math.pow(2, k-1);
        if (omega >j*Math.pow(2,-(k-1)) && omega<=(j+1)*Math.pow(2,-(k-1)))
        {
            foundIndex = n;
            break;
        }
        // if (omega <= 1 / n) {
        //     foundIndex = n;
        //     break;
        // }
    }

    if (foundIndex === -1) {
        observations.innerHTML = `<div id="error">No X_n in block k = ${k} satisfies X_n(omega) = 1.</div>`;
        return;
    }

    // Display result
    observations.innerHTML = `
        <b>For ω = ${omega}, in block k = ${k}, X_${foundIndex}(ω) = 1</b><br>
    `;

    plotRandomVariable(foundIndex, k);
    plotOmegaSequence(foundIndex, omega, k);
}

function plotRandomVariable(n, k) {
    const data = [];
    const step = 0.001;
    const j = n - Math.pow(2, k-1);
    for (let omega = 0; omega <= 1; omega += step) {
        data.push({
            x: omega,
            y: (omega >j*Math.pow(2,-(k-1)) && omega<=(j+1)*Math.pow(2,-(k-1))) ? 1 : 0
        });
    }

    const ctx = document.getElementById('randomVariablePlot').getContext('2d');
    if (window.rvChart) window.rvChart.destroy();

    window.rvChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `X_${n}(ω)`,
                data: data,
                borderColor: 'teal',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                x: { type: 'linear', title: { display: true, text: 'ω' } },
                y: { ticks: { stepSize: 1 }, title: { display: true, text: `X_${n}(ω)` } }
            },
            plugins: {
                legend: { display: true }
            }
        }
    });
}

function plotOmegaSequence(n, omega, k) {
    const sequence = [];

    for (let block=1;block<=k;block++){
        const start = Math.pow(2, block - 1);
        const end = Math.pow(2, block) - 1;
        let foundIndex = -1;
        console.log(start, end, omega, block);
        for (let nn = start; nn <= end; nn++){
            j = nn-Math.pow(2, block-1);
            if (omega >j*Math.pow(2,-(block-1)) && omega<=(j+1)*Math.pow(2,-(block-1)))
            {
                foundIndex = nn;
                break;
            }
        }
        for (index=start; index<=end; index++){
            if (index === foundIndex) {
                sequence.push(1);
            } else {
                sequence.push(0);
            }
        }
    
    }

    // for (let i = 1; i <= n; i++) {
    //     j = i - Math.pow(2, k-1);
    //     sequence.push((omega >j*Math.pow(2,-(k-1)) && omega<=(j+1)*Math.pow(2,-(k-1))) ? 1 : 0);
    // }

    const labels = Array.from({ length: n }, (_, i) => i + 1);
    const ctx = document.getElementById('omegaSequencePlot').getContext('2d');
    if (window.seqChart) window.seqChart.destroy();

    window.seqChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Sequence X_n(ω)`,
                data: sequence,
                borderColor: 'blue',
                borderWidth: 2,
                fill: false,
                pointRadius: 3
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'n' } },
                y: {
                    ticks: { stepSize: 1, beginAtZero: true, max: 1 },
                    title: { display: true, text: `X_n(ω)` }
                }
            },
            plugins: {
                legend: { display: true }
            }
        }
    });
}
