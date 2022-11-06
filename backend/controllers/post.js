const Post = require("../models/Post");
const fs = require("fs");
const User = require("../models/User");
const { Console } = require("console");

// créer un post
exports.createThing = (req, res, next) => {
  User.findOne({ _id: req.auth.userId })
    .then((user) => {
      const post = new Post({
        userId: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        feeling: req.body.post,
        createDate: new Date(),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      });
      post
        .save()
        .then(() => res.status(201).json({ message: "Post enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

// modifier un post
exports.modifyThing = (req, res, next) => {
  if (req.file) {
    Post.findById(req.params.id)
      .then((post) => {
        if (post.userId != req.auth.userId && !req.auth.admin) {
          res.status(401).json({ message: "Non autorisé !" });
        } else {
          Post.updateOne(
            { _id: req.params.id },
            {
              feeling: req.body.feeling,
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }
          )
            .then((response) => {
              res.status(200).json(response);
            })
            .catch((error) => {
              console.log(error);
              res.status(400).json(error);
            });
        }
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } else {
    Post.findById(req.params.id)
      .then((post) => {
        if (post.userId != req.auth.userId && !req.auth.admin) {
          res.status(401).json({ message: "Non autorisé !" });
        } else {
          Post.updateOne({ _id: req.params.id }, { feeling: req.body.feeling })
            .then((response) => {
              res.status(200).json(response);
            })
            .catch((error) => {
              console.log(error);
              res.status(400).json(error);
            });
        }
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  }
};

// effacer un post
exports.deleteThing = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post.userId === req.auth.userId || req.auth.admin) {
        const filename = post.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// afficher un post
exports.getOneThing = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => res.status(404).json({ error }));
};

//afficher tous les posts
exports.getAllThings = (req, res, next) => {
  Post.find()
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

// incréménter ou décrémenter les likes
exports.DislikeOrLike = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      // cas où l'utilisateur aime le post, il incrémente les likes
      let listeUsersLike = post.usersLiked;
      if (req.body.likes) {
        if (!post.usersLiked.includes(req.body.userId)) {
          listeUsersLike.push(req.body.userId);
          Post.updateOne(
            { _id: req.params.id },
            { likes: listeUsersLike.length, usersLiked: listeUsersLike }
          )
            .then(() => {
              Post.findOne({ _id: req.params.id }).then((response) =>
                res.status(201).json(response)
              );
            })
            .catch((error) => res.status(400).json(error));
        } else {
          Post.updateOne(
            { _id: req.params.id },
            { $inc: { likes: -1 }, $pull: { usersLiked: req.auth.userId } }
          )
            .then(() => {
              Post.findOne({ _id: req.params.id }).then((response) =>
                res.status(201).json(response)
              );
            })
            .catch((error) => res.status(400).json(error));
        }
      } else {
        Post.updateOne(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.auth.userId } }
        )
          .then(() => {
            Post.findOne({ _id: req.params.id }).then((response) =>
              res.status(201).json(response)
            );
          })
          .catch((error) => res.status(400).json(error));
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
