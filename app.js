const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path")
const app = express();
const port=3000;

app.use(express.static(path.join(__dirname, 'public')));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

//라우터 설정
app.get("/", (req,res)=>{
    res.render("home", {title:"계시판1", message:"mmmmmeeeeesssssaaaaggggeeee"});
})

app.listen( port,()=>{
    console.log(`START SERVER : use ${port}`);
});