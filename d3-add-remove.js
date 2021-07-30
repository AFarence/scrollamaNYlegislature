(function () {

  const margin = { top: 40, right: 30, bottom: 20, left: 40 }

  const width = 400 - margin.left - margin.right
  const height = 500 - margin.top - margin.bottom


  const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


  svg.append('line')
  .style("stroke-dasharray",("3,3"))
  .style("stroke-width", 2)
  .attr("x1", 0)
  .attr("y1", height - 30)
  .attr("x2", width)
  .attr("y2", height - 30)
  .attr("stroke", "black")

  const xPositionScale = d3
  .scaleTime()
  .domain([new Date("2011-01-01"), new Date("2012-12-31")])
  .range([0, width])

  const yPositionScale = d3.scaleLinear()
    .domain([0, 365])
    .range([height, 0])

  const colorScale = d3.scaleOrdinal()
    .range(['#b3e2cd','#fdcdac','#cbd5e8','#f4cae4','#e6f5c9','#fff2ae','#f1e2cc','#cccccc'])


  d3.csv("df_dtg_2011.csv", (row) => {
		row.time_to_dtg = parseInt(row.time_to_dtg.replace("days", "").trim());
		row.dtg_date = new Date(row.dtg_date);
		return row;
	}).then(ready);

  function ready (datapoints) {

    svg.selectAll('circle')
    .data(datapoints, d => d.time_to_dtg)
    .join('circle')
    .attr('r', 5)
    .attr('cx', d => xPositionScale(d.dtg_date))
    .attr('cy', d => yPositionScale(d.time_to_dtg))
    .attr('fill', d3.color("green"))

    d3.select("#step-0").on('stepin', function(){

      let allData = datapoints.filter(d => d)

      svg.selectAll('circle')
      .data(allData, d => d.time_to_dtg)
      .join('circle')
      .attr('r', 5)
      .attr('cx', d => xPositionScale(d.dtg_date))
      .attr('cy', d => yPositionScale(d.time_to_dtg))
      .transition()
      .attr('fill', d3.color("green"))

    })

    d3.select("#step-1").on('stepin', function() {

      let under30 = datapoints.filter(d => d.time_to_dtg <= 30)

      svg.selectAll('circle')
      .data(under30, d => d.time_to_dtg)
      .join('circle')
      .attr('r', 5)
      .attr('cx', d => xPositionScale(d.dtg_date))
      .attr('cy', d => yPositionScale(d.time_to_dtg))
      .transition()
      .attr('fill', d3.color("blue"))

      })

    d3.select("#step-2").on('stepin', function() {

      let over30 = datapoints.filter(d => d.time_to_dtg > 30)

      svg.selectAll('circle')
      .data(over30, d => d.country)
      .join('circle')
      .attr('r', 5)
      .attr('cx', d => xPositionScale(d.dtg_date))
      .attr('cy', d => yPositionScale(d.time_to_dtg))
      .transition()
      .attr('fill', d3.color("red"))
      })

    d3.select("#step-3").on('stepin', function() {
      let veto = datapoints.filter(d => d.vetoed_by_gov == "True")

      svg.selectAll('circle')
        .data(veto, d => d.country)
        .join(
          enter => enter.append('circle')
                        .attr('cx', d => xPositionScale(d.dtg_date))
                        .attr('cy', d => yPositionScale(d.time_to_dtg))
                        .attr('fill', d3.color("orange"))
                        .transition()
                        .attr('r', 5),
          exit => exit.transition().attr('r', 0).remove()
        )
    })

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    }

})();