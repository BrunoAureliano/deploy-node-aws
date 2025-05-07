// Load Models
    import session from 'express-session'
    import flash from 'connect-flash'
    import ExpressHandlebars from 'express-handlebars'

    import admin from './routes/admin.js'
    import users from './routes/user.js'

    import express from 'express'
    const app = express()

    import path from 'path'
    import { fileURLToPath } from 'url'
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    import mongoose from 'mongoose'
    import './models/Post.js'
    import './models/Category.js'
    const Post = mongoose.model('posts')
    const Category = mongoose.model('categories')

    import passport from 'passport'
    import auth from './config/auth.js'
    auth(passport)
    
// Configs
    // Session
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next()
        })

    // Body-Parser
        app.use(express.urlencoded({extended: true}))
        app.use(express.json())

    // HandleBars
        const handlebars = ExpressHandlebars.create({
            defaultLayout: 'main',
            runtimeOptions: {
                allowProtoMethodsByDefault: true,
                allowProtoPropertiesByDefault: true
            }
        })
        app.engine('handlebars', handlebars.engine)
        app.set('view engine', 'handlebars')

    // Mongoose
        mongoose.connect('mongodb://localhost/blogapp')
        .then(() => {
            console.log("Connected to Mongo")
        })
        .catch((err) => {
            console.log(`Error when connecting: ${err}`)
        })

    // Public
        app.use(express.static(path.join(__dirname,'public')))

// Routes
    // Main Route
        app.get('/', (req, res) => {
            Post.find().lean().populate('category').sort({date: 'desc'})
            .then((posts) => {
                res.render('index', {posts: posts})
            })
            .catch((err) => {
                req.flash('error_msg', 'There was an error listing posts')
                res.redirect('/404')
            })
        })

    // Posts Routes
        app.get('/post/:slug', (req, res) => {
            Post.findOne({slug: req.params.slug})
            .then((post) => {
                if (post) {
                    res.render('post/index', {post: post})
                } else {
                    req.flash('error_msg', 'This post doesnt exist!')
                    res.redirect('/')
                }
            })
            .catch((err) => {
                req.flash('error_msg', 'There was an internal error!')
                res.redirect('/')
            })
        })

    // Category Route
        app.get('/categories', (req, res) => {
            Category.find().sort({date: 'desc'})
            .then((categories) => {
                res.render('categories/index', {categories: categories})
            })
            .catch((err) => {
                req.flash('error_msg', 'There was an internal error listing categories')
                res.redirect('/')
            })
        })

    // Posts by Category Route
        app.get('/categories/:slug', (req, res) => {
            Category.findOne({slug: req.params.slug})
            .then((category) => {
                if (category) {
                    Post.find({category: category._id})
                    .then((posts) => {
                        res.render('categories/posts', {posts: posts, category: category})
                    })
                    .catch((err) => {
                        req.flash('error_msg', 'There was an error listing posts')
                        res.redirect('/')
                    })
                } else {
                    req.flash('error_msg', 'This category doesnt exist!')
                    res.redirect('/')
                }
            })
            .catch((err) => {
                req.flash('error_msg', 'There was an internal error')
                res.redirect('/')
            })
        })

    // Error Route
        app.get('/404', (req, res) => {
            res.send('Erro 404!')
        })

    // List Posts Route
        app.get('/posts',(req, res) => {
            res.send("Posts List")
        })

    // Routes Groups
        app.use('/admin', admin)
        app.use('/users', users)


// Others
    const port = 8080
    app.listen(port, () => {
        console.log("Server Running!")
    })