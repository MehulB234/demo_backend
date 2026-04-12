const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");

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

const upload = multer({ storage });

let catalog = [
  {
    _id: 1,
    title: "Elden Ring",
    img_name: "/csce242/project/homepage/images/EldenRing.png",
    img_alt: "Elden Ring cover",
    platform: "PlayStation",
    genre: "RPG",
    price: 59.99,
    price_display: "$59.99",
    detail_link: "/csce242/project/part7/EldenRing/index.html",
  },
  {
    _id: 2,
    title: "Call of Duty",
    img_name: "/csce242/project/homepage/images/CallOfDuty.png",
    img_alt: "Call of Duty cover",
    platform: "Xbox",
    genre: "Shooter",
    price: 59.99,
    price_display: "$59.99",
    detail_link: "/csce242/project/part7/CallOfDuty/index.html",
  },
  {
    _id: 3,
    title: "Cyberpunk 2077",
    img_name: "/csce242/project/homepage/images/Cyberpunk2077.png",
    img_alt: "Cyberpunk 2077 cover",
    platform: "PC",
    genre: "Action / RPG",
    price: 49.99,
    price_display: "$49.99",
    detail_link: "/csce242/project/part7/Cyberpunk2077/index.html",
  },
  {
    _id: 4,
    title: "FC 26",
    img_name: "/csce242/project/homepage/images/FC26.png",
    img_alt: "FC 26 cover",
    platform: "PlayStation",
    genre: "Sports",
    price: 69.99,
    price_display: "$69.99",
    detail_link: "/csce242/project/part7/FC26/index.html",
    media_type: "video",
    trailer_id: "TSi0iJYSQ24",
  },
  {
    _id: 5,
    title: "Assassin's Creed",
    img_name: "/csce242/project/part7/Catalog/Images/Assassin.png",
    img_alt: "Assassin's Creed cover",
    platform: "Xbox",
    genre: "Action / Adventure",
    price: 54.99,
    price_display: "$54.99",
    detail_link: "/csce242/project/part7/AssassinsCreed/index.html",
  },
  {
    _id: 6,
    title: "Minecraft",
    img_name: "/csce242/project/part7/Catalog/Images/Minecraft.png",
    img_alt: "Minecraft cover",
    platform: "PC",
    genre: "Sandbox",
    price: 29.99,
    price_display: "$29.99",
    detail_link: "/csce242/project/part7/Minecraft/index.html",
  },
  {
    _id: 7,
    title: "God of War",
    img_name: "/csce242/project/part7/Catalog/Images/GodOfWar.png",
    img_alt: "God of War cover",
    platform: "PlayStation",
    genre: "Action",
    price: 59.99,
    price_display: "$59.99",
    detail_link: "/csce242/project/part7/GodOfWar/index.html",
  },
  {
    _id: 8,
    title: "Halo Infinite",
    img_name: "/csce242/project/part7/Catalog/Images/Halo.png",
    img_alt: "Halo Infinite cover",
    platform: "Xbox",
    genre: "Shooter",
    price: 59.99,
    price_display: "$59.99",
    detail_link: "/csce242/project/part7/Halo/index.html",
  },
];

const gameSchema = Joi.object({
  title: Joi.string().trim().min(2).max(60).required(),
  img_name: Joi.string().trim().required(),
  img_alt: Joi.string().trim().min(2).max(100).required(),
  platform: Joi.string().valid("PlayStation", "Xbox", "PC").required(),
  genre: Joi.string()
    .valid("RPG", "Shooter", "Action", "Sports", "Adventure", "Sandbox")
    .required(),
  price: Joi.number().min(0).max(100).required(),
  detail_link: Joi.string().trim().allow("").required(),
});

app.get("/api/catalog", (req, res) => {
  res.send(catalog);
});

app.get("/api/catalog/:id", (req, res) => {
  const foundCatalog = catalog.find((item) => item._id === parseInt(req.params.id));
  res.send(foundCatalog);
});

app.post("/api/catalog", (req, res) => {
  const { error, value } = gameSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((detail) => detail.message),
    });
  }

  const newGame = {
    _id: catalog.length ? Math.max(...catalog.map((game) => game._id)) + 1 : 1,
    ...value,
    price: Number(value.price),
    price_display: `$${Number(value.price).toFixed(2)}`,
  };

  catalog.push(newGame);

  res.status(201).json({
    success: true,
    game: newGame,
  });
});

app.delete("/api/catalog/:id", (req, res) => {
  const gameId = parseInt(req.params.id);
  const gameIndex = catalog.findIndex((game) => game._id === gameId);

  if (gameIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Game not found",
    });
  }

  const deletedGame = catalog.splice(gameIndex, 1)[0];

  res.json({
    success: true,
    game: deletedGame,
  });
});

app.listen(3001, () => {
  console.log("Server is up and running");
});