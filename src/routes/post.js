const express = require('express');
const router = express.Router();
const pool = require('../config/mysqlDB');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const {newDocument, newImage, newVideo, newPost, getAllPosts} = require('../dbaccess/mysql_data');
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


// Add Images
router.get('/create/addImages', ensureAuthenticated, (req, res) => {
  res.render('postAddImages', { user: req.user });
}); 
router.post('/create/addImages', upload.array('images'), newImage);

// Add Videos
router.get('/create/addVideos', ensureAuthenticated, (req, res) => {
  res.render('postAddVideos', { user: req.user });
}); 
router.post('/create/addVideos', upload.array('videos'), newVideo);

// Add Documents
router.get('/create/addDocuments', ensureAuthenticated, (req, res) => {
  res.render('postAddDocuments', { user: req.user });
}); 
router.post('/create/addDocuments', upload.array('documents'), newDocument);


// My Posts
router.get('/myPosts', (req, res) => res.render('myPosts', { user: req.user }));


// Other's Posts
router.get('/othersPosts', ensureAuthenticated, async (req, res) => {
  // Get all posts
  let sql_posts = 'select * from post';
  const posts= await Factory(sql_posts);

  // Get all images
  let sql_images = 'select * from image';
  const images= await Factory(sql_posts);
  
  // Get all videos
  let sql_videos = 'select * from video';
  const videos= await Factory(sql_posts);

  // Get all documents
  let sql_documents = 'select * from document';
  const documents= await Factory(sql_posts);
  res.render('othersPosts.hbs', { user: req.user, posts: posts, images:images, videos: videos, documents: documents})
});


module.exports = router;