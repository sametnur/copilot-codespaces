// Create web server


// Import modules
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const { ensureAuthenticated } = require('../config/auth');

// Create route for comments
router.post('/comments', ensureAuthenticated, (req, res) => {
    // Create new comment
    const comment = new Comment({
        content: req.body.content,  

    // Get user id from session
    user: req.user.id
    });
    // Save comment
    comment.save()

    // Find post by id
    Post.findById(req.body.postId, (err, post) => {
        // Push comment to post
        post.comments.push(comment);
        // Save post
        post.save();

        // Redirect to post
        res.redirect(`/posts/${post.id}`);
    });
}
);

// Create route for delete comment
router.delete('/comments/:id', ensureAuthenticated, (req, res) => {
    // Find comment by id and delete
    Comment.findByIdAndDelete(req.params.id, (err, comment) => {
        // Find post by id
        Post.findById(comment.post, (err, post) => {
            // Remove comment from post
            post.comments.remove(comment);
            // Save post
            post.save();

            // Redirect to post
            res.redirect(`/posts/${post.id}`);
        });
    });
});

// Export router
module.exports = router;




