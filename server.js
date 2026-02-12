const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 6080;

let currentProcess = null;

app.get('/run', (req, res) => {
    if (currentProcess) {
        return res.send('Automation already running');
    }
    currentProcess = exec('node automation.js', (error, stdout, stderr) => {
        console.log(stdout);
        if (error) console.log(error);
        currentProcess = null;
    });
    res.send('Automation started in background (headless)');
});

app.get('/start', (req, res) => {
    if (currentProcess) return res.send('GUI already running');
    
    // Run with virtual display (xvfb) for GUI
    currentProcess = exec('xvfb-run -a node automation.js', (error, stdout, stderr) => {
        console.log(stdout);
        if (error) console.log(error);
        currentProcess = null;
    });
    res.send('GUI started temporarily via Xvfb');
});

app.get('/stop', (req, res) => {
    if (currentProcess) {
        currentProcess.kill();
        currentProcess = null;
        return res.send('Process stopped');
    }
    res.send('No process running');
});

app.get('/ping', (req, res) => res.send('Server alive'));

app.listen(port, () => console.log(`Server running on port ${port}`));
