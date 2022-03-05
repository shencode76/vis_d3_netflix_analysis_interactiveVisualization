// write your javascript code here.
// feel free to change the pre-set attributes as you see fit

let margin = {
    top: 60,
    left: 50,
    right: 30,
    bottom: 35
  };
let width = 500 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;




// first visualization
let svg1 = d3.select('#vis1')
  .append('svg')
    .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
    .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
    .attr('height', '100%')
    .style('background-color', '#ccc') // change the background color to light gray
    .attr('viewBox', [0, 0, width+ margin.left + margin.right, height+ margin.top + margin.bottom].join(' '));


// create a barChart object to store the bar chart
svg1
.append('g')
.attr('transform','translate(' + margin.left +',' + margin.top + ')');


const yellow = d3.interpolateYlGn(0); // "rgb(255, 255, 229)"
const yellowGreen = d3.interpolateYlGn(0.5); // "rgb(120, 197, 120)"
const green = d3.interpolateYlGn(1); // "rgb(0, 69, 41)"

// parse the data 
d3.csv('data/netflixNumberOfShowsAndMovies.csv').then(function(data) {

// list of subgroups including number of TV show, number of movies.
const subgroups = data.columns.slice(1)

// list of groups including the countries on dataset. 
const groups = data.map(d => d.Country)

console.log(groups)

// add X axis(selected countries)
let xScale = d3.scaleBand()
  .domain(groups)
  .range([margin.left,width + margin.left])
  .padding([0.5])

// draw x axis
svg1
  .append('g')
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickSize(0))
    .selectAll('text')
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");
    
//Add label
svg1
  .append('text')
    .attr('y', 30)
    .attr('x', 20)
    .style('stroke', 'black')
    .text('Number of Movies/TV Shows');

// Add Y axis
let yScale = d3.scaleLinear()
  .domain([0, 8000])
  .range([height, margin.top]);

// draw y axis
svg1
  .append("g")
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  //Add label
svg1
  .append('text')
    .attr('x', 420) 
    .attr('y', width + margin.bottom + margin.top - 20) 
    .style('stroke', 'black')
    .text('Countries');

// Another scale for subgroup position?
const xSubgroup = d3.scaleBand()
  .domain(subgroups)
  .range([0, xScale.bandwidth()])
  .padding([0.05])

// color palette = one color per subgroup
const color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#77A88D','#FFD123'])

// Show the bars
let bars_g = svg1.append("g");
let bars = bars_g.selectAll("g")
  // Enter in data = loop group per country
  .data(data)
  .enter()
  .append("g")
    .attr("transform", function(d) { return "translate(" + xScale(d.Country) + ",0)"; })
  .selectAll("rect")
  .data(function(d) { return subgroups.map(function(key) {
     return {key: key, value: d[key]}; 
    }); })
  .enter().append("rect")
    .attr("x", function(d) { return xSubgroup(d.key); })
    .attr("y", function(d) { return yScale(d.value); })
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function(d) { return height - yScale(d.value); })
    .attr("fill", function(d) { return color(d.key); });



// interactions: when mouse move over the bars, bars turn yellow green. 
// when mouse stay on the bars, the bars become dark green and expand. 
bars
  .on('mouseover', function(d) { // on an event 
    d3.select(this)
      .transition()
        .delay(200)
        .duration(500)
      .style('fill', green)
      .attr('width', xScale.bandwidth());
  })
  .on('mouseout', function(d) {
    d3.select(this)
      .transition()
        .delay(200)
        .duration(500)
      .style('fill', 'steelblue')
      .attr('width', xScale.bandwidth() -10);
  });
})




// second visualization

let parseDate = d3.timeParse("%m/%d/%Y");

let svg2 = d3.select('#vis2')
  .append('svg')
    .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
    .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
    .attr('height', '100%')
    .style('background-color', '#ccc') // change the background color to light gray
    .attr('viewBox', [0, 0, width+ margin.left + margin.right, height+ margin.top + margin.bottom].join(' '));
    
svg2
  .append('g')
  .attr('transform','translate(' + margin.left +',' + margin.top + ')');

// read the data 
d3.csv('data/netflixTV14ratings.csv', function(d) {
    return {
      yearOfRelease: parseDate(d.yearOfRelease),
      Quantity: +d.Quantity
    };
  }).then(
  function (data) {
    console.log(data);

    // to know the max/min data 
    let maxDate  = d3.max(data, function(d){return d.yearOfRelease; });
    let minDate  = d3.min(data, function(d){return d.yearOfRelease; });
    let maxQuantity = d3.max(data, function(d){return d.Quantity;});
    //print out the maxDate, minDate, maxQuantity to verify the scale. 
    console.log(maxDate, minDate, maxQuantity);

    // x axis
    let xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([margin.left, width + margin.left]);

    svg2.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(d3.axisBottom(xScale));

    // x axis label 
    svg2
    .append('text')
      .attr('x', width) 
      .attr('y', height + margin.bottom) 
      .style('stroke', 'black')
      .text('Years');

    // y axis
    let yScale = d3.scaleLinear()
      .domain([0, maxQuantity])
      .range([height, margin.top]);

    svg2.append('g')
          .attr('class', 'y axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // y axis label 
    svg2
      .append('text')
      .attr('y', 30)
      .attr('x', 20)
      .style('stroke', 'black')
      .text('Quantity of Netflix Shows on Channel14');

    // This allows to find the closest X index of the mouse:
    var bisect = d3.bisector(function(d) { 
      return d.yearOfRelease;
    }).left;

    // Create the circle that travels along the curve of chart
    var focus = svg2
        .append('g')
        .append('circle')
          .style("fill", "none")
          .attr("stroke", "black")
          .attr('r', 8.5)
          .style("opacity", 0);
    
    // Create the text that travels along the curve of chart
    var focusText = svg2
        .append('g')
        .append('text')
          .style("opacity", 0)
          .attr("text-anchor", "left")
          .attr("alignment-baseline", "middle");

    // add lines 
    let line = d3.line()
            .x(function(d){return xScale(d.yearOfRelease);})    
            .y(function(d){return yScale(d.Quantity);})

    svg2.append('path')
      .attr('d', line(data))
      .attr('class', 'dataLine');


    svg2
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width + margin.left)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);

    // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover() {
      focus.style("opacity", 1)
      focusText.style("opacity",1)
    };

    function mousemove(event) {
      // recover coordinate we need
      var x0 = xScale.invert(d3.pointer(event)[0]);
      var i = bisect(data, x0, 1);
      selectedData = data[i]
      focus
        .attr("cx", xScale(selectedData.yearOfRelease))
        .attr("cy", yScale(selectedData.Quantity))
        .style('fill', 'red')
      var comment = "Release year: " + selectedData.yearOfRelease.getFullYear() + " - " + 
      "Number of netflix shows: " + selectedData.Quantity + 'movies';
      focusText
        .html(comment)
        .attr("x", xScale(selectedData.yearOfRelease))
        .attr("y", yScale(selectedData.Quantity) - 20)
        .style('font-size', 12)
      };
      
    function mouseout() {
      focus.style("opacity", 0)
      focusText.style("opacity", 0)
    };





} );
