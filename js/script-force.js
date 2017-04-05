var svg = d3.select("svg"),
width = +svg.style("width").replace('px', ''),
height = +svg.style("height").replace('px', '');

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("data.json", function(error, graph) {
    if (error) throw error;

    var nodes = graph.nodes
    var links = []

    for (var i = 0; i < graph.links.length; i++) {
      links.push({
            source: graph.nodes[graph.links[i].source].id,
            target: graph.nodes[graph.links[i].target].id,
            weight: graph.links[i].weight
      })
    };
    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.append("g")
        .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}


function mouseover() {
  tempColor = this.style.fill;
    d3.select(this).transition()
        .duration(750)
        .attr("r", 30)
        .style("fill", "lightsteelblue");;
}
function mouseout() {
    d3.select(this).transition()
    .duration(750)
    .attr("r", 5)
    .style("fill", tempColor);
}
