const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
    res.send({ message: "Hello from Express API on Vercel!" });
});

// Example route
app.get("/api/greet/:name", (req, res) => {
    res.json({ greeting: `Hello, ${req.params.name}!` });
});

// Export for Vercel
module.exports = app;

if (require.main === module) {
    const port = process.env.PORT || 5010;
    app.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });
}

