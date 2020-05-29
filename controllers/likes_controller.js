const Like = require('../models/likes');
const Post = require('../models/posts');
const Comment = require('../models/comments');


module.exports.toggleLike = async function (req,res) {
    
try {

    let likeable;
    let deleted = false;

    if (req.query.type=='Post'){

        likeable = await Post.findById(req.query.id).populate('likes')
    }
    else{
        likeable = await Comment.findById(req.query.id).populate('likes')

    }
    
    
    let existingLike = await Like.findone({
        likeable:req.query.id,
        emodel:req.query.type,
        user:req.user.id

    });


if (existingLike){

    likeable.likes.pull(existingLike.id);
    likeable.save();
    existingLike.remove();
    deleted = true;

}

else{

    let newLike = await Like.create({

        user:req.user.id,
        likeable:req.query.id,
        onModel:req.query.type
    });
    likeable.likes.pull(Like._id);
    likeable.save();

}

return res.json(200,{

    message:"Request Successfull",
    data:{

        deleted:deleted
    }
})


} catch (err) {
  
    console.log(err)
return res.json(500,{

    message:'Internal Server Error'
});

}


}