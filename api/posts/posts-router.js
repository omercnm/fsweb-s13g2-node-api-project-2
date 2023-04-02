// posts için gerekli routerları buraya yazın
const postModel = require("./posts-model");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    let allPosts = await postModel.find();
    res.json(allPosts);
  } catch (error) {
    res.status(500).json({ message: "Gönderilen alınamadı" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let isPostExist = await postModel.findById(req.params.id);
    if (!isPostExist) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      res.json(isPostExist);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});

router.post("/", async (req, res) => {
  try {
    let { title, contents } = req.body;
    if (!title || !contents) {
      res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın",
      });
    } else {
      let inserted = await postModel.insert({
        title: title,
        contents: contents,
      });
      let insertedPost = await postModel.findById(inserted.id);
      res.status(201).json(insertedPost);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let isPostExist = await postModel.findById(req.params.id);
    if (!isPostExist) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      let { title, contents } = req.body;
      if (!title || !contents) {
        res.status(400).json({
          message: "Lütfen gönderi için bir title ve contents sağlayın",
        });
      } else {
        await postModel.update(req.params.id, {
          title: title,
          contents: contents,
        });
        let updatePost = await postModel.findById(req.params.id);
        res.json(updatePost);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgisi güncellenemedi" });
  }
});

router.delete("./:id", async (req, res) => {
  try {
    let isPostExist = await postModel.findById(req.params.id);
    if (!isPostExist) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      await postModel.remove(req.params.id);
      res.json(isPostExist);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    let isPostExist = await postModel.findById(req.params.id);
    if (!isPostExist) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      let comments = await postModel.findPostComments(req.params.id);
      res.json(comments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});
module.exports = router;
