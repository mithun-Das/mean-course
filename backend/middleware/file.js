const multer = require("multer");

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg'
};

const storage = multer.diskStorage({

    destination : (req, file, cb) => {
        var isValid = MIME_TYPE_MAP[file.mimetype];
        var error = new Error("Invalid mime type");

        if(isValid) { error = null ; }

        cb(error,"backend/images");
    },
    filename : (req,file,cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('_');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '_' + Date.now() + '.' + ext);
    }
});

module.exports = multer({storage : storage}).single("image");