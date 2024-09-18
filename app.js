const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path")
const app = express();
const port=3000;
const mongodbConnection=require("./configs/mongodb-connection")
const postService=require("./services/post-service");
const {ObjectId}= require("mongodb");

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
    res.render("write", {title:"글쓰기 계시판 ", mode: "create"});
});

app.get("/modify/:id", async (req, res)=>{
    const {id} = req.params.id;

    const post = await postService.getPostById(collection, req.params.id);
    console.log(post);
    res.render("write", {title: "글쓰기 게시판", mode:"modify", post});
})

app.post("/modify/", async (req, res)=>{
    const {id, title, writer, password, content} = req.body;

    const post = {
        title,
        writer,
        password,
        content,
        createDt: new Date().toISOString(),
    };
    const result = postService.updatePost(collection, id, post);
    res.redirect(`/detail/${id}`);
})

app.post("/write", async (req, res)=>{
    const post= req.body;
    const result = await postService.writePost(collection, post);
    res.redirect(`/detail/${result.insertedId}`);
})

//


app.get("/detail/:id", async (req, res) => {
    try {
        const post = await postService.getDetailPost(collection, req.params.id);
        console.log(post);  
        if (!post) {  
            return res.status(404).send("Post not found");
        }

        res.render("detail", {
            title: "상세 게시판",
            post: post,  
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/check-password", async (req, res)=>{
    const {id, password}=req.body;

    const post = await postService.getPostByIdAndPassword(collection, {id, password});

    console.log(post)
    if(!post){
        return res.status(404).json({isExist:false});
    } else {
        return res.json({isExist: true});
    }
});


app.delete("/delete", async (req, res)=>{
    const {id, password}=req.body;
    try {
        const result = await collection.deleteOne({_id:new ObjectId(id), password:password});
        if(result.deletedCount !==1) {
            console.log("삭제 실패");
            return res.json({isSuccess: false});
        }
        return res.json({isSuccess:true});
    } catch (error){
        console.error(error);
        return res.json({isSuccess: false});
    }
})





