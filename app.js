const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Game = require("./models/Game");

const seedGames = require("./data/catalog");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const publicImagesDir = path.join(__dirname, "public", "images");

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicImagesDir);
  },
  filename: (req, file, cb) => {
    const safeName = path.basename(file.originalname).replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

const baseGameSchema = Joi.object({
  title: Joi.string().trim().min(2).max(60).required(),
  img_alt: Joi.string().trim().min(2).max(100).required(),
  platform: Joi.string().valid("PlayStation", "Xbox", "PC").required(),
  genre: Joi.string()
    .valid("RPG", "Shooter", "Action", "Sports", "Adventure", "Sandbox")
    .required(),
  price: Joi.number().min(0).max(100).required(),
  detail_link: Joi.string().trim().allow("").required(),
});

const editGameSchema = baseGameSchema.keys({
  currentImageName: Joi.string().trim().min(1).required(),
});

const deleteUploadedFile = (imageName) => {
  if (!imageName || imageName.startsWith("/")) return;

  const filePath = path.join(publicImagesDir, imageName);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn("Could not delete uploaded image:", err.message);
  }
};

async function seedDatabaseIfEmpty() {
  const count = await Game.countDocuments();

  if (count > 0) {
    console.log("Database already has games. Skipping seed.");
    return;
  }

  const formattedGames = seedGames.map((game) => ({
    title: game.title,
    img_name: game.img_name,
    img_alt: game.img_alt,
    platform: game.platform,
    genre: game.genre,
    price: Number(game.price),
    price_display: game.price_display || `$${Number(game.price).toFixed(2)}`,
    detail_link: game.detail_link || "",
  }));

  await Game.insertMany(formattedGames);
  console.log("Seeded MongoDB from JSON data.");
}

app.get("/api/catalog", async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: 1 });
    res.send(games);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch games.",
    });
  }
});

app.get("/api/catalog/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    res.send(game);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch game.",
    });
  }
});

app.post("/api/catalog", upload.single("image"), async (req, res) => {
  const errors = [];

  if (!req.file) {
    errors.push("Image file is required.");
  }

  const { error, value } = baseGameSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    errors.push(...error.details.map((detail) => detail.message));
  }

  if (errors.length > 0) {
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }

    return res.status(400).json({
      success: false,
      errors,
    });
  }

  try {
    const newGame = new Game({
      title: value.title,
      img_name: req.file.filename,
      img_alt: value.img_alt,
      platform: value.platform,
      genre: value.genre,
      price: Number(value.price),
      price_display: `$${Number(value.price).toFixed(2)}`,
      detail_link: value.detail_link,
    });

    await newGame.save();

    res.status(201).json({
      success: true,
      game: newGame,
    });
  } catch (err) {
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }

    res.status(500).json({
      success: false,
      message: "Failed to save game.",
    });
  }
});

app.put("/api/catalog/:id", upload.single("image"), async (req, res) => {
  const { error, value } = editGameSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }

    return res.status(400).json({
      success: false,
      errors: error.details.map((detail) => detail.message),
    });
  }

  try {
    const existingGame = await Game.findById(req.params.id);

    if (!existingGame) {
      if (req.file) {
        deleteUploadedFile(req.file.filename);
      }

      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    if (req.file) {
      deleteUploadedFile(existingGame.img_name);
      existingGame.img_name = req.file.filename;
    } else {
      existingGame.img_name = value.currentImageName;
    }

    existingGame.title = value.title;
    existingGame.img_alt = value.img_alt;
    existingGame.platform = value.platform;
    existingGame.genre = value.genre;
    existingGame.price = Number(value.price);
    existingGame.price_display = `$${Number(value.price).toFixed(2)}`;
    existingGame.detail_link = value.detail_link;

    await existingGame.save();

    res.status(200).json({
      success: true,
      game: existingGame,
    });
  } catch (err) {
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }

    res.status(500).json({
      success: false,
      message: "Failed to update game.",
    });
  }
});

app.delete("/api/catalog/:id", async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);

    if (!deletedGame) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    deleteUploadedFile(deletedGame.img_name);

    res.status(200).json({
      success: true,
      game: deletedGame,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete game.",
    });
  }
});

app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      errors: [err.message || "Upload failed."],
    });
  }

  next();
});

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedDatabaseIfEmpty();

    app.listen(PORT, () => {
      console.log(`Server is up and running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });