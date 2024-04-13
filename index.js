import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data to store submitted posts
let posts = [];

// Serve static files
app.use(express.static("public"));

// Render index page with sorted posts
app.get("/", (req, res) => {
    // Sort posts by creation date (most recent first)
    const sortedPosts = posts.sort((a, b) => b.createdAt - a.createdAt);
    res.render("index.ejs", {posts: sortedPosts});
});

app.get("/create", (req, res) => {
    res.render("create.ejs");
});



app.post("/submit", (req, res) => {
    // Extract post data from the form submission
    const { name, title, postData, url } = req.body;

    // Create a new post object with current date
    const newPost = {
        id: posts.length + 1, // Generate unique ID for the post
        name: name,
        title: title,
        postData: postData,
        url: url,
        createdAt: new Date() // Store current date
    };

    // Add the new post to the posts array
    posts.push(newPost);

    //Redirect to the home page
    res.redirect("/");
});

// Render edit page with post data
app.get("/edit/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(post => post.id === postId);
    res.render("edit.ejs", { post: post});
});

// Handle edit form submission
app.post("/edit/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const { name, title, postData, url } = req.body;
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        posts[postIndex] = {
            ...posts[postIndex],
            name: name,
            title: title,
            postData: postData,
            url: url
        };
    }
    res.redirect("/");
});

// Handle post deletion
app.get("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    posts = posts.filter(post => post.id !== postId);
    res.redirect("/");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/contact", (req, res) => {
    
    res.render("contact.ejs");
});

// Render post page with sorted posts
app.get("/post", (req, res) => {
    // Sort posts by creation date (most recent first)
    const sortedPosts = posts.sort((a, b) => b.createdAt - a.createdAt);
    res.render("post.ejs", { posts: sortedPosts });
});

app.post("/submit", (req, res) => {
    const postData = req.body.postData;
    res.redirect("post.ejs");
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
