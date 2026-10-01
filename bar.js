(function () {
  const width = 500, height = 340;
  const margin = { top: 25, right: 30, bottom: 45, left: 60 };

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv").then(data => {
    const valKey = "Mean(Labelled energy consumption (kWh/year))";

    const parsed = data.map(d => ({
      tech: d.Screen_Tech,
      val: +d[valKey]
    }));

    const x = d3.scaleBand()
      .domain(parsed.map(d => d.tech))
      .range([margin.left, width - margin.right])
      .padding(0.35);

    const y = d3.scaleLinear()
      .domain([0, 450]).nice()
      .range([height - margin.bottom, margin.top]);

    // X 
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .attr("color", "#64748b");

    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Screen Technology");

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
      .text("Mean Energy Consumption (kWh/year)");

    svg.append("g")
      .selectAll("rect")
      .data(parsed)
      .join("rect")
      .attr("x", d => x(d.tech))
      .attr("y", d => y(d.val))
      .attr("width", x.bandwidth())
      .attr("height", d => (height - margin.bottom) - y(d.val))
      .attr("fill", "#5eead4")
      .attr("stroke", "#0f766e")
      .attr("stroke-width", 1);
  }).catch(err => console.error("Error loading bar data:", err));
})();