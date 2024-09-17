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
app.get("/", async (req,res)=>{
    const page= parseInt(req.query.page)||1;
    const search =req.query.search ||"";
    try{
        const [posts, paginator] = await postService.list(collection, page, search);

        res.render("home", {title:"메인 계시판", search, paginator, posts});
    }
    catch(error){
        console.error(error);
        res.render("home", {title:"메인 계시판"})
    }

    
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


app.get("/detail/:id", async(req,res)=>{
    const result = await postService.getDetailPost(collection, req.params.id);
    res.render("detail", {title:"상세 계시판",
        post:result.value,
    });
});



