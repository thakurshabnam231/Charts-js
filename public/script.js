document.addEventListener("DOMContentLoaded", function () {
  const svg = d3.select("svg");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const radius = Math.min(width, height) / 2;

  const data = [
    { name: "Category A", value: 30 },
    { name: "Category B", value: 50 },
    { name: "Category C", value: 20 }
  ];

  const colorScale = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.schemeCategory10);

  const pie = d3.pie().value(d => d.value);

  const arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

  const arcs = svg.selectAll("g.arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => colorScale(d.data.name));

  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .text(d => d.data.name);

  // Example transition on click
  svg.on("click", function () {
    // Update data
    data[0].value = Math.random() * 100;

    // Update arcs
    arcs.data(pie(data))
      .select("path")
      .transition()
      .duration(1000)
      .attr("d", arc);
  });
});
