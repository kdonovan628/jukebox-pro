const express = require(`express`);
const router = express.Router();
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();

router.get(`/`, async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch (error) { 
    next(error);
  }
});

router.get(`/:id`, async (req, res, next) => {
  const { id } = req.params;
  try {
    const track = await prisma.track.findUnique({
      where: { id: parseInt(id) },
    });
    if(!track) return res.status(404).json({ error: `Track not found` });
    res.json(track);
  } catch (error) {
    next(error);
  }
});

module.exports = router;