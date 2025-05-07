// Load Models
    import mongoose from "mongoose"

// Create Schema
    const usersSchema = mongoose.Schema({
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        admin: {
            type: Boolean,
            default: false

        },
        password: {
            type: String,
            require: true
        }
    })

mongoose.model('users', usersSchema)