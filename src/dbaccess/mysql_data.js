const{connection, Factory} = require('../Factory/query_factory');
const storage = require('../config/multer');
const multer = require('multer');
const path = require('path')
const upload = multer({storage});

// Getters
async function getAllData(req, res){
    let sql_images = 'select * from image';
    const res_images = await Factory(sql_images);

    let sql_videos = 'select * from video';
    const res_videos = await Factory(sql_videos);

    let sql_documents = 'select * from document';
    const res_documents = await Factory(sql_documents);

    let sql_posts = 'select * from post';
    const res_posts= await Factory(sql_posts);

    let sql_users = 'select * from user';
    const res_users= await Factory(sql_users);

    res.json({images: res_images, vidoes: res_videos, documents: res_documents, posts: res_posts, users: res_users});
}

async function getAllPosts(req, res){
    let sql_posts = 'select * from post';
    const posts= await Factory(sql_posts);
    console.log(posts);
    return posts;
}
// Get profile pic
async function getProfilePic(req, res){
    const{email_user} = req.params;
    let sql = `select * from post where email_user = ${email_user};`;
    const posts= await Factory(sql_posts);
    console.log(posts);
    return posts;
}

async function getPostsbyUser(req, res){
    const{id_user} = req.params;
    let sql = `select * from post where id_user = ${id_user};`;
    const result = await Factory(sql);
    res.json(result);
}

async function getPublicPosts(req, res){
    let sql = 'select * from post where is_public = 1;';
    const result = await Factory(sql);
    res.json(result);
}

async function getNotPublicPosts(req, res){
    let sql = 'select * from post where is_public = 0;';
    const result = await Factory(sql);
    res.json(result);
}

// Creates
async function newImage(req, res){
    const {body, files} = req;
    if(files){
        for (const file of files) {
            let url = `http://localhost:5000/images/${file.filename}`
            let sql = `insert into image (image, id_post) values ('${url}', 28);`; // Falta obtener id_post
            const result = await Factory(sql);
        }
        //const { id_post } = result;
        res.redirect('/posts/create/addVideos');
    } else {
        console.log('NO IMAGES')
    }
}


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
        let sql = `UPDATE profilepic SET image = '${url}' WHERE email_user = '${req.user.email}';` // Falta obtener id_post
        const result = await Factory(sql);
        res.redirect('/dashboard');
    } else {
        console.log('NO IMAGES')
    }
}

// Ejemplo de como insertar una imagen en la BD
async function addOneImage(req, res){
    const {body, file} = req;
    if(file){
        let url = `http://localhost:5000/images/${file.filename}`
        let sql = `insert into image (image, id_post) values ('${url}', 28);`;
        const result = await Factory(sql);
        res.send('image added');
    } else {
        console.log('NO IMAGES')
    }
}

async function newVideo(req, res){
    const {body, files} = req;
    if(files) {
        for (const file of files) {
            let url = `http://localhost:5000/videos/${file.filename}`
            let sql = `insert into video (video, id_post) values ('${url}', 28);`;
            const result = await Factory(sql);
        }
        //const { id_post } = result;
        //console.log(id);
        res.redirect('/posts/create/addDocuments');
    } else {
        res.send('video not received');
    }
}

async function newDocument(req, res){
    const {body, files} = req;
    if(files) {
        for (const file of files) {
            let url = `http://localhost:5000/documents/${file.filename}`
            let sql = `insert into document (document, id_post) values ('${url}', 28);`; // AGREAGAR EN ID_POST: ${connection.escape(body.id_post)}
            const result = await Factory(sql);
        }
        res.redirect('/posts/myPosts');
    } else {
        res.send('document not received');
    }
}

async function newPost(req, res){
    const{description, isPublic, email} = req.body;
    var is_public = false;
    if (isPublic == 'on'){
        is_public = true;
      }
    if(!description){
        errors.push({ msg: 'Please enter a description' });
    } else {
        let sql = `insert into post (text, is_public, email_user) values ('${description}', ${is_public}, '${email}');`;
        var result = await Factory(sql);
        //sql = `select max(id) id from post;`;
        //result = await Factory(sql);
        //console.log(result);
        //const {id} = result;
        //console.log(id);
        res.redirect('/posts/create/addImages')
    }
}

module.exports = {
    getAllData, 
    getPostsbyUser, 
    getPublicPosts, 
    getNotPublicPosts, 
    newImage, 
    newVideo, 
    newDocument, 
    newPost,
    getAllPosts,
    newImagePP,
    newImagePPUpdate
};