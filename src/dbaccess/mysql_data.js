/*
const{connection, Factory} = require('../Factory/query_factory');

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
    const {body, file} = req;
    if(file) {
        let url = `http://localhost:5000/images/${file.filename}`
        let sql = `insert into image (image, id_post) values ('${connection.escape(url)}', ${connection.escape(body.id_post)});`;
        const result = await Factory(sql);
        res.json(result);
    }
}

async function newVideo(req, res){
    const {body, file} = req;
    if(file) {
        let url = `http://localhost:5000/videos/${file.filename}`
        let sql = `insert into video (video, id_post) values ('${connection.escape(url)}', ${connection.escape(body.id_post)});`;
        const result = await Factory(sql);
        res.json(result);
    }
}

async function newDocument(req, res){
    const {body, file} = req;
    if(file) {
        let url = `http://localhost:5000/documents/${file.filename}`
        let sql = `insert into document (document, id_post) values ('${connection.escape(url)}', ${connection.escape(body.id_post)});`;
        const result = await Factory(sql);
        res.json(result);
    }
}

async function newUser(req, res){
    const{id_user} = req.params;
    console.log(req.params);
    let sql = `insert into user values (${connection.escape(id_user)});`;
    const result = await Factory(sql);
    res.json(result);
}

async function newPost(req, res){
    const{text, is_public, id_user} = req.params;
    let sql = `insert into post (text, is_public, id_user) values (${text}, ${is_public}, ${id_user});`;
    const result = await Factory(sql);
    res.json(result);
}
module.exports = {getAllData, getPostsbyUser, getPublicPosts, getNotPublicPosts, newImage, newVideo, newDocument, newUser, newPost};
*/