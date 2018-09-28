//https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/d546eaee765268bf2f487608c537c05e22e4b221/iris.csv

function getSource() {
    var x = document.getElementById("frm1");
    var text = "";
    var i;
    let selectedTextColumn;
    for (i = 0; i < x.length ;i++) {
        text += x.elements[i].value;
    }

d3.csv(text,function (data) {

  textVariables = [];

Object.entries(data[0]).forEach(column => {
  if (isNaN(column[1]))
  textVariables.push(column[0]);
})

  var body = d3.select('body')
  var selectData = d3.keys(data[0]);

  // Select X-axis Variable
  var span = body.append('span')
    .text('Select X-Axis variable: ')
  var yInput = body.append('select')
      .attr('id','xSelect')
      .on('change',xChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d })
      .text(function (d) { return d })
  body.append('br')


  // Select Y-axis Variable
  var span = body.append('span')
      .text('Select Y-Axis variable: ')
  var yInput = body.append('select')
      .attr('id','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d })
      .text(function (d) { return d ;})
  body.append('br')

  // Variables
  var body = d3.select('body')
  var margin = { top: 50, right: 50, bottom: 50, left: 50 }
  var h = 700 - margin.top - margin.bottom
  var w = 700 - margin.left - margin.right
  var formatPercent = d3.format('1')
  // Scales
  var colorScale = d3.scale.linear().domain([1,length]);

  generateUniqueValues = (input) => {
    uniqueValues = [];
    data.forEach(object => {
      if (!uniqueValues.includes(object[input]))
        uniqueValues.push(object[input]);
    });
    return uniqueValues;
  }

  getColourArray = (input) => {
    colourArray = [];
    for (let index = 0; index < input.length; index++) {
      colourArray.push('#'+Math.random().toString(16).substr(-6));
    }
    return colourArray;
  }

  let variations = generateUniqueValues(textVariables[0]);
  console.log(variations,'variations');

  let colors = getColourArray(variations);
  console.log(colors);


  colorScale = (circle) => {
    if (selectedTextColumn != textVariables)
      {
        selectedTextColumn = textVariables;
        colors = getColourArray(variations);
      }

      return colors[variations.indexOf(circle[textVariables[0]])];

    let hexValue = colourArray[variations.indexOf(circle[textVariables[0]])];
    return '#'+((1<24)*Math.random()|0).toString(16);
    if (circle[textVariables[0]] == 'setosa')
      return 'red';
    else return 'blue';
  }


  var xScale = d3.scale.linear()
   .domain([
      d3.min([0,d3.min(data,function (d) {
        return d;
      })]),
      d3.max([0,d3.max(data,function (d) {
        return d;
       })])
      ])
    .range([0,w])
  var yScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d })]),
      d3.max([0,d3.max(data,function (d) { return d })])
      ])
    .range([h,0])
  // SVG
  var svg = body.append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  // X-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .tickFormat(formatPercent)
    .ticks(10)
    .orient('bottom')
  // Y-axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .tickFormat(formatPercent)
    .ticks(10)
    .orient('left')

  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) {
      return xScale(d)

       })
      .attr('cy',function (d) { return yScale(d) })
      .attr('r','10')
      .attr("data-legend",function(d) { return d.name})
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d) { return colorScale(d) })
      .on('mouseover', function (d) {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',20)
          .attr('stroke-width',3)
          .text();
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',10)
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
      .text(function (d) { return d})


  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','xAxis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('id','xAxisLabel')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text(" ")
  // Y-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','yAxis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('id', 'yAxisLabel')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('')

  function yChange() {
    var value = this.value // get the new y value
    yScale // change the yScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return d[value] })]),
        d3.max([0,d3.max(data,function (d) { return d[value] })])
        ])
    yAxis.scale(yScale) // change the yScale
    d3.select('#yAxis') // redraw the yAxis
      .transition().duration(1000)
      .call(yAxis)
    d3.select('#yAxisLabel') // change the yAxisLabel
      .text(value)    
    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*5})
      .attr('cy',function (d) { return yScale(d[value])})
  }

  function xChange() {
    var value = this.value // get the new x value
    //console.log(value);
    xScale // change the xScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return d[value] })]),
        d3.max([0,d3.max(data,function (d) { return d[value] })])
        ])
    xAxis.scale(xScale) // change the xScale
    d3.select('#xAxis') // redraw the xAxis
      .transition().duration(1000)
      .call(xAxis)
    d3.select('#xAxisLabel') // change the xAxisLabel
      .transition().duration(1000)
      .text(value)
    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*5})
        .attr('cx',function (d) { return xScale(d[value]) })
  }
  
})
}