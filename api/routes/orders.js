const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")

const Order = require("...models/order");
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
     .select("product quantity _id")
     .exec()
     .then(docs =>{
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id:doc._id,
                    product: doc.productId,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:300/orders/' + doc._id
                    }
                }
            })
        });
     })
     .catch(err => {
        res.status(500).json({error:err});
     });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
     .then(product => {
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })
        return order
         .save()
     })
     .then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'Order stored',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }
        });
     })
     .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
     });
});

router.get('/:ordersId', (req, res, next) => {
    res.status(200).json({
        message: 'Orders details',
        ordersId: req.params.ordersId
    })
})

router.delete('/:ordersId', (req, res, next) => {
    res.status(200).json({
        message: 'Orders deleted'
    });
});

module.exports = router;