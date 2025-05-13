const express = require('express');
const ytdl = require('ytdl-core');
const router = express.Router();

router.post('/', async (req, res) => {
  const { url, type, quality } = req.body;
  
  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    if (type === 'video') {
      const format = ytdl.chooseFormat(info.formats, { quality: `${quality}p` });
      res.header('Content-Disposition', `attachment; filename="${title}-${quality}p.mp4"`);
      ytdl(url, { format }).pipe(res);
    } 
    else if (type === 'audio') {
      res.header('Content-Disposition', `attachment; filename="${title}-${quality}kbps.mp3"`);
      ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to download" });
  }
});

module.exports = router;
