const express = require('express');
const router = express.Router();
const Delivery = require('../../db/models/Delivery');

/**
 * Get all deliveries in database.
 */
router.get('/', (req, res, next) => {
    Deliver.find()
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
            street_name: req.body.street_name,
            number: req.body.street_name,
            neighborhood: req.body.neighborhood,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            location: {
                lat: req.body.lat,
                lng: req.body.lng
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
 * Delete the delivery from database.
 */
router.delete('/:delivery', (req, res, next) => {
    Delivery.deleteOne({_id: req.params.delivery}, (err) => {
        let status = 200;
        let response = {
            "success": true,
            "message": "Deleted with success!"
        };
        if (err) {
            status = 400;
            respose.success = false;
            response.message = `Falha ao deletar entrada no banco de dados: ${err}`; 
        }
        res.status(status).json(response);
    });
});

module.exports = router;