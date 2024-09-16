const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path")
const app = express();
const port=3000;
const mongodbConnection=require("./configs/mongodb-connection")
const postService=require("./services/post-service");
app.use(express.static(path.join(__dirname, 'public')));

app.engine("handlebars", handlebars.create({
    helpers:require("./configs/handlebars-helpers"),
}).engine,);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");


let collection;
app.listen( port, async ()=>{
    console.log(`START SERVER : use ${port}`);
    const mongoClient = await mongodbConnection();
    collection = mongoClient.db().collection("post");
    console.log("MongoDB connected~");
});


//미들웨어
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//

//라우터 설정
app.get("/", (req,res)=>{
    res.render("home", {title:"계시판1", message:"mmmmmeeeeesssssaaaaggggeeee"});
});


//글쓰기
app.get("/write", (req,res)=>{
    res.render("write", {title:"글쓰기 계시판 테스트"});
});
app.post("/write", async (req, res)=>{
    const post= req.body;
    const result = await postService.writePost(collection, post);
    res.redirect(`/detail/${result.insertedId}`);
})

//


app.get("/detail", (req,res)=>{
    res.render("detail", {title:"상세 계시판 테스트"});
});



