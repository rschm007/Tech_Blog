const router = require("express").Router();
const { Comment, User, Blog } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    // find all blogs with associated comments AND usernames attributed to those comments
    await Blog.findAll({ include: [{ all: true, nested: true }] }).then(
      (dbPostData) => {
        const blogs = dbPostData.map((blog) => blog.get({ plain: true }));
        res.render("homepage", {
          blogs,
          loggedIn: req.session.loggedIn,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/comment/:id", async (req, res) => {
  try {
    const commentData = await Comment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const comment = commentData.get({ plain: true });

    res.render("blog-post", {
      ...comments,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET dashboard
// Use withAuth middleware to prevent access to route
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render("dashboard", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/");
    console.log("User is already logged in");
    return;
  }

  res.render("login");
});

module.exports = router;
