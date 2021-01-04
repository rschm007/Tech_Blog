const router = require("express").Router();

// =========================
// GET ROUTES  - Display Pages
// =========================
// root route
router.get("/", function (req, res) {
    res.render("index");
  });