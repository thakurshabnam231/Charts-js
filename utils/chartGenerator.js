const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { createCanvas, loadImage } = require("canvas");

async function generateChart(chartDataArray) {
  const canvas = createCanvas(1300, 800);
  const ctx = canvas.getContext("2d");

  await drawCanvas(ctx, chartDataArray, canvas);

  const imageDataURL = canvas.toDataURL("image/png");
  const dataURLParts = imageDataURL.split(",");
  const imageBuffer = Buffer.from(dataURLParts[1], "base64");

  return imageBuffer;
}

async function drawCanvas(ctx, chartDataArray, canvas) {
  const width = 140;
  const height = 250;
  const spacing = 20;

  // Move gradient declaration outside of the afterDatasetsDraw function
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "green");
  gradient.addColorStop(0.7, "yellow");
  gradient.addColorStop(1, "red");
  // Create an array to store all generated chart images
  const chartImages = [];

  for (const chartData of chartDataArray) {
    const { title, value, type, range } = chartData;
    let min_range = range[0];
    let max_range = range[range.length - 1];


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

        // let rating;

        // if (score >= 0 && score <= 30) {
        //   rating = "very low";
        // } else if (score >= 31 && score <= 60) {
        //   rating = "low";
        // } else if (score >= 61 && score <= 90) {
        //   rating = "normal";
        // } else if (score >= 91 && score <= 120) {
        //   rating = "high";
        // } else if (score >= 121 && score <= 150) {
        //   rating = "very high";
        // }

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
         // ctx.fontWeight = fontWeight;
          ctx.fillText(text, x, y);
        }

        textLabel(
          `${data.labels[0]}`,
          left,
          yCoor + 20,
          15,
          "top",
          "normal",
          "left"
        );
        textLabel(
          `${data.labels[1]}`,
          right,
          yCoor + 20,
          15,
          "top",
          "normal",
          "right"
        );
        textLabel(label, xCoor, yCoor + 40, 16, "bottom", "normal", "center");
        textLabel(score, xCoor, yCoor - 15, 25, "bottom",  "bold", "center");
      },
    };

    const canvasRenderService = new ChartJSNodeCanvas({
      width,
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
        labels: [min_range.min, max_range.max],
        datasets: [
          {
            label: title,
            data: [value, max_range.max - value],
            backgroundColor: [gradient,"grey"],
            borderWidth: 1,
            cutout: "72%",
            circumference: 180,
            rotation: 270,
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

  // Draw the chart images on the main canvas
  let offsetX = 0;
  for (const chartImage of chartImages) {
    const chartImageObj = await loadImage(chartImage);
    ctx.drawImage(chartImageObj, offsetX, 0);
    offsetX += width + spacing;
  }
}

module.exports = generateChart;
