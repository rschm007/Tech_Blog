const router = require("express").Router();
const sequelize = require("../config/connection");
const { User, Blog, Comment } = require("../models");
const withAuth = require("../utils/auth");

// GET all blogs that a user has posted
router.get("/", withAuth, async (req, res) => {
  try {
    // ACCESS Blog model and run .findAll method to find user_id from session
    await Blog.findAll({
      where: {
        user_id: req.session.user_id,
      },
      // include associated Comments
      include: [
        {
          model: Comment,
          attributes: ["id", "content", "date_created", "user_id"],
          include: {
            model: User,
            attributes: ["name"],
          },
        },
      ],
    }).then((dbBlogData) => {
      // serialize data first
      const blogs = dbBlogData.map((blog) => blog.get({ plain: true }));
      res.render("dashboard", { blogs, logged_in: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one blog post when User wants to EDIT
router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    // ACCESS Blog model and run .findOne method to matching req.params.id
    await Blog.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "created_at", "content"],
      // include associated Comments
      include: [
        {
          model: Comment,
          attributes: ["id", "content", "date_created", "user_id"],
          include: {
            model: User,
            attributes: ["name"],
          },
        },
      ],
    }).then((dbBlogData) => {
      if (!dbBlogData) {
        res.status(404).json({ message: "No blog post found with this ID" });
        return;
      }
      // serialize data first
      const blog = dbBlogData.get({ plain: true});
      res.render("edit-blog", { blog, logged_in: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;