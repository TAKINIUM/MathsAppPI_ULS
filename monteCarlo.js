// Canvas et contextes
const monteCarloCanvas = document.getElementById("monteCarloCanvas");
const monteCarloCtx = monteCarloCanvas.getContext("2d");
const graphCanvas = document.getElementById("graphCanvas");
const graphCtx = graphCanvas.getContext("2d");

const width = monteCarloCanvas.width;
const height = monteCarloCanvas.height;

const totalPoints = 1000000; // Nombre total de points à générer
let insideCircle = 0;
let currentPoint = 0;
let pointsHistory = [];
let curvePoints = [];

// Dessiner le carré et le cercle sur le canvas d'animation
function drawCanvas() {
    // Ne pas effacer le canvas pour conserver tous les points
    // MonteCarloCtx.clearRect(0, 0, width, height); // Ne pas effacer le canvas, afin de garder les points

    // Dessiner le cercle
    monteCarloCtx.beginPath();
    monteCarloCtx.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
    monteCarloCtx.strokeStyle = "black";
    monteCarloCtx.stroke();

    // Dessiner le carré
    monteCarloCtx.strokeRect(0, 0, width, height);
}

// Dessiner la courbe de Monte Carlo sur le canvas du graphique
function drawGraph() {
    // Mise à jour de la courbe
    if (curvePoints.length > 0) {
        chart.data.datasets[0].data = curvePoints.map(p => p.y);  // Mise à jour de la courbe
        chart.data.labels = curvePoints.map(p => p.x);            // Mise à jour des labels
        chart.update();
    }
}

// Fonction pour dessiner un point sur le canvas d'animation
function drawPoint(x, y, isInside, pointSize) {
    monteCarloCtx.beginPath();
    monteCarloCtx.arc(x, y, pointSize, 0, 2 * Math.PI);
    monteCarloCtx.fillStyle = isInside ? "blue" : "red";
    monteCarloCtx.fill();
}

// Fonction principale pour générer les points et mettre à jour l'approximation
function generatePoint() {
    if (currentPoint >= totalPoints) return;

    const pointsPerFrame = 1;  // Réduction drastique du nombre de points générés par frame

    for (let i = 0; i < pointsPerFrame && currentPoint < totalPoints; i++) {
        // Générer un point aléatoire dans le carré
        const x = Math.random();
        const y = Math.random();

        // Coordonner dans le canvas
        const canvasX = x * width;
        const canvasY = y * height;

        // Vérifier si le point est dans le cercle
        const isInside = (x - 0.5) ** 2 + (y - 0.5) ** 2 <= 0.25;
        if (isInside) insideCircle++;

        // Enregistrer l'historique des points pour la courbe
        pointsHistory.push({ x, y, isInside });

        // Calculer la taille des points
        const pointSize = 5 - Math.min(currentPoint / 10000, 1) * 4;
        drawPoint(canvasX, canvasY, isInside, pointSize);

        currentPoint++;
    }

    // Calculer l'approximation de π
    const piApproximation = (insideCircle / currentPoint) * 4;

    // Enregistrer la donnée pour la courbe
    curvePoints.push({x: currentPoint, y: piApproximation}); // Ajout de l'approximation à l'historique des points

    // Mettre à jour l'info sous le graphique
    document.getElementById("info").textContent = `Approximation de π : ${piApproximation.toFixed(6)} (Points générés : ${currentPoint})`;

    // Mettre à jour le graphique instantanément
    drawCanvas();
    drawGraph();

    // Requête pour la prochaine frame (réduit la vitesse d'animation)
    setTimeout(() => requestAnimationFrame(generatePoint), 100); // Délai de 100ms entre chaque frame pour ralentir l'animation
}

// Initialisation du graphique Chart.js
const chart = new Chart(graphCtx, {
    type: 'line',
    data: {
        labels: [], // Les labels de l'axe X, seront mis à jour après chaque point
        datasets: [{
            label: 'Approximation de π',
            data: [], // Les données seront mises à jour au fur et à mesure
            borderColor: 'green',
            fill: false, // Pas de remplissage sous la courbe, et pas de points visibles
            lineTension: 0.1, // Légèrement courbé
            borderWidth: 1, // Ligne plus fine
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,  // Fixe la taille du graphique
        scales: {
            y: {
                beginAtZero: false,
                max: 3.3, // Limiter la valeur maximale à 3.3
                min: 3,   // Limiter la valeur minimale à 3
            },
            x: {
                max: 1000, // Limiter l'axe des X à 1000
                ticks: {
                    stepSize: 100,  // Les ticks sont espacés de 100
                }
            }
        },
        plugins: {
            // Ajout de la ligne de référence pour π
            annotation: {
                annotations: [{
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y',
                    value: Math.PI,
                    borderColor: 'red', // Couleur visible et différente pour la ligne
                    borderWidth: 2,
                }],
            }
        }
    }
});

// Initialiser l'animation
drawCanvas();
generatePoint();