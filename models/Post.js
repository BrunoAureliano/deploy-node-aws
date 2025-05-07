// Load Models
    import mongoose, { Schema } from "mongoose"

// Create Schema
    const postsSchema = mongoose.Schema({
        title: {
            type: String,
            require: true
        },
        slug: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        content: {
            type: String,
            require: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'categories',
            require: true
        },
        date: {
            type: Date,
            default: Date.now()
        }
    })

mongoose.model('posts', postsSchema)