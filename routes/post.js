const express=require('express');
const Post=require('../models/Post');
const router=express.Router();
const auth=require('../middleware/auth');
const User=require('../models/user');


// uploading post
router.post('/upload',auth,async(req,res)=>{
const {caption,image}=req.body;
const newPost = new Post({
    caption,
    image,
    postedBy: req.user
});
try {
    const post = await newPost.save();
    res.status(200).json(post);

} catch (e) {
    console.log(e);
}
});


// fetching all the posts
router.get('/allPost',async(req,res)=>{
    const    posts=await (await Post.find().populate('postedBy','_id username pic').populate('comments.postedBy','_id pic username')).reverse()
    try{
        res.status(200).json(posts)
    }catch(e){
        res.status(400).send(e)
    }
})

// fetching specific user posts
router.get('/myPost',auth,async(req,res)=>{
    const  posts=await Post.find({postedBy:req.user._id}).populate('postedBy','_id username pic').populate('comments','_id pic username')
    try{
        res.status(200).json(posts)
    }catch(e){
        res.status(400).send(e)
    }
})


// removing post;

router.delete('/removePost',auth,(req,res)=>{
    Post.findByIdAndDelete(req.body.postId,{
        new:true
    })
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
  })
  


  // commenting on post
  router.put('/comment', auth, async (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
            $push: {
                comments: comment
            }
        }, {
            new: true
        }).populate("comments.postedBy", "_id username pic")
        .populate("postedBy", "_id username").exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    error: err
                })
            } else {
                res.json(result)
            }
        })
})

// like a post
router.put('/like', auth, async (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {
            likes: req.user._id
        }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
})


// unlike a post
router.put('/unLike', auth, async (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {
            likes: req.user._id
        }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
})


// updating  profile

router.put('/update',auth,async(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
    $set:{username:req.body.username,pic:req.body.pic}
    }).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    })
  })
  

  // find users
router.get('/', auth, async (req, res) => {
    const keyword = req.query.search ? {
        $or: [{
                username: {
                    $regex: req.query.search,
                    $options: 'i'
                }
            },
            {
                email: {
                    $regex: req.query.search,
                    $options: 'i'
                }
            }
        ]
    } : {}
    const user = await User.find(keyword).find({
        _id: {
            $ne: req.user._id
        }
    })
    return res.json(user)
})


  
//follow a user
router.put("/follow", auth, (req, res) => {
    User.findByIdAndUpdate(
      req.body.userId,
      {
        $push: {
          followers: req.user._id,
        },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({
            error: err,
          });
        }
        User.findByIdAndUpdate(
          req.user._id,
          {
            $push: {
              followings: req.body.userId,
            },
          },
          {
            new: true,
          }
        )
          .select("-password")
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({
              error: err,
            });
          });
      }
    );
  });
  
  // unfollow a user
  router.put("/unFriend", auth, (req, res) => {
    User.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: {
          followers: req.user._id,
        },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({
            error: err,
          });
        }
        User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: {
              followers: req.body.userId,
            },
          },
          {
            new: true,
          }
        )
          .select("-password")
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({
              error: err,
            });
          });
      }
    );
  });






module.exports=router;