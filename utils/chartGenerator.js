const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { createCanvas, loadImage } = require("canvas");

async function generateChart(chartDataArray) {
  const aspectRatio = 2.75; // Set your desired aspect ratio
  const chartCount = chartDataArray.length;
  const widthPerChart = 140; // Set the width of each individual chart
  const spacing = 20;
  // Maximum number of rows

  const totalWidth = chartCount * (widthPerChart + spacing) - spacing;
  const canvasWidth = totalWidth > 500 ? totalWidth : 500;
  const canvasHeight = Math.round(canvasWidth / aspectRatio);

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  await drawCanvas(ctx, chartDataArray, canvas);

  const imageDataURL = canvas.toDataURL("image/png");
  const dataURLParts = imageDataURL.split(",");
  const imageBuffer = Buffer.from(dataURLParts[1], "base64");

  return imageBuffer;
}

async function drawCanvas(ctx, chartDataArray, canvas) {
  const widthPerChart = 140;
  const height = 250;
  const spacing = 70;
  const spacingY=15;

  // Move gradient declaration outside of the afterDatasetsDraw function
  const gradient = ctx.createLinearGradient(0, 0, widthPerChart, 0);
  gradient.addColorStop(0, "green");
  gradient.addColorStop(0.7, "yellow");
  gradient.addColorStop(1, "red");
  // Create an array to store all generated chart images
  const chartImages = [];

  for (const chartData of chartDataArray) {
    const { title, value, type, range } = chartData;
    let min_range = range[0];
    let max_range = range[range.length - 1];

const ranges=[min_range.min, max_range.max]
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
          // Apply the gradient directly to the context
  
          const xCoor = chart.getDatasetMeta(0).data[0].x;
          const yCoor = chart.getDatasetMeta(0).data[0].y;
          const score = data.datasets[0].data[0];
          const label = data.datasets[0].label;
  
          function textLabel(
            text,
            x,
            y,
            fontSize,
            textBaseLine,
            fontWeight,
            textAlign
          ) {
            ctx.font = `${fontWeight} ${fontSize}px sans-serif`;
            ctx.fillStyle = textBaseLine;
            ctx.textAlign = textAlign;
            ctx.fillText(text, x, y);
          }
  
          textLabel(
            `${ranges[0]}`,
            left,
            yCoor + 20,
            15,
            "top",
            "normal",
            "left"
          );
          textLabel(
            `${ranges[1]}`,
            right,
            yCoor + 20,
            15,
            "top",
            "normal",
            "right"
          );
          textLabel(label, xCoor, yCoor + 40, 16, "bottom", "700", "center");
          textLabel(score, xCoor, yCoor - 15, 25, "bottom", "bold", "center");
        },
      };
  

    const canvasRenderService = new ChartJSNodeCanvas({
      width: widthPerChart,
      height,
      chartCallback: (ChartJS) => {
        if (ChartJS.defaults?.global) {
          ChartJS.defaults.global.defaultFontColor = "black";
          ChartJS.defaults.global.defaultFontSize = 16;
        }
      },
    });

    const configuration = {
      type: type,
      data: {
       // labels: [min_range.min, max_range.max],
        datasets: [
          {
            label: title,
            data: [value, max_range.max - value],
            backgroundColor: [gradient, "grey"],
            borderWidth: 1,
            cutout: "72%",
            circumference: 180,
            rotation: 270,
            // circumference: 220,
            // rotation: 255,
          },
        ],
      },
      options: {
        aspectRatio: 2.75,
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: false,
        },
        legend: {
          display: false,
        },
        animation: {
          animateRotate: true,
          animateScale: false,
        },
        title: {
          display: true,
          text: title,
          fontSize: 16,
        },
        
      },
      plugins: [gaugeChartText],
    
    };

    const image = await canvasRenderService.renderToBuffer(configuration);
    chartImages.push(image);
  }
console.log("chartimahes",chartImages.length)
  // Draw the chart images on the main canvas
  const chartsPerRow = 3; // Number of charts in each row
  const maxRows = 4;

  for (let i = 0; i < Math.min(maxRows, Math.ceil(chartImages.length / chartsPerRow)); i++) {
    for (let j = 0; j < chartsPerRow; j++) {
      const chartImageIndex = i * chartsPerRow + j;

      if (chartImageIndex < chartImages.length) {
        const chartImage = chartImages[chartImageIndex];
        const chartImageObj = await loadImage(chartImage);
        const offsetY = i * (90 + spacing); // Use fixed height here
        const offsetX = j * (widthPerChart + spacing);
        ctx.drawImage(chartImageObj, offsetX, offsetY);
      }
    }
  }

  return canvas.toBuffer("image/png");
}

module.exports = generateChart;
