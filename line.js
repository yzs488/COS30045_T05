(function () {
  const width = 500, height = 340;
  const margin = { top: 20, right: 30, bottom: 45, left: 60 };

  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  d3.csv("data/Ex5_ARE_Spot_Prices.csv").then(data => {
    // Dynamically extract the state name column and calculate the average price per year
    const stateColumns = data.columns.filter(c => c !== "Year");

    const parsedData = data.map(d => {
      let sum = 0, count = 0;
      stateColumns.forEach(col => {
        const val = parseFloat(d[col]);
        if (!isNaN(val)) {
          sum += val;
          count++;
        }
      });
      return {
        year: +d.Year,
        avgPrice: count > 0 ? sum / count : 0
      };
    }).filter(d => !isNaN(d.year) && d.avgPrice > 0);

    const x = d3.scaleLinear()
      .domain(d3.extent(parsedData, d => d.year))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.avgPrice)]).nice()
      .range([height - margin.bottom, margin.top]);

    // X 
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(7))
      .attr("color", "#64748b");

    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Year (1998 - 2024)");

    // Y 
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6))
      .attr("color", "#64748b");

    svg.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .text("Average Spot Price ($/MWh)");

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.avgPrice))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#ec4899")
      .attr("stroke-width", 2.5)
      .attr("d", line);
  }).catch(err => console.error("Error loading line data:", err));
})();