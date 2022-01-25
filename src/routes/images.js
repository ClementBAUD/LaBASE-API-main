var express = require('express');
var router = express.Router();
const controllerImage = require('./../controllers/images.controller');

// add function create delete update and testing

router.post('/add', controllerImage.imagesUpload);

router.get("/files", controllerImage.getListFiles);

router.get("/files/:name", controllerImage.download);

module.exports = router;