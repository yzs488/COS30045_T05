(function () {
  const width = 500, height = 340;
  const radius = Math.min(width, height) / 2 - 35;

  const svg = d3.select("#donut-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(data => {
    const valKey = "Mean(Labelled energy consumption (kWh/year))";

    const parsed = data.map(d => ({
      tech: d.Screen_Tech,
      val: +d[valKey]
    }));

    const color = d3.scaleOrdinal()
      .domain(parsed.map(d => d.tech))
      .range(["#1d4ed8", "#ea580c", "#16a34a"]);

    const pie = d3.pie()
      .value(d => d.val)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    svg.selectAll("path")
      .data(pie(parsed))
      .join("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.tech))
      .attr("stroke", "#ffffff")
      .style("stroke-width", "2.5px");

    const labelArc = d3.arc()
      .innerRadius(radius * 0.72)
      .outerRadius(radius * 0.72);

    svg.selectAll("text")
      .data(pie(parsed))
      .join("text")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("fill", "#ffffff")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .text(d => d.data.tech);
  }).catch(err => console.error("Error loading donut data:", err));
})();