const router = require("express").Router();
const { Blog } = require("../../models");
const withAuth = require("../../utils/auth");

// POST a blog
router.post("/", withAuth, async (req, res) => {
  try {
    await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE a blog
router.put("/:id", withAuth, async (req, res) => {
  try {
    await Blog.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then((dbBlogData) => {
      if (!dbBlogData) {
        res.status(404).json({ message: "No blog found with this ID" });
        return;
      }
      res.json(dbBlogData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE a blog
router.delete("/:id", withAuth, async (req, res) => {
  try {
    await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    }).then((dbBlogData) => {
      if (!dbBlogData) {
        res.status(404).json({ message: "No blog found with this id!" });
        return;
      }
    });
    res.status(200).json(dbBlogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
