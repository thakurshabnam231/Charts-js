 const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

async function generateChart(chartDataArray) {
    
  const width = 200;
  const height = 200;

  const chartCallback = (ChartJS) => {
    if (ChartJS.defaults?.global) {
      ChartJS.defaults.global.defaultFontColor = 'black';
      ChartJS.defaults.global.defaultFontSize = 16;
    }
  };
  // Create an array to store all generated chart images
  const chartImages = [];

  for (const chartData of chartDataArray) {
    const { label, value, startRange, endRange } = chartData;

  const gaugeChartText = {
    id: "gaugeChartText",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {
        ctx,
        data,
        chartArea: { top, bottom, left, right, width, height },
        scales: { r },
      } = chart;
      ctx.save();
      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;
      const score=data.datasets[0].data[0];
      const label=data.datasets[0].label;

     let rating;
     if(score<600){
        rating=='Bad';

     }
     if(score>=600 &&score<=700){
        rating=='Fair';
     }
     if(score>700){
        rating=='Good';
     }

     if(score>800){
        rating=='Very Good';
     }
    //   ctx.fillRect(xCoor, yCoor, 400, 1);
function textLabel(text,x,y,fontSize,textBaseLine,textAlign){
ctx.font=`${fontSize}px sans-serif`;
ctx.fillStyle = textBaseLine;
ctx.textAlign = textAlign;
      ctx.fillText(text,x, y);
}


textLabel(`${data.labels[0]}`,left,yCoor+20,20,'top','left');
textLabel(`${data.labels[1]}`,right,yCoor+20,20,'top','right');
textLabel(label,xCoor,yCoor+20,20,'bottom','center');
textLabel(score,xCoor,yCoor-30,30,'bottom','center');
    },
  };

  const canvasRenderService = new ChartJSNodeCanvas({ width, height, chartCallback });

  const configuration = {
    type: 'doughnut',
    data: {
        labels: [startRange, endRange],
      datasets: [{
        label: label,
        data: [value, endRange - value],
        backgroundColor: ['green', 'black'],
        borderWidth: 1,
        cutout: "70%",
        circumference: 180,
        rotation: 270,
      }],
    },
    options: {
        aspectRatio: 2.75,
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            enabled: false
        },
        legend: {
            display: false
        },
        animation: {
            animateRotate: true,
            animateScale: false
        },
        title: {
            display: true,
            text:label,
            fontSize: 16
        }
    },
    plugins: [gaugeChartText],  
}
 const image = await canvasRenderService.renderToBuffer(configuration);
 chartImages.push(image);
 console.log("chartImage",chartImages)
  return chartImages;
}
}

module.exports = generateChart;