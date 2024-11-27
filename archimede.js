const circleSvg = d3.select("#circle-animation");
const curveSvg = d3.select("#curve");

const radius = 250;
const center = { x: 350, y: 350 };
const maxSides = 50000;
const maxCurveIterations = 100;

const yScale = d3.scaleLinear().domain([3, 3.3]).range([550, 50]);
const xScale = d3.scaleLinear().domain([0, maxCurveIterations]).range([50, 750]);

// Ajout des axes
const xAxis = d3.axisBottom(xScale).ticks(10);
const yAxis = d3.axisLeft(yScale).ticks(10);

curveSvg.append("g")
.attr("transform", "translate(0,550)")
.call(xAxis);

curveSvg.append("g")
.attr("transform", "translate(50,0)")
.call(yAxis);

// Ajout du cercle
circleSvg.append("circle")
.attr("cx", center.x)
.attr("cy", center.y)
.attr("r", radius)
.attr("fill", "none")
.attr("stroke", "blue")
.attr("stroke-width", 2);

// Ligne pour la valeur de π
curveSvg.append("line")
.attr("x1", 50)
.attr("x2", 750)
.attr("y1", yScale(Math.PI))
.attr("y2", yScale(Math.PI))
.attr("stroke", "green")
.attr("stroke-dasharray", "5,5")
.attr("stroke-width", 2);

curveSvg.append("text")
.attr("x", 760)
.attr("y", yScale(Math.PI))
.attr("dy", "0.35em")
.style("font-size", "16px")
.style("fill", "green")
.text("π");

let n = 4;
const estimates = [];

// Calcul des points d'un polygone
function calculatePolygonPoints(sides, radius) {
    const points = [];
    for (let i = 0; i < sides; i++) {
        const angle = (2 * Math.PI * i) / sides;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        points.push([x, y]);
    }
    return points;
}

    // Calculer les périmètres
function calculatePerimeters(sides) {
    // Périmètre du polygone intérieur (inscrit dans le cercle)
    const inner = sides * 2 * radius * Math.sin(Math.PI / sides);

    // Périmètre du polygone extérieur (circonscrit autour du cercle)
    const outer = sides * 2 * radius * Math.tan(Math.PI / sides);

    return { inner, outer };
}

    // Mettre à jour l'animation
function update() {
    const { inner, outer } = calculatePerimeters(n);
    const piInner = inner / (2 * radius);
    const piOuter = outer / (2 * radius);

    // Ajout des données
    estimates.push({ n, inner: piInner, outer: piOuter });

    // Mise à jour des polygones
    circleSvg.selectAll("polygon").remove();

    // Polygone intérieur
    const innerPoints = calculatePolygonPoints(n, radius);
    circleSvg.append("polygon")
        .attr("points", innerPoints.map(p => p.join(",")).join(" "))
        .attr("fill", "none")
        .attr("stroke", "red");

    // Polygone extérieur
    const outerPoints = calculatePolygonPoints(n, radius / Math.cos(Math.PI / n));
    circleSvg.append("polygon")
        .attr("points", outerPoints.map(p => p.join(",")).join(" "))
        .attr("fill", "none")
        .attr("stroke", "blue");

    // Mise à jour des textes
    d3.select("#info").html(`
        <div>n = <span class="highlight" style="color: green;">${n}</span></div>
        <div>π intérieur = <span class="highlight" style="color: red;">${piInner.toFixed(8)}</span></div>
        <div>π extérieur = <span class="highlight" style="color: blue;">${piOuter.toFixed(8)}</span></div>
    `);

    // Mise à jour de la courbe
    if (estimates.length <= maxCurveIterations) {
        const x = xScale(estimates.length);

        // Ajout de la zone d'intervalle
        curveSvg.append("rect")
        .attr("x", x - 2.5)
        .attr("width", 5)
        .attr("y", yScale(piOuter))
        .attr("height", yScale(piInner) - yScale(piOuter))
        .attr("fill", "rgba(255, 0, 0, 0.2)");

        // Points pour les périmètres
        curveSvg.append("circle")
        .attr("cx", x)
        .attr("cy", yScale(piInner))
        .attr("r", 2)
        .attr("fill", "red");

        curveSvg.append("circle")
        .attr("cx", x)
        .attr("cy", yScale(piOuter))
        .attr("r", 2)
        .attr("fill", "blue");
    }

    const delay = n < 20 ? 1000 : n < 100 ? 150 : n < 500 ? 20 : 1;

    if (n < maxSides) {
        if (n<500) {
            n += 1;
        } else if (n<10000) {
            n += 10
        } else {
            n+= 100
        }
        setTimeout(update, delay);
    }
}

update();