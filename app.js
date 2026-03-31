const express = require ("express");
const cors = require ("cors");
const multer = require ("multer");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

let catalog = [
  {
    "_id": 1,
    "title": "Elden Ring",
    "img_name": "/csce242/project/homepage/images/EldenRing.png",
    "img_alt": "Elden Ring cover",
    "platform": "PlayStation",
    "genre": "RPG",
    "price": 59.99,
    "price_display": "$59.99",
    "detail_link": "/csce242/project/part7/EldenRing/index.html"
  },
  {
    "_id": 2,
    "title": "Call of Duty",
    "img_name": "/csce242/project/homepage/images/CallOfDuty.png",
    "img_alt": "Call of Duty cover",
    "platform": "Xbox",
    "genre": "Shooter",
    "price": 59.99,
    "price_display": "$59.99",
    "detail_link": "/csce242/project/part7/CallOfDuty/index.html"
  },
  {
    "_id": 3,
    "title": "Cyberpunk 2077",
    "img_name": "/csce242/project/homepage/images/Cyberpunk2077.png",
    "img_alt": "Cyberpunk 2077 cover",
    "platform": "PC",
    "genre": "Action / RPG",
    "price": 49.99,
    "price_display": "$49.99",
    "detail_link": "/csce242/project/part7/Cyberpunk2077/index.html"
  },
  {
    "_id": 4,
    "title": "FC 26",
    "img_name": "/csce242/project/homepage/images/FC26.png",
    "img_alt": "FC 26 cover",
    "platform": "PlayStation",
    "genre": "Sports",
    "price": 69.99,
    "price_display": "$69.99",
    "detail_link": "/csce242/project/part7/FC26/index.html",
    "media_type": "video",
    "trailer_id": "TSi0iJYSQ24"
  },
  {
    "_id": 5,
    "title": "Assassin's Creed",
    "img_name": "/csce242/project/part7/Catalog/Images/Assassin.png",
    "img_alt": "Assassin's Creed cover",
    "platform": "Xbox",
    "genre": "Action / Adventure",
    "price": 54.99,
    "price_display": "$54.99",
    "detail_link": "/csce242/project/part7/AssassinsCreed/index.html"
  },
  {
    "_id": 6,
    "title": "Minecraft",
    "img_name": "/csce242/project/part7/Catalog/Images/Minecraft.png",
    "img_alt": "Minecraft cover",
    "platform": "PC",
    "genre": "Sandbox",
    "price": 29.99,
    "price_display": "$29.99",
    "detail_link": "/csce242/project/part7/Minecraft/index.html"
  },
  {
    "_id": 7,
    "title": "God of War",
    "img_name": "/csce242/project/part7/Catalog/Images/GodOfWar.png",
    "img_alt": "God of War cover",
    "platform": "PlayStation",
    "genre": "Action",
    "price": 59.99,
    "price_display": "$59.99",
    "detail_link": "/csce242/project/part7/GodOfWar/index.html"
  },
  {
    "_id": 8,
    "title": "Halo Infinite",
    "img_name": "/csce242/project/part7/Catalog/Images/Halo.png",
    "img_alt": "Halo Infinite cover",
    "platform": "Xbox",
    "genre": "Shooter",
    "price": 59.99,
    "price_display": "$59.99",
    "detail_link": "/csce242/project/part7/Halo/index.html"
  }
];

app.get("/api/catalog",(req,res)=>{
  res.send(catalog);
});

app.get("/api/catalog/:id", (req, res) => {
  const foundCatalog = catalog.find((item) => item._id === parseInt(req.params.id));
  res.send(foundCatalog);
});

//listen for incoming requests
app.listen(3001, ()=>{
  console.log("Server is up and running");
});