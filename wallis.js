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

// Echelles
const xScale = d3.scaleLinear()
  .domain([0, displayLimit])
  .range([50, width - 50]);

const yScale = d3.scaleLinear()
  .domain([1.2, 2])
  .range([height - 50, 50]);

// Axes
const xAxis = d3.axisBottom(xScale).ticks(10);
const yAxis = d3.axisLeft(yScale).ticks(10);

svg.append("g")
  .attr("transform", `translate(0, ${height - 50})`)
  .call(xAxis);

svg.append("g")
  .attr("transform", `translate(50, 0)`)
  .call(yAxis);

// Lignes de courbe
const line = d3.line()
  .x((d, i) => xScale(i))
  .y(d => yScale(d))
  .curve(d3.curveLinear);

const path = svg.append("path")
  .datum(values)
  .attr("fill", "none")
  .attr("stroke", "blue")
  .attr("stroke-width", 2);

// Texte affichant π/2
const piText = svg.append("text")
  .attr("x", xScale(10))
  .attr("y", yScale(1.95))
  .attr("fill", "red")
  .style("font-size", "14px")
  .text(`π/2 ≈ ${product.toFixed(10)}`);

// Ligne horizontale à π/2
const piLine = svg.append("line")
  .attr("x1", xScale(0))
  .attr("y1", yScale(Math.PI / 2))
  .attr("x2", xScale(displayLimit))
  .attr("y2", yScale(Math.PI / 2))
  .attr("stroke", "green")
  .attr("stroke-width", 2)
  .attr("stroke-dasharray", "4");

// Ajout de légendes pour les axes
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height - 10)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Nombre d'itérations");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", 20)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Valeur approchée de P");

// Ajout du texte pour la valeur de π
const piValueText = svg.append("text")
  .attr("x", width / 2)
  .attr("y", height - 30)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("fill", "blue")
  .text(`π ≈ ${(2 * product).toFixed(10)}`);

// Formatage de la formule MathJax
function formatFormula(terms, maxTerms = 10) {
  if (terms.length <= maxTerms) {
    return terms.join(" \\cdot ");
  }
  const firstPart = terms.slice(0, maxTerms / 2);
  const lastPart = terms.slice(-maxTerms / 2);
  return [...firstPart, "\\dots", ...lastPart].join(" \\cdot ");
}

// Animation de la méthode de Wallis
function animateWallis(iteration) {
  if (iteration > iterations) return;

  const numerator = iteration % 2 === 0 ? iteration + 2 : iteration + 1;
  const denominator = iteration % 2 === 0 ? iteration + 1 : iteration + 2;
  const fraction = numerator / denominator;

  product *= fraction;

  if (iteration < displayLimit) {
    values.push(product);
  }

  const terms = Array.from({ length: iteration + 1 }, (_, i) => {
    const num = i % 2 === 0 ? i + 2 : i + 1;
    const denom = i % 2 === 0 ? i + 1 : i + 2;
    return `\\frac{${num}}{${denom}}`;
  });
  const truncatedFormula = formatFormula(terms);
  document.getElementById("formula").innerHTML = `\\( P = ${truncatedFormula} \\)`;

  if (iteration < displayLimit) {
    path.datum(values)
      .attr("d", line);
  }

  piText.text(`π/2 ≈ ${product.toFixed(15)}`);
  piValueText.text(`π ≈ ${(2 * product).toFixed(15)}`);

  MathJax.typeset();

  if (iteration < 20) {
    animationSpeed = 400; 
  } else if (iteration < 100) {
    animationSpeed = 20;
  } else if (Math.abs(product - Math.PI / 2) < stopThreshold) {
    document.getElementById("formula").innerHTML += `<br>\\( P \\approx ${product.toFixed(10)} \\)`;
    return;
  } else {
    animationSpeed = 0.25; 
  }

  setTimeout(() => animateWallis(iteration + 1), animationSpeed);
}

animateWallis(0);