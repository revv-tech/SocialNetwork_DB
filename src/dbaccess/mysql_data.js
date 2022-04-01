const{connection, Factory} = require('../Factory/query_factory');
const storage = require('../config/multer');
const multer = require('multer');
const path = require('path')
const upload = multer({storage});
const fs = require('fs').promises

// Profile Pic Upload
async function newImagePP(req, res, email){
    const {body, file} = req;
    
    if(file){
        let url = `http://localhost:5000/images/${file.filename}`
        let sql = `insert into profilepic (image, email_user) values ('${url}', '${email}');;` // Falta obtener id_post
        const result = await Factory(sql);
        
        res.redirect('/dashboard');
    } else {
        console.log('NO IMAGES')
    }
}

// Profile Pic Update
async function newImagePPUpdate(req, res){
    const {body, file} = req;
    
    if(file){
        let url = `http://localhost:5000/images/${file.filename}`
        let sql = `UPDATE profilepic SET image = '${url}' WHERE email_user = '${req.user.email}';`;
        const result = await Factory(sql);
        res.redirect('/dashboard');
    } else {
        console.log('NO IMAGES')
    }
}

// New Image
async function newImage(req, res){
    const {files} = req;
    if(files){
        for (const file of files) {
            let url = `http://localhost:5000/images/${file.filename}`
            let sql = `insert into image (image, id_post) values ('${url}', ${req.params.id});`;
            const result = await Factory(sql);
        }
        res.redirect('/posts/create/addVideos/' + req.params.id);
    } else {
        res.redirect('/posts/create/addVideos/' + req.params.id);
    }
}


// New Document
async function newVideo(req, res){
    const {files} = req;
    if(files) {
        for (const file of files) {
            let url = `http://localhost:5000/videos/${file.filename}`
            let sql = `insert into video (video, id_post) values ('${url}', ${req.params.id});`;
            const result = await Factory(sql);
        }
        res.redirect('/posts/create/addDocuments/' + req.params.id);
    } else {
        res.redirect('/posts/create/addDocuments/' + req.params.id);
    }
}

// New Documents
async function newDocument(req, res){
    const {files} = req;
    if(files) {
        for (const file of files) {
            let url = `http://localhost:5000/documents/${file.filename}`
            let sql = `insert into document (document, id_post) values ('${url}', ${req.params.id});`;
            const result = await Factory(sql);
        }
        res.redirect('/posts/myPosts/');
    } else {
        res.redirect('/posts/myPosts/');
    }
}

// New Post
async function newPost(req, res){
    const{description, isPublic, email} = req.body;
    var is_public = false;
    if (isPublic == 'on'){
        is_public = true;
    }
    let sql = `insert into post (text, is_public, email_user) values ('${description}', ${is_public}, '${email}');`;
    var result = await Factory(sql);
    sql = `select max(id) id from post;`;
    result = await Factory(sql);
    res.redirect('/posts/create/addImages/' + result[0].id)
}

// Delete Image
async function deleteImage(req, res){
    let sql = `Select image FROM image WHERE id = ${req.params.idImage};`;
    var imageResult = await Factory(sql);
    sql = `DELETE FROM image WHERE id = ${req.params.idImage};`;
    var result = await Factory(sql);
    var image = imageResult[0].image.split('/')[imageResult[0].image.split('/').length-1];
    fs.unlink('./static/images/' + image, (error) => {
        if(error){
            console.log(`Error: ${error}`)
        }
    });
    res.redirect('/posts/editFiles/' + req.params.idPost)
}

// Delete Video
async function deleteVideo(req, res){
    let sql = `Select video FROM video WHERE id = ${req.params.idVideo};`;
    var videoResult = await Factory(sql);
    sql = `DELETE FROM video WHERE id = ${req.params.idVideo};`;
    var result = await Factory(sql);
    var video = videoResult[0].video.split('/')[videoResult[0].video.split('/').length-1];
    fs.unlink('./static/videos/' + video, (error) => {
        if(error){
            console.log(`Error: ${error}`)
        }
    });
    res.redirect('/posts/editFiles/' + req.params.idPost)
}

// Delete Document
async function deleteDocument(req, res){
    let sql = `Select document FROM document WHERE id = ${req.params.idDocument};`;
    var documentResult = await Factory(sql);
    sql = `DELETE FROM document WHERE id = ${req.params.idDocument};`;
    var result = await Factory(sql);
    var document = documentResult[0].document.split('/')[documentResult[0].document.split('/').length-1];
    fs.unlink('./static/documents/' + document, (error) => {
        if(error){
            console.log(`Error: ${error}`)
        }
    });
    res.redirect('/posts/editFiles/' + req.params.idPost)
}

// Edit Post
async function editPost(req, res){
    const{description, isPublic, email} = req.body;
    var is_public = false;
    if (isPublic == 'on'){
        is_public = true;
    }
    let sql = `UPDATE post SET text = '${description}' WHERE id = ${req.params.id};`;
    var result = await Factory(sql);
    sql = `UPDATE post SET is_public = ${is_public} WHERE id = ${req.params.id};`;
    result = await Factory(sql);
    res.redirect('/posts/editFiles/' + req.params.id)
}

// Delete Posts
async function deletePost(req, res){
    let sql = `DELETE FROM post WHERE id = ${req.params.id};`;
    var result = await Factory(sql);
    res.redirect('/posts/myPosts/')
}


module.exports = {
    newImage, 
    newVideo, 
    newDocument, 
    newPost,
    newImagePP,
    newImagePPUpdate,
    deletePost,
    editPost,
    deleteImage,
    deleteVideo,
    deleteDocument
};