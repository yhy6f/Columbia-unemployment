var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatDate = d3.time.format("%Y-%m-%d");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { 
      // You don't need to format the date again. It's already formatted bc you passed it through the `type` function
    	//return x(formatDate.parse(d.observation_date)); (Broken)
      return x(d.observation_date); //(Fixed)
    })
    .y(function(d) { 
    	return y(d.CLMUR); 
    });

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", type, function(error, data) {
  if (error) throw error;
  console.log(data)
  x.domain(d3.extent(data, function(d) { 
      return d.observation_date; 
}));

  y.domain(d3.extent(data, function(d) { 
      return d.CLMUR; 
}));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Unemployment rate");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);


    var dots = svg.selectAll(".dot")
        .data(data.filter(function(d) {
          return d.CLMUR === 6.6;
        }));
    

    dots.enter()
          .append("circle")
          .attr("class", "dot");

    /* ------------------- */
    // See the "filter" function in the data call above.
    // Basically, we want to filter the data to be limited to points where unemployment was 6.6.
    // Then, we draw the dots from that limited data set.
    // Here's an explanation of the `.filter` method: http://www.w3schools.com/jsref/jsref_filter.asp
    // And here's a good example of a line chart with dots: http://bl.ocks.org/d3noob/8dc93bce7e7200ab487d
    /* ------------------- */


    // I wanted to mark the highest unemployment rates by creating these dots:
    // for d in data;
    //   if d.CLMUR == 6.6; 
      dots
        .attr("r", 5)
        .attr("cx",function(d){ return x(d.observation_date); })
        .attr("cy",function(d){ return y(d.CLMUR); })
        .style("stroke","white")
        .style("stroke-width","1px")
        .style("fill", "blue");

 });
function type(d) {
  d.observation_date = formatDate.parse(d.observation_date);
  d.CLMUR = +d.CLMUR;
  return d;
}







