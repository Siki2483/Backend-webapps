const mongoose = require ("mongoose");

const LocationSchema = new mongoose.Schema({

    name: {type: String, required: true},
    type: {type: String, enum: ["Location", "Beach"], required: true},
    description: {type: String},
    image: {type: String},
    mapLink: {type: String},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    createdAT: {type: Date, default: Date.now},

    location : {
        type: {
            type : String,
            enum : ['Point'],
            default : 'Point'
        },
        coordinates : {
            type : [Number], 
            required : true
        }
    },

    reviews: [
        {
            user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
            text: {type: String, required: true},
            rating: {type: Number, min: 1, max: 5, required: true},
            createdAT: {type: Date, default: Date.now},
        }
    ],
});

LocationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Location", LocationSchema);
