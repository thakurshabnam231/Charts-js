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
      try {
        const chartImages = await generateChart(chartDataArray);
        const imageBase64 = chartImages.toString('base64');
  
        // Save image to a file (optional)
        const filename = `chart.png`;
        fs.writeFileSync(filename, imageBase64);
  
        // Send the base64 URL in the response JSON
        res.status(200).json({
          success: true,
          message: 'Created chart successfully',
          image: `data:image/png;base64,${imageBase64}`
        });
      } catch (error) {
        // Check if the error is due to exceeding the maximum number of charts
        if (error.message === 'You can generate a maximum of 6 charts') {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        } else {
          // Otherwise, handle other errors
          console.error('Error generating chart:', error);
          res.status(500).send('An error occurred');
        }
      }
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).send('An error occurred');
    }
  });
module.exports=router;  