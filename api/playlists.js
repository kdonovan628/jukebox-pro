const express = require(`express`); 
const router = express.Router();
const prisma = require("../prisma");
const { authenticate } = require("./auth")

router.get(`/`, authenticate, async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { ownerId: req.customer.id },
    });
    res.json(playlists);
  } catch (error) {
    next(error);
  }
});

router.post(`/`, authenticate, async (req, res, next) => {
  const { name, description, trackIds } = req.body;
  try {
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description, 
        owner: { connect: { id: req.customer.id } }, 
        tracks: { connect: trackIds.map((id) => ({ id })) },
      },
    });
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
});

router.get(`/:id`, authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(id) },
      include: { tracks: true },
    });
    if (!playlist) return res.status(404).json({ error: `Playlist not found` });
    if (playlist.ownerId !== req.customer.id) {
      return res.status(403).json({ error: "Forbidden: You do not own this playlist" });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
});

module.exports = router;