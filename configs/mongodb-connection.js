const{MongoClient} = require("mongodb");


const uri = "mongodb+srv://cool102476:v0lqQweuNCVXByqZ@cluster0.luft1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
module.exports = function (callback){
    return MongoClient.connect(uri, callback);
}