// // script.js
// const data = [30, 50, 20];
// const colors = ['red', 'green', 'blue'];

// const width = 300;
// const height = 300;
// const radius = Math.min(width, height) / 2;

// const svg = d3.select('#chart-container')
//   .append('svg')
//   .attr('width', width)
//   .attr('height', height)
//   .append('g')
//   .attr('transform', `translate(${width / 2}, ${height / 2})`);

// const pie = d3.pie();
// const arc = d3.arc().innerRadius(0).outerRadius(radius);

// const arcs = svg.selectAll('arc')
//   .data(pie(data))
//   .enter()
//   .append('g')
//   .attr('class', 'arc');

// arcs.append('path')
//   .attr('fill', (d, i) => colors[i])
//   .attr('d', arc);

var svg = d3.select("svg"),
width = svg.attr("width"),
height = svg.attr("height"),
radius = 200;

var ordScale = d3.scaleOrdinal()
                            .domain(data)
                            .range(['#ffd384','#94ebcd','#fbaccc','#d3e0ea','#fa7f72']);

                            var pie = d3.pie().value(function(d) { 
                              return d.share; 
                          });
              
                      var arc = g.selectAll("arc")
                                 .data(pie(data))
                                 .enter();

                                 var path = d3.arc()
                                 .outerRadius(radius)
                                 .innerRadius(0);
            
                    arc.append("path")
                       .attr("d", path)
                       .attr("fill", function(d) { return ordScale(d.data.name); });

                       var label = d3.arc()
                       .outerRadius(radius)
                       .innerRadius(0);
             
         arc.append("text")
            .attr("transform", function(d) { 
                     return "translate(" + label.centroid(d) + ")"; 
             })
            .text(function(d) { return d.data.name; })
            .style("font-family", "arial")
            .style("font-size", 15);