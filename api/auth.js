const express = require("express"); 
const router = express.Router();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
}

const prisma = require("../prisma");

router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);
  if (!token) return next();

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const customer = await prisma.customer.findUniqueOrThrow({
      where: { id },
    });
    req.customer = customer; 
    next();
  } catch(error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const customer = await prisma.customer.register(email, password);
    const token = createToken(customer.id);
    res.status(201).json({ token })
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const customer = await prisma.customer.login(email, password);
    const token = createToken(customer.id);
    res.status(201).json({ token })
  } catch(error) {
    next(error);
  }
});

function authenticate(req, res, next) { 
  if (req.customer) {
    next();
  } else {
    next ({ status: 401, message: " You must be logged in."});
  }
}

module.exports = {
  router,
  authenticate,
};