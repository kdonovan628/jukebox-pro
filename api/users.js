const express = require(`express`);
const router = express.Router();
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();

router.get(`/`, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next (error);
  }
});

router. get(`/:id`, async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include:  { playlists: true },
    });
    if (!user) return res.status(404).json({ error: `User not found` });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;