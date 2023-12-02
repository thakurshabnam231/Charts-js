const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { createCanvas, loadImage } = require("canvas");

async function generateChart(chartDataArray) {
  const aspectRatio = 2.75; // Set your desired aspect ratio
  const totalCharts = chartDataArray.length;
  const spacing = 20;

  // Set widthPerChart and fontSize based on the number of charts
  let widthPerChart, fontSize;
  if (totalCharts === 1) {
    widthPerChart = 350;
    fontSize = 24;
  } else if (totalCharts <= 2) {
    widthPerChart = 240;
    fontSize = 20;
  } else if (totalCharts <= 6) {
    widthPerChart = 200;
    fontSize = 18;
  }

  const canvasWidth = 600;
  const canvasHeight = 900;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  await drawCanvas(ctx, chartDataArray, canvas, widthPerChart, fontSize);

  const imageDataURL = canvas.toDataURL("image/png");
  const dataURLParts = imageDataURL.split(",");
  const imageBuffer = Buffer.from(dataURLParts[1], "base64");

  return imageBuffer;
}

async function drawCanvas(ctx, chartDataArray, canvas, widthPerChart, fontSize) {
  const height = 250;
  const spacing = 70;
  const spacingY = 15;

  const chartImages = [];

  for (const chartData of chartDataArray) {
    const { title, value, type, range } = chartData;
    let min_range = range[0];
    let max_range = range[range.length - 1];

    const ranges = [min_range.min, max_range.max];

    const gradient = ctx.createLinearGradient(0, 0, widthPerChart, 0);
    gradient.addColorStop(0, "green");
    gradient.addColorStop(0.7, "yellow");
    gradient.addColorStop(1, "red");

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
          ChartJS.defaults.global.defaultFontSize = fontSize;
        }
      },
    });

    const configuration = {
      type: type,
      data: {
        datasets: [
          {
            label: title,
            data: [value, max_range.max - value],
            backgroundColor: [gradient, "grey"],
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

  const chartsPerRow =
    chartDataArray.length >= 6 ? 2 : chartDataArray.length > 2 ? 2 : 1;

  const maxRows = Math.ceil(chartDataArray.length / chartsPerRow);

  for (let i = 0; i < maxRows; i++) {
    for (let j = 0; j < chartsPerRow; j++) {
      const chartImageIndex = i * chartsPerRow + j;

      if (chartImageIndex < chartDataArray.length) {
        const chartImage = chartImages[chartImageIndex];
        const chartImageObj = await loadImage(chartImage);
        const offsetY = i * (height + spacingY);
        const offsetX = j * (widthPerChart + spacing);
        ctx.drawImage(chartImageObj, offsetX, offsetY);
      }
    }
  }

  return canvas.toBuffer("image/png");
}

module.exports = generateChart;
