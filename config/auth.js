import passport from "passport"
import { Strategy as localStrategy} from "passport-local"

import bcrypt from "bcryptjs"

import mongoose from "mongoose"
import '../models/User.js'
const User = mongoose.model('users')


const Passport = function(passport) {
    
    passport.use(new localStrategy({usernameField: 'email'}, async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email})
            if (!user) {
                return done(null, false, { message: 'This account doesnt exist' })
            }

            const equal = await bcrypt.compare(password, user.password)
            if (equal) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Incorrect Password' })
            }
        } catch (err) {
            return done(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (err) {
            done(err)
        }
    })
}


export default Passport