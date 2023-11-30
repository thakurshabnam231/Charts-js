// const express = require('express');
// const path = require('path');
// const generateChartRouter = require('./routes/index'); 

// const app = express();
// const port = 9000;

// app.use(express.static('public'));
// app.use(express.json());

// app.use('/api', generateChartRouter); 
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


const express = require('express');
const app = express();
const port = 9000;

// Serve static files from the public folder
app.use(express.static('public'));
app.use(express.json());

const generateChartRouter = require('./routes/index'); 

// Use route handlers
app.use('/api', generateChartRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


