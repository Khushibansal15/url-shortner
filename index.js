const express = require('express');
const path = require('path');
const app = express();
const PORT = 8001;
const URL = require('./models/url');
const urlRoute = require('./routes/url');
const { connectToMongoDB } = require('./db');

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() => console.log("connected to MongoDB"));

app.use(express.json());
app.use('/url', urlRoute);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId: shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { new: true }
        );

        if (!entry) {
            return res.status(404).send('Short URL not found');
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Error handling GET request:", error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
