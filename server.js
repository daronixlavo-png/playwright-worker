const express = require('express');
const bodyParser = require('body-parser');
const { startSessions } = require('./automation');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.send('Server is alive ✅');
});

app.get('/startDT', async (req, res) => {
    try {
        await startSessions();
        res.send('Sessions started successfully ✅');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error starting sessions ❌');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
