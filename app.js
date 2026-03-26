var http = require ("http");
const port = process.env.PORT || 3001;

http
    .createServer(function (req, res) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello World!");
    })
    .listen(port);

    const mongoose = require("mongoose");

    //testdb is name of database, it will automatically make it
    mongoose
      .connect("mongodb+srv://MehulB:Mehul@gamergauntlet.yehchv0.mongodb.net/")
      .then(() => console.log("Connected to mongodb..."))
      .catch((err) => console.error("could not connect ot mongodb...", err));
    
    const schema = new mongoose.Schema({
      name: String,
    });
    
    async function createMessage() {
      const result = await message.save();
      console.log(result);
    }
    
    //this creates a Message class in our app
    const Message = mongoose.model("Message", schema);
    const message = new Message({
      name: "Hello World",
    });
    
    createMessage();