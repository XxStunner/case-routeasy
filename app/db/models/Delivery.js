const mongoose = require('mongoose');
/**
 * Creates Delivery Model
 */
const DeliverySchema = mongoose.Schema({
    client_name: String,
    size: String,
    address: {
        full: String,
        street_name: String,
        neighborhood: String,
        city: String,
        state: String,
        country: String,
        location: {
            lat: String,
            lng: String
        },
    },
    created_at: Date,
    updated_at: Date,
});

module.exports = mongoose.model('Delivery' , DeliverySchema);