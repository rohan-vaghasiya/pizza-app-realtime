function cartControler() {
    return {
        index(req, res) {
            res.render('customers/cart')
        },
        update(req, res) {
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            // for the first time creating cart and adding basic object structure
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart

            // Check if item does not exist in cart 
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            return res.json({ totalQty: req.session.cart.totalQty })
        },
        empty(req, res) {
            delete req.session.cart
            res.redirect('/cart')
        },
        minusQty(req, res) {
            let cart = req.session.cart
            const productId = req.params.id
            if (cart.totalQty !== 1) {
                if (cart.items[productId].qty === 1) {
                    cart.totalQty = cart.totalQty - 1
                    cart.totalPrice = cart.totalPrice - cart.items[productId].item.price
                    delete cart.items[productId]
                    return res.redirect('/cart')
                } else {
                    cart.items[productId].qty = cart.items[productId].qty - 1
                    cart.totalQty = cart.totalQty - 1
                    cart.totalPrice = cart.totalPrice - cart.items[productId].item.price
                    return res.redirect('/cart')
                }
            } else {
                delete req.session.cart
                return res.redirect('/cart')
            }

            // console.log(cart.totalQty)
            // console.log(cart.totalPrice)
        },
        addQty(req, res) {
            let cart = req.session.cart
            const productId = req.params.id
            cart.items[productId].qty = cart.items[productId].qty + 1
            cart.totalQty = cart.totalQty + 1
            cart.totalPrice = cart.totalPrice + cart.items[productId].item.price
            return res.redirect('/cart')
        }
    }
}

module.exports = cartControler