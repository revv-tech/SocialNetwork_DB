const{connection, Factory} = require('../Factory/query_factory');
const storage = require('../config/multer');
const multer = require('multer');
const path = require('path')
const upload = multer({storage});

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

// Creates
async function newImage(req, res){
    const {files} = req;
    console.log(req.params.id);
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
    deletePost
};