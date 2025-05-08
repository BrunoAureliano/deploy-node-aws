// Load Models
    import express from 'express'
    const router = express.Router()

    import mongoose from 'mongoose'
    import '../models/Category.js'
    import '../models/Post.js'
    const Category = mongoose.model('categories')
    const Post = mongoose.model('posts')

    import admin from '../helpers/isAdmin.js'

// Routes
    // Main Route
        router.get('/', admin, (req, res) => {
            res.render('admin/index')
        })

    // List Categories
        router.get('/categories', admin, async (req, res) => {
            try {
                const categories = await Category.find().sort({date:'desc'})
                res.render('admin/categories', { categories: categories })
            } catch (err) {
                req.flash('error_msg', 'There was an error listing categories')
                res.redirect('/admin')
            }
        })

    // Add Categories
        router.get('/categories/add', admin, (req, res) => {
            res.render("admin/addcategories")
        })

        router.post('/categories/new', admin, async (req, res) => {
            // Validations
                let errors = []

                if(!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
                    errors.push({text: 'Invalid Name'})
                }
                if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
                    errors.push({text: 'Invalid Slug'})
                }
                if(req.body.name.length < 2) {
                    errors.push({text: 'Category name is too short'})
                }

                if(errors.length > 0) {
                    return res.render('admin/addcategories', {errors: errors})
                }

                try {
                    const newCategory = {
                        name: req.body.name,
                        slug: req.body.slug
                    }
                    
                    const category = await new Category(newCategory).save()                       
                    req.flash("success_msg", "Category created successfully")
                    res.redirect('/admin/categories')
                }
                catch (err) {
                    req.flash("error_msg", "There was an error saving the category, please try again!")
                    res.redirect('/admin')
                }  
        })
        
    // Edit Categories
        router.get('/categories/edit/:id', admin, async (req, res) => {
            try {
                const category = await Category.findOne({ _id: req.params.id})
                res.render('admin/editcategories', { category: category })
            } catch (err) {
                req.flash('error_msg', 'This category doesnt exist')
                res.redirect('/admin/categories')
            }
        })

        router.post('/categories/edit', admin, async (req, res) => {
            try {
                const category = await Category.findOne({ _id: req.body.id })
                // Validations
                    let errors = []

                    if (!req.body.name || req.body.name == null || req.body.name == undefined) {
                        errors.push({text: "Invalid Name"})
                    }
                    if (!req.body.slug || req.body.slug == null || req.body.slug == undefined) {
                        errors.push({text: "Invalid Slug"})
                    }
                    if (req.body.name.length < 2) {
                        errors.push({text: 'Category name is too short'})
                    }
                    if (errors.length > 0) {
                        return res.render('admin/editcategories', { category: category, errors: errors })
                    }
                    
                    category.name = req.body.name
                    category.slug = req.body.slug

                    await category.save()
                    req.flash("success_msg", "Category edited successfully")
                    res.redirect('/admin/categories')

            } catch (err) {
                req.flash("error_msg", "There was an internal error saving the category edit")
                res.redirect('/admin/categories')
            }
        })

    // Delete Categories
        router.post('/categories/delete', admin, async (req, res) => {
            try {
                await Category.deleteOne({ _id: req.body.id })
                req.flash('success_msg', 'Category deleted successfully')
                res.redirect('/admin/categories')
            } catch (err) {
                req.flash('error_msg', 'There was an error deleting the category')
                res.redirect('/admin/categories')
            }
        })


    // List Posts
        router.get('/posts', admin, async (req, res) => {
            try {
                const posts = await Post.find().populate('category').sort({ date: 'desc' })
                res.render('admin/posts', { posts: posts })
            } catch (err) {
                req.flash('error_msg', 'There was an error listing posts')
                res.redirect('/admin')
            }
        })

    // Add Posts
        router.get('/posts/add', admin, async (req, res) => {
            try {
                const categories = await Category.find()
                res.render('admin/addposts', { categories: categories })
            } catch (err) {
                req.flash('error_msg', 'There was an erro loading the form')
                res.redirect('/admin')
            }
        })

        router.post('/posts/new', admin, async (req, res) => {
            try {
                const categories = await Category.find()
                // Validation
                    let errors = []

                    if(!req.body.title || typeof req.body.title == undefined || req.body.title == null) {
                        errors.push({text: 'Invalid Title'})
                    }
                    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
                        errors.push({text: 'Invalid Slug'})
                    }
                    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
                        errors.push({text: 'Invalid Description'})
                    }
                    if(!req.body.content || typeof req.body.content == undefined || req.body.content == null) {
                        errors.push({text: "Invalid Content"})
                    }
                    if(req.body.title.length < 2) {
                        errors.push({text: 'Post title is too short'})
                    }
                    if(req.body.category == "0") {
                        errors.push({text: "Invalid category, please register a category"})
                    }

                    if(errors.length > 0) {
                        return res.render('admin/addposts', {categories: categories, errors: errors})
                    }

                    const newPost = {
                        title: req.body.title,
                        slug: req.body.slug,
                        description: req.body.description,
                        content: req.body.content,
                        category: req.body.category
                    }

                    await new Post(newPost).save()
                    req.flash('success_msg', 'Post created successfully')
                    res.redirect('/admin/posts')
            } catch (err) {
                req.flash('error_msg', 'There was an error saving the post, please try again!')
                res.redirect('/admin/posts')
            }
        })

    // Edit Posts
        router.get('/posts/edit/:id', admin, async (req, res) => {
            try {
                const posts = await Post.findOne({ _id: req.params.id })
                const categories = await Category.find()
                res.render('admin/editposts', { categories: categories, posts: posts })
            } catch (err) {
                req.flash('error_msg', 'This post doesnt exist')
                res.redirect('/admin/posts')
            }
        })

        router.post('/posts/edit', admin, async (req, res) => {
            try {
                const posts = await Post.findOne({ _id: req.body.id })
                const categories = await Category.find()

                //Validations
                    let errors = []

                    if (!req.body.title || req.body.title == null || req.body.title == undefined) {
                        errors.push({text: "Invalid Title"})
                    }
                    if (!req.body.slug || req.body.slug == null || req.body.slug == undefined) {
                        errors.push({text: "Invalid Slug"})
                    }
                    if (!req.body.description || req.body.description == null || req.body.description == undefined) {
                        errors.push({text: "Invalid Description"})
                    }
                    if (!req.body.content || req.body.content == null || req.body.content == undefined) {
                        errors.push({text: "Invalid Content"})
                    }
                    if (req.body.title.length < 2) {
                        errors.push({text: "Post title is too short"})
                    }
                    if (errors.length > 0) {
                        return res.render('admin/editposts', {categories: categories, posts: posts, errors: errors})
                    }

                    posts.title = req.body.title
                    posts.slug = req.body.slug
                    posts.description = req.body.description
                    posts.content = req.body.content
                    posts.category = req.body.category

                    await posts.save()
                    req.flash('success_msg', 'Post edited successfully')
                    res.redirect('/admin/posts')
            } catch (err) {
                req.flash('erre_msg', 'There was an error editing the post')
                res.redirect('/admin/posts')
            }
        }) 

    // Delete Posts
        router.post('/posts/delete', admin, async (req, res) => {
            try {
                await Post.deleteOne({ _id: req.body.id })
                req.flash('success_msg', 'Post deleted successfully')
                res.redirect('/admin/posts')
            } catch (err) {
                req.flash('error_msg', 'there was an error deleting the post')
                res.redirect('/admin/posts')
            }
        })


        
export default router