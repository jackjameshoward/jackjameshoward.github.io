  var svg = d3.select("svg"),
    width = +svg.style("width").replace('px', ''),
    height = +svg.style("height").replace('px', ''),
    g = svg.append("g").attr("transform", "translate(" + (width / 2 + 40) +
      "," + (height / 2 + 90) + ")");
    console.log(d3.select("svg").style("width").replace('px', ''));
    console.log(d3.select("svg").style("height").replace('px', ''));

  var stratify = d3.stratify()
    .parentId(function(d) {
      return d.id.substring(0, d.id.lastIndexOf("."));
    });

  var tree = d3.tree()
    .size([360 , 250])
    .separation(function(a, b) {
      return (a.parent == b.parent ? 1 : 2) / a.depth;
    });

  d3.json("flare.json", function(error, data) {
    if (error) throw error;

    var root = tree(d3.hierarchy(data));

    var link = g.selectAll(".link")
      .data(root.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .attr("d", function(d) {
        return "M" + project(d.x, d.y) +
          "C" + project(d.x, (d.y + d.parent.y) / 2) +
          " " + project(d.parent.x, (d.y + d.parent.y) / 2) +
          " " + project(d.parent.x, d.parent.y);
      });

    var node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", function(d) {
        return "node" + (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function(d) {
        return "translate(" + project(d.x, d.y) + ")";
      });

    node.append("circle")
      .attr("r", 2.5);

    node.append("text")
      .attr("dy", ".31em")
      .attr("x", function(d) {
        return d.x < 180 === !d.children ? 6 : -6;
      })
      .style("text-anchor", function(d) {
        return d.x < 180 === !d.children ? "start" : "end";
      })
      .attr("transform", function(d) {
        return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")";
      })
      .text(function(d) {
        return "jack";
      });
  });

  function project(x, y) {
    var angle = (x - 90) / 180 * Math.PI,
      radius = y;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
  }
