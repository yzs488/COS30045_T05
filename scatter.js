(function () {
  const width = 500, height = 340;
  const margin = { top: 20, right: 30, bottom: 45, left: 60 };

  const svg = d3.select("#scatter-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  d3.csv("data/Ex5_TV_energy.csv").then(data => {
    // Filter and convert formats
    const cleanData = data
      .map(d => ({
        star: +d.star2,
        energy: +d.energy_consumpt,
        tech: d.screen_tech
      }))
      .filter(d => !isNaN(d.star) && !isNaN(d.energy));

    const x = d3.scaleLinear()
      .domain([1.5, d3.max(cleanData, d => d.star) || 8]).nice()
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => d.energy) || 2800]).nice()
      .range([height - margin.bottom, margin.top]);

    // X 
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(8))
      .attr("color", "#64748b");

    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Star Rating (Energy Efficiency)");

    // Y 
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(8))
      .attr("color", "#64748b");

    svg.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .text("Energy Consumption (kWh/year)");

    svg.append("g")
      .selectAll("circle")
      .data(cleanData)
      .join("circle")
      .attr("cx", d => x(d.star))
      .attr("cy", d => y(d.energy))
      .attr("r", 3.2)
      .attr("fill", "#0284c7")
      .attr("opacity", 0.55);
  }).catch(err => console.error("Error loading scatter data:", err));
})();