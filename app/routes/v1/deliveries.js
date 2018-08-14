const express = require('express');
const router = express.Router();
const Delivery = require('../../db/models/Delivery');
const mongoose = require('mongoose');


/**
 * Get all deliveries in database.
 */
router.get('/', (req, res, next) => {
    Delivery.find()
    .exec()
    .then(doc => {
        res.status(200).json(doc);
    }).catch(err => res.status(400).json(err));
});

/**
 * Post deliveries in the database.
 */
router.post('/', (req, res, next) => {
    let delivery = {
        client_name: req.body.client_name,
        size: req.body.size,
        address: {
            full_name: req.body.address.full_name,
            street_name: req.body.address.street_name,
            neighborhood: req.body.address.neighborhood,
            city: req.body.address.city,
            state: req.body.address.state,
            country: req.body.address.country,
            location: {
                lat: req.body.address.location.lat,
                lng: req.body.address.location.lng
            },
        },
        updated_at: new Date(),
    };
    if (!req.body._id) delivery.created_at = new Date();
    Delivery.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.body._id)
    }, delivery, { upsert: true }, (err) => {
        let status = 200;
        let r = {
            "success": true,
            "message": "Adicionado / Atualizado com sucesso!"
        };
        if(err) {
            status = 400;
            respose.success = false;
            r.message = `Falha ao inserir entrada no banco de dados: ${err}`; 
        }
        res.status(status).json(r);
    });
});

/**
 * Delete all deliveries
 */
router.delete('/', (req, res, next) => {
    Delivery.remove({}, (err) => {
        let status = 200;
        let response = {
            "success": true,
            "message": "Entradas deletadas com sucesso!"
        };
        if (err) {
            status = 400;
            respose.success = false;
            response.message = `Falha ao deletar entradas do banco de dados: ${err}`; 
        }
        res.status(status).json(response);
    });
});

module.exports = router;