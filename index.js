const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

const req = new XMLHttpRequest();

let dataset = [];

const w = 800;
const h = 500;
const padding = 40;

let xScale;
let yScale;
let xScaleAxis;
let yScaleAxis;

const svg = d3.select(".container")
              .append("svg")

const divTooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip')
            .attr('id', 'tooltip')
            .style('opacity', 0);
              

const drawSvg = ()=>{
              svg.attr("width", w)
              svg.attr("height", h)  
}

const generateScales = ()=>{

    // xScale = d3.scaleLinear()
    //            .domain([0, d3.max(dataset, (d)=>d.Year)])
    //            .range([padding, w-padding])
    // yScale = d3.scaleTime()
    //            .domain([d3.max(dataset, (d)=>d.Time, 0)])
    //            .range([0, h - padding*2])
               
    xScaleAxis = d3.scaleLinear()
                    .domain([d3.min(dataset, (d)=>d.Year) -1, d3.max(dataset, (d)=>d.Year)+1])
                    .range([padding, w-padding])
    yScaleAxis = d3.scaleTime()
                    .domain([d3.min(dataset, (d)=>new Date(d.Seconds * 1000)), d3.max(dataset, (d)=>new Date(d.Seconds * 1000))])
                    .range([padding, h-padding])
                    

}

const drawCircles = ()=>{
    let tooltip = d3.select(".container")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("visibility", "hidden")
                    .style("width", "auto")
                    .style("height", "auto")
                    .style("margin", "6px")

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("data-xvalue", (d)=> d.Year)
        .attr("data-yvalue", (d)=> new Date(d.Seconds * 1000))
        .attr("cx", (d)=> xScaleAxis(d.Year))
        .attr("cy", (d)=> yScaleAxis(new Date(d.Seconds * 1000)))
        .attr("r", 5)
        .attr("fill", (d)=> {
            if (d.Doping != ""){
                return "red"
            }else {
                return "yellow"
            }
        })
        .attr('index', (d, i) => i)
        .on('mouseover', function(event, d){

            divTooltip.style('opacity', 0.9);
            divTooltip.attr('data-year', d.Year);
            divTooltip
              .html(
                d.Name +
                  ': ' +
                  d.Nationality +
                  '<br/>' +
                  'Year: ' +
                  d.Year +
                  ', Time: ' +
                  d.Time +
                  (d.Doping ? '<br/><br/>' + d.Doping : '')
              )
              .style('left', event.pageX + 'px')
              .style('top', event.pageY - 28 + 'px');

            
            var i = this.getAttribute('index');
         
            tooltip.transition()
                    .style('visibility', "visible")
            tooltip.text("Year : "+dataset[i].Year+", Time : "+dataset[i].Time); 
            
            document.querySelector('#tooltip').setAttribute("data-year", dataset[i].Year);

        })
        .on('mouseout', (d)=>{
            divTooltip.style('opacity', 0);

            tooltip.transition()
                    .style('visibility', "hidden")
        })

        svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -300)
        .attr('y', 60)
        .text('Time in Minutes');

      
    

}

const generateAxis = ()=>{
        const xAxis = d3.axisBottom(xScaleAxis)
                        .tickFormat(d3.format('i'))
                        svg.append("g")
                           .call(xAxis)
                           .attr('id', 'x-axis')
                           .attr("transform", "translate(0,"+ (h- padding )+")")

        const yAxis = d3.axisLeft(yScaleAxis)
                        .tickFormat(d3.timeFormat('%M:%S'))
                        svg.append("g")
                           .call(yAxis)
                           .attr("id", "y-axis")
                           .attr("transform", "translate("+padding+",0)")
}    


req.open('GET', url, true);
req.send();
req.onload = ()=>{
    const data = JSON.parse(req.responseText);
    dataset = data;
    console.log(dataset)
    drawSvg();
    generateScales();
    drawCircles();
    generateAxis();
}

