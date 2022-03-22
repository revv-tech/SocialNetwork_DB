const{connection, Factory} = require('../Factory/query_factory');

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
    let sql = 'select * from post where id_user = ' + id_user;
    const result = await Factory(sql);
    res.json(result);
}

async function getPublicPosts(req, res){
    const{is_public} = req.params;
    let sql = 'select * from post where is_public = 1';
    const result = await Factory(sql);
    res.json(result);
}

async function getNotPublicPosts(req, res){
    const{is_public} = req.params;
    let sql = 'select * from post where is_public = 0';
    const result = await Factory(sql);
    res.json(result);
}
module.exports = {getAllData, getPostsbyUser, getPublicPosts, getNotPublicPosts};