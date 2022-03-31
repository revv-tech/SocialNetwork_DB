const express = require('express');
const router = express.Router();
const pool = require('../config/mysqlDB');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const {newDocument, newImage, newVideo, newPost, deletePost} = require('../dbaccess/mysql_data');
const storage = require('../config/multer');
const multer = require('multer');
const path = require('path')
const upload = multer({storage});
const{connection, Factory} = require('../Factory/query_factory');

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

// Delete Post
router.post('/delete/:id', ensureAuthenticated, deletePost);

// My Posts
router.get('/myPosts', ensureAuthenticated, async(req, res) => {
  // Posts
  let sql_posts = `select * from post where email_user = '${req.user.email}';`;
  const posts= await Factory(sql_posts);

  // Images
  let sql_images = `SELECT distinct image, id_post FROM image inner join post on post.email_user = '${req.user.email}';`;
  const images = await Factory(sql_images);

  // Videos
  let sql_videos = `SELECT distinct video, id_post FROM video inner join post where post.email_user = '${req.user.email}';`;
  const videos = await Factory(sql_videos);

  // Documents
  let sql_documents = `SELECT distinct document, id_post FROM document inner join post where post.email_user = '${req.user.email}';`;
  const documents = await Factory(sql_documents);

  res.render('myPosts', {posts: posts, images: images, videos: videos, documents: documents});
});


// Other's Posts
router.get('/othersPosts', ensureAuthenticated, async (req, res) => {
  // Get all posts
  let sql_posts = 'select * from post';
  const posts= await Factory(sql_posts);

  // Get all images
  let sql_images = 'select * from image';
  const images= await Factory(sql_images);
  
  // Get all videos
  let sql_videos = 'select * from video';
  const videos= await Factory(sql_videos);

  // Get all documents
  let sql_documents = 'select * from document';
  const documents= await Factory(sql_documents);
  
  res.render('othersPosts.ejs', { currentUser: req.user, posts: posts, images:images, videos: videos, documents: documents})
});


module.exports = router;