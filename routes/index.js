const express = require('express');
const router = express.Router();
const fs = require('fs');
const generateChart = require('../utils/chartGenerator');

router.post('/generateChart', async (req, res) => {
    try {
    const chartDataArray = req.body.data;

    // Check if the array is present and has valid values
    if (!chartDataArray || !Array.isArray(chartDataArray)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid chart data array in request body'
        });
    }
        // Generate chart using the function from the separate file
        const chartImages = await generateChart(chartDataArray);
        console.log("chart images",chartImages);
        const imageBase64 = chartImages.map(imageBuffer => imageBuffer.toString('base64'));

        // Save image to a file (optional)
      //  const filename = `chart-${label}.png`;
      //  fs.writeFileSync(filename, imageBuffer);

        // Send the base64 URL in the response JSON
        res.status(200).json({
            success: true,
            message: 'Created chart successfully',
            image: `data:image/png;base64,${imageBase64}`
        });
    } catch (error) {
        console.error('Error generating chart:', error);
        res.status(500).send('An error occurred');
    }
});


module.exports = router;