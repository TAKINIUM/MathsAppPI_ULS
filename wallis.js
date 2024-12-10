const iterations = 1000;
const displayLimit = 200;
let product = 1;
let values = [];
let animationSpeed = 400;
let stopThreshold = 0.00001;

const width = 800, height = 400;
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const xScale = d3.scaleLinear()
  .domain([0, displayLimit])
  .range([50, width - 50]);

const yScale = d3.scaleLinear()
  .domain([1.2, 2])
  .range([height - 50, 50]);

const xAxis = d3.axisBottom(xScale).ticks(10);
const yAxis = d3.axisLeft(yScale).ticks(10);

svg.append("g")
  .attr("transform", `translate(0, ${height - 50})`)
  .call(xAxis);

svg.append("g")
  .attr("transform", `translate(50, 0)`)
  .call(yAxis);

// Ligne de la courbe
const line = d3.line()
  .x((d, i) => xScale(i))
  .y(d => yScale(d))
  .curve(d3.curveLinear);

const path = svg.append("path")
  .datum(values)
  .attr("fill", "none")
  .attr("stroke", "blue")
  .attr("stroke-width", 2);

// Texte affichant la valeur dynamique de \(\pi/2\)
const piText = svg.append("text")
  .attr("x", xScale(10))
  .attr("y", yScale(1.95))
  .attr("fill", "red")
  .style("font-size", "14px")
  .text(`π/2 ≈ ${product.toFixed(10)}`);

// Ajout de la ligne verte pour \(\pi/2\)
const piLine = svg.append("line")
  .attr("x1", xScale(0))
  .attr("y1", yScale(Math.PI / 2))
  .attr("x2", xScale(displayLimit))
  .attr("y2", yScale(Math.PI / 2))
  .attr("stroke", "green")
  .attr("stroke-width", 2)
  .attr("stroke-dasharray", "4"); // Ligne en pointillés

// Fonction pour formater la formule avec ellipses
function formatFormula(terms, maxTerms = 10) {
  if (terms.length <= maxTerms) {
    return terms.join(" \\cdot ");
  }
  const firstPart = terms.slice(0, maxTerms / 2);
  const lastPart = terms.slice(-maxTerms / 2);
  return [...firstPart, "\\dots", ...lastPart].join(" \\cdot ");
}

// Fonction pour animer le produit de Wallis
function animateWallis(iteration) {
  if (iteration > iterations) return;

  const numerator = iteration % 2 === 0 ? iteration + 2 : iteration + 1;
  const denominator = iteration % 2 === 0 ? iteration + 1 : iteration + 2;
  const fraction = numerator / denominator;

  product *= fraction;

  // Mettre à jour les données affichées (limitées aux 100 premières itérations)
  if (iteration < displayLimit) {
    values.push(product);
  }

  // Mettre à jour la formule affichée
  const terms = Array.from({ length: iteration + 1 }, (_, i) => {
    const num = i % 2 === 0 ? i + 2 : i + 1;
    const denom = i % 2 === 0 ? i + 1 : i + 2;
    return `\\frac{${num}}{${denom}}`;
  });
  const truncatedFormula = formatFormula(terms);
  document.getElementById("formula").innerHTML = `\\( P = ${truncatedFormula} \\)`;

  // Mettre à jour le graphique
  if (iteration < displayLimit) {
    path.datum(values)
      .attr("d", line);
  }

  // Mettre à jour la valeur dynamique de π/2
  piText.text(`π/2 ≈ ${product.toFixed(10)}`);

  // Redessiner les mathématiques
  MathJax.typeset();

  // Ajuster la vitesse de l'animation
  if (iteration < 20) {
    animationSpeed = 400; // Lent au début
  } else if (iteration < 100) {
    animationSpeed = 20; // Plus rapide
  } else if (Math.abs(product - Math.PI / 2) < stopThreshold) {
    document.getElementById("formula").innerHTML += `<br>\\( P \\approx ${product.toFixed(10)} \\)`;
    return; // Stopper l'animation
  } else {
    animationSpeed = 0.25; // Très rapide
  }

  // Prochaine itération
  setTimeout(() => animateWallis(iteration + 1), animationSpeed);
}

// Initialiser l'animation
animateWallis(0);
