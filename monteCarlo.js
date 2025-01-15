// Canvas et contextes
const monteCarloCanvas = document.getElementById("monteCarloCanvas");
const monteCarloCtx = monteCarloCanvas.getContext("2d");
const graphCanvas = document.getElementById("graphCanvas");
const graphCtx = graphCanvas.getContext("2d");

const width = monteCarloCanvas.width;
const height = monteCarloCanvas.height;

const totalPoints = 50000000;
let insideCircle = 0;
let currentPoint = 0;
let pointsHistory = [];
let curvePoints = [];

function drawCanvas() {


    monteCarloCtx.beginPath();
    monteCarloCtx.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
    monteCarloCtx.strokeStyle = "black";
    monteCarloCtx.stroke();


    monteCarloCtx.strokeRect(0, 0, width, height);
}


function drawGraph() {

    if (curvePoints.length > 0) {
        chart.data.datasets[0].data = curvePoints.map(p => p.y); 
        chart.data.labels = curvePoints.map(p => p.x);
        chart.update();
    }
}

function drawPoint(x, y, isInside, pointSize) {
    monteCarloCtx.beginPath();
    monteCarloCtx.arc(x, y, pointSize, 0, 2 * Math.PI);
    monteCarloCtx.fillStyle = isInside ? "blue" : "red";
    monteCarloCtx.fill();
}

function generatePoint() {
    if (currentPoint >= totalPoints) return;

    let pointsPerFrame = 1;

    for (let i = 0; i < pointsPerFrame && currentPoint < totalPoints; i++) {

        const x = Math.random();
        const y = Math.random();

        const canvasX = x * width;
        const canvasY = y * height;
        const isInside = (x - 0.5) ** 2 + (y - 0.5) ** 2 <= 0.25;
        if (isInside) insideCircle++;

        pointsHistory.push({ x, y, isInside });

        const pointSize = 5 - Math.min(currentPoint / 10000, 1) * 4;
        drawPoint(canvasX, canvasY, isInside, pointSize);

        currentPoint++;
        if (currentPoint >= 1000 && currentPoint < 5000) {
            pointsPerFrame = 10;
        } else if (currentPoint >= 5000 && currentPoint < 20000){
            pointsPerFrame = 100;
        } else if (currentPoint >= 20000 && currentPoint < 200000) {
            pointsPerFrame = 1000;
        } else if (currentPoint >= 200000) {
            pointsPerFrame = 50000;
        }
    }

    const piApproximation = (insideCircle / currentPoint) * 4;

    curvePoints.push({x: currentPoint, y: piApproximation});

    document.getElementById("info").textContent = `Approximation de π : ${piApproximation.toFixed(6)} (Points générés : ${currentPoint})`;

    drawCanvas();
    drawGraph();

    setTimeout(() => requestAnimationFrame(generatePoint), 1);
}

const chart = new Chart(graphCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Approximation de π',
            data: [],
            borderColor: 'green',
            fill: false,
            lineTension: 0.1,
            borderWidth: 0.5,
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: false,
                max: 3.3,
                min: 3,
            },
            x: {
                max: 50000000,
                ticks: {
                    stepSize: 1,
                }
            }
        },
        plugins: {
            annotation: {
                annotations: [{
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y',
                    value: Math.PI,
                    borderColor: 'red',
                    borderWidth: 2,
                }],
            }
        }
    }
});

// Initialiser l'animation
drawCanvas();
generatePoint();