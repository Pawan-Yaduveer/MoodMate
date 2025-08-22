const express = require("express");
const { getPlaylistsByMood } = require("../controllers/musicController");

const router = express.Router();

router.get('/:mood', getPlaylistsByMood);

module.exports = router;
