const express = require('express')
const router = express.Router()
const Post = require('../models/Post.js');

// Routes :

router.get('/home', async (req, res) => {
   try {
      const locals = {
         title: "NodeJS Blog",
         description: "Simple Blog created with NodeJS, Express & MongoDB",
      }

      let perPage = 4;
      let page = req.query.page || 1;

      const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
         .skip(perPage * page - perPage)
         .limit(perPage)
         .exec();


      const count = await Post.countDocuments();
      const nextPage = parseInt(page) + 1;
      const hasNextPage = nextPage <= Math.ceil(count / perPage)

      res.render('home', {
         locals,
         data,
         current: page,
         nextPage: hasNextPage ? nextPage : null,
         currentRoute: '/home'
      });
   } catch (error) {
      console.log(error)
   }
});

// Get All Posts As JSON
router.get('/', async (req, res) => {
   try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.status(200).json(posts);
   } catch (err) {
      res.status(500).json({ message: 'an error occurred' });
   }
});

// Get Post By Id As JSON

router.get('/post/:id', async (req, res) => {
   try {

      let slug = req.params.id;

      const data = await Post.findById({ _id: slug });
      const locals = {
         title: data.title,
         description: "Simple Blog created with NodeJS, Express & MongoDB",
         currentRoute: `/post/${slug}`
      }
      res.render('post', { locals, data })
   } catch (error) {
      console.log(error)
   }
})

router.post('/search', async (req, res) => {
   try {
      const locals = {
         title: "Search",
         description: "Simple Blog created with NodeJS, Express & MongoDB"
      }

      let searchTerm = req.body.searchTerm
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")
      const data = await Post.find({
         $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
         ]
      });

      res.render("search", {
         data,
         locals
      })
   } catch (error) {
      console.log(error)
   }
})


router.get('/about', (req, res) => {
   res.render('about',{
      currentRoute: '/about'
   })
})

router.get('/contact', (req, res) => {
   res.render('contact', {
      currentRoute: '/contact'
   })
})

module.exports = router;