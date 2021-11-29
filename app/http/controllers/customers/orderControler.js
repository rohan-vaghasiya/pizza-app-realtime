const Order = require('../../../models/order')
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PGATED_PRIVATE_KEY_NAME)
function orderControler() {
    return {
        store(req, res) {
            //validate request
            const { phone, address, paymentType, stripeToken, } = req.body
            if (!phone || !address) {
                return res.status(422).json({ message: 'All fileds are required' });
            }
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address

            })
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    if (paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `pizza order:${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true;
                            placedOrder.paymentType = paymentType;
                            placedOrder.save().then((ord) => {
                                //Emit
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart
                                return res.json({ message: 'Payment successful, Order placed succesfully' });
                            }).catch((err) => {
                                console.log(err)
                            })
                        }).catch(err => {
                            delete req.session.cart
                            return res.json({ message: 'OrderPlaced but Payment failed,You can pay at delivery time' });
                        })
                    } else {
                        //Emit
                        const eventEmitter = req.app.get('eventEmitter')
                        eventEmitter.emit('orderPlaced', placedOrder)

                        delete req.session.cart
                        return res.json({ message: 'Order placed succesfully' });
                    }
                })
            }).catch(err => {
                return res.status(500).json({ message: 'Something went wrong' });
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } })
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            //ahuthorize user
            if (req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return res.redirect('/')
        }
    }
}

module.exports = orderControler