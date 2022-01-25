const fs = require("fs");
const baseUrl = "https://www.apiba.fr/";

exports.imagesUpload = (req, res) => {
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("Aucun fichier n'a été téléchargé.");
    }
    // console.log(sampleFile);
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files;
    
    const parts = sampleFile.files.name.split(".");
    const extension = parts[parts.length - 1];

    file=  "images" + '-' + Date.now()+'.'+extension;
    //
    // console.log(sampleFile);
    uploadPath = '/public/images/produits/' +file ;
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.files.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
  
      res.send('Fichier téléchargé !');
    });
}

exports.getListFiles = (req, res) => {

    const directoryPath = __basedir + "/public/images/produits/";
  
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }
  
      let fileInfos = [];
  
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        });
      });
  
      res.status(200).send(fileInfos);
    });
  
}

exports.download = (req, res) => {
  const fileName = req.query.name;
  const directoryPath = __basedir + "/public/images/produits/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Impossible de télécharger le fichier. " + err,
      });
    }
  });
};