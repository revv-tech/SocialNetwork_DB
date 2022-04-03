const express = require('express');
const router = express.Router();
const pool = require('../config/mysqlDB');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const {newDocument, newImage, newVideo, newPost, deletePost, editPost, deleteImage, deleteVideo, deleteDocument} = require('../dbaccess/mysql_data');
const storage = require('../config/multer');
const multer = require('multer');
const path = require('path')
const upload = multer({storage});
const{connection, Factory} = require('../Factory/query_factory');
const neo4jdb = require('../dbaccess/neo4j');
const { response } = require('express');

// Delete Post
router.get('/deletePost/:id', deletePost);

// Delete Image
router.get('/deleteImage/:idPost/:idImage', deleteImage);

// Delete Video
router.get('/deleteVideo/:idPost/:idVideo', deleteVideo);

// Delete Document
router.get('/deleteDocument/:idPost/:idDocument', deleteDocument);

// Edit Post Files
router.get('/editFiles/:id', ensureAuthenticated, async (req, res) => {
  let sql_posts = `select * from post where id = '${req.params.id}';`;
  const post= await Factory(sql_posts);
  let sql_images = `SELECT * FROM image where id_post = '${req.params.id}';`;
  const images = await Factory(sql_images);
  let sql_videos = `SELECT * FROM video where id_post = '${req.params.id}';`;
  const videos = await Factory(sql_videos);
  let sql_documents = `SELECT * FROM document where id_post = '${req.params.id}';`;
  const documents = await Factory(sql_documents);
  res.render('editFilesPost', { user: req.user, post: post[0], images: images, videos: videos, documents: documents });
});

// Edit Post
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  let sql_posts = `select * from post where id = '${req.params.id}';`;
  const post= await Factory(sql_posts);
  res.render('editPost', { user: req.user, post: post[0] });
});
router.post('/edit/:id', editPost);


// Create Post
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('createPost', { user: req.user });
});
router.post('/create', newPost);


// Create Images
router.get('/create/addImages/:id', ensureAuthenticated, (req, res) => {
  res.render('postAddImages', { id: req.params.id });
}); 
router.post('/create/addImages/:id', upload.array('images'), newImage);


// Create Videos
router.get('/create/addVideos/:id', ensureAuthenticated, (req, res) => {
  res.render('postAddVideos', { id: req.params.id });
}); 
router.post('/create/addVideos/:id', upload.array('videos'), newVideo);


// Create Documents
router.get('/create/addDocuments/:id', ensureAuthenticated, (req, res) => {
  res.render('postAddDocuments', { id: req.params.id });
}); 
router.post('/create/addDocuments/:id', upload.array('documents'), newDocument);

// My Posts
router.get('/myPosts', ensureAuthenticated, async(req, res) => {
  let sql_posts = `select * from post where email_user = '${req.user.email}';`;
  const posts= await Factory(sql_posts);
  let sql_images = `SELECT distinct image, id_post FROM image inner join post on post.email_user = '${req.user.email}';`;
  const images = await Factory(sql_images);
  let sql_videos = `SELECT distinct video, id_post FROM video inner join post where post.email_user = '${req.user.email}';`;
  const videos = await Factory(sql_videos);
  let sql_documents = `SELECT distinct document, id_post FROM document inner join post where post.email_user = '${req.user.email}';`;
  const documents = await Factory(sql_documents);
  res.render('myPosts', {posts: posts, images: images, videos: videos, documents: documents});
});


// Other's Posts
router.get('/othersPosts', ensureAuthenticated, async (req, res) => {
  let sql_posts = 'select * from post';
  const posts= await Factory(sql_posts);
  let sql_images = 'select * from image';
  const images= await Factory(sql_images);
  let sql_videos = 'select * from video';
  const videos= await Factory(sql_videos);
  let sql_documents = 'select * from document';
  const documents= await Factory(sql_documents);
  res.render('othersPosts.ejs', { currentUser: req.user, posts: posts, images:images, videos: videos, documents: documents})
});


router.post('/friendsFeed', (req, res) => friendsFeed(req, res));
async function friendsFeed (req, res) {
  const {email} = req.body;
  //obtener lista de amigos
  let response = await  neo4jdb.findFriends(email)
  //concatena en en un str los email de amigos
  let listStr = "(\'\'" //agragar un email vacio por si el mae no tiene amigos
  for (let index = 0; index < response.response.length; index++) {
    listStr += "\'" + response.response[index].guid + "\'"
    if (! index + 1 == response.response.length) {//cuando no sea el ultimo
      listStr += ","
    } 
  }
  listStr += ")"


  //queries
  let sql_posts = "select * from post where email_user in " + listStr + ";";
  const posts= await Factory(sql_posts);
  let sql_images = "SELECT distinct image, id_post FROM image inner join post on post.email_user in " + listStr + ";";
  const images = await Factory(sql_images);
  let sql_videos = "SELECT distinct video, id_post FROM video inner join post where post.email_user in " + listStr + ";";
  const videos = await Factory(sql_videos);
  let sql_documents = "SELECT distinct document, id_post FROM document inner join post where post.email_user in " + listStr + ";";
  const documents = await Factory(sql_documents);

  
  res.render('feed', { currentUser: req.user, posts: posts, images:images, videos: videos, documents: documents});
}

module.exports = router;