const dotenv=require('dotenv');
const express=require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
const signup=require('./routes/signup');
const login=require('./routes/login');
const post=require('./routes/post');

dotenv.config({path:'./.env'});

app.use(cors());
app.use(express.json())

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("connected to mongodb")).catch(error=>console.log(error));


app.use('/auth',signup);
app.use('/auth',login);
app.use('/api',post);

const port=process.env.PORT||5000
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
});



