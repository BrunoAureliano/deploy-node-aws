import express from 'express'
const router = express.Router()

import mongoose from 'mongoose'
import '../models/User.js'
const User = mongoose.model('users')

import bcrypt from 'bcryptjs'

import passport from 'passport'


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', async (req, res) => {
    let errors = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({text: 'Invalid Name'})
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({text: 'Invalid Email'})
    }
    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        errors.push({text: 'Invalid Password'})
    }
    if (req.body.password.length < 4) {
        errors.push({text: 'Password too short'})
    }
    if (req.body.password != req.body.password2) {
        errors.push({text: 'Passwords are different. Try again'})
    }

    if (errors.length > 0) {
        return res.render('users/register', {errors: errors})
    }
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            req.flash('error_msg', 'An account with this email already exists')
            res.redirect('/users/register')
        } else {
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(newUser.password, salt)       

            newUser.password = hash

            await new User(newUser).save()
            req.flash('success_msg', 'User registered successfully')
            res.redirect('/')
        }
    } catch (err) {
        req.flash('error_msg', 'There was an error creating the user. Please try again.')
        res.redirect('/users/register')
    }
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success_msg', 'Logout successfully!')
        res.redirect('/')
    })     
})



export default router