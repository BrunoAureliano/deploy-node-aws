// Load Models
    import mongoose from "mongoose"

// Create Schema
    const categoriesSchema = mongoose.Schema({
        name: {
            type: String,
            require: true
        },
        slug: {
            type: String,
            require: true
        },
        date: {
            type: Date,
            default: Date.now()
        }
    })

mongoose.model('categories', categoriesSchema)
