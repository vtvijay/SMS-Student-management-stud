const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const publicKeyRoute = require("./routes/auth/publicKeyRoute");
const loginRoute = require("./routes/auth/loginRoute");
const { correlationIdMiddleware } = require("../correlationId");
const { head } = require("../enrollmentService/routes/enrollmentRoute");

dotenv.config();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again later.",
  headers: true,
});

// Initialize express app
const app = express();

// Middleware
app.use(express.json());

// Public Key
app.use("/.well-known/jwks.json", publicKeyRoute);

// Routes
app.use("/api/login", loginRoute);

app.use(correlationIdMiddleware);
app.use(limiter);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Auth Server running on port ${PORT}`);
});
