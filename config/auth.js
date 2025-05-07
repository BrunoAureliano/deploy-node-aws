import passport from "passport"
import { Strategy as localStrategy} from "passport-local"

import bcrypt from "bcryptjs"

import mongoose from "mongoose"
import '../models/User.js'
const User = mongoose.model('users')


const Passport = function(passport) {
    
    passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({email: email})
        .then((user) => {
            if (!user) {
                return done(null, false, {message: 'This account doesnt exist'})
            }

            bcrypt.compare(password, user.password, (erro, equal) => {
                if (equal) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Incorrect Password'})
                }
            })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id)  
        .then((user) => {
            done(null, user)
        })
        .catch((err) => {
            done(err)
        })
        
    })
}


export default Passport