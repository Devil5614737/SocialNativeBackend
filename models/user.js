const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');



const userSchema=new mongoose.Schema({
   
      username: {
        type: String,
        maxlength: 22,
        minlength: 5,
      },
      email: {
        type: String,
        maxlength: 40,
        minlength: 5,
      },
      password: {
        type: String,
        maxlength: 2222,
        minlength: 5,
      },
      pic:{
        type:String,
        default:"https://images.unsplash.com/photo-1660211302417-a8cf992c33b8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
      },
      followers:[
        {type:mongoose.Schema.Types.ObjectId,ref:"User"}
      ],
      following:[
        {type:mongoose.Schema.Types.ObjectId,ref:"User"}
      ]
});


userSchema.methods.generateAuthToken=function(){
  const token=jwt.sign({_id:this._id},"fjsdofjsdofiasdjfhjsdfhjnsdflkgdjshngjkdlhjfgoigfujgfhdjgklfguyfoigfdglfkdgjnfdslgjfdsgklfdshjgfodigugoerutoreiutregngfdngfdghjfghfdghfgjgfdjlgjfdsgofgjufgfjsglfgjflgjfdsglujgoifgujfdslk");
  return token;
}


const User=mongoose.model("User",userSchema);


module.exports=User;
