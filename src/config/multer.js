const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if (file.mimetype.split('/')[0] === "image") {
            cb(null, path.join(__dirname, '../../static/images'))
        }
        else if (file.mimetype.split('/')[0] === "video") {
            cb(null, path.join(__dirname, '../../static/videos'))
        }
        else{
            cb(null, path.join(__dirname, '../../static/documents'))
        }
    },
    filename: function(req, file, cb){
        if (file.mimetype.split('/')[0] === "image") {
            cb(null, 'image' + Date.now() + '.' + file.mimetype.split('/')[1])
        }
        else if (file.mimetype.split('/')[0] === "video") {
            cb(null, 'video' + Date.now() + '.' + file.mimetype.split('/')[1])
        }
        else{
            cb(null, 'document' + Date.now() + '.' + file.mimetype.split('/')[1])
        }
    }
})
module.exports = storage;