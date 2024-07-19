const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    const { customAlphabet } = await import('nanoid');
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

    const data = req.body;
    if (!data.url) return res.status(400).json({ error: 'URL is required' });

    const shortId = nanoid(); // Generate a new short id
    await URL.create({
        shortId: shortId,
        redirectURL: data.url,
        visitHistory: [],
    });
    return res.json({ id: shortId });
}


async function handleGetAnalytics(req,res){

    const shortId =req.params.shortId;
   const result= await URL.findOne({shortId})
   return res.json({totalClicks:result.visitHistory.length,analytics:result.visitHistory,})
}
module.exports = { handleGenerateNewShortURL,handleGetAnalytics };
