const Menu = require("../../../models/menu")

function productControler() {
    return {
        index(req, res) {
            return res.render('admin/addProduct')
        },
        async addProduct(req, res) {

            const { iname, iprice, isize } = req.body
            //validate request
            if (!iname || !iprice || !isize || !req.file.filename) {
                req.flash('error', 'All fields are requireds')
                req.flash('iname', iname)
                req.flash('iprice', iprice)
                req.flash('isize', isize)
                req.flash('iimage', req.file.filename)
                return res.redirect('/admin/product')
            }
            const menu = new Menu({
                name: iname,
                price: iprice,
                size: isize,
                image: req.file.filename,
            })
            //item exist 
            const found = await Menu.exists({ name: iname })
            if (found) {
                req.flash('error', 'Item already exist with this name')
                req.flash('iname', iname)
                req.flash('iprice', iprice)
                req.flash('isize', isize)
                return res.redirect('/admin/product')
            } else {
                // await menu.save().then((result) => {
                //     // Emit
                //     const eventEmitter = req.app.get('eventEmitter')
                //     eventEmitter.emit('itemAdded', result)

                //     req.flash('success', 'New Item Added')
                //     return res.redirect('/admin/product')
                // }).catch(err => {
                //     console.log(err)
                //     req.flash('error', 'Something went wrong')
                //     return res.redirect('/admin/product')
                // })

                try {

                    const result = await menu.save();
                    // Emit
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('itemAdded', result)

                    req.flash('success', 'New Item Added')
                    return res.redirect('/admin/product')
                    // res.status(200).send(user);
                } catch (error) {
                    if (error.name === "ValidationError") {
                        let errors = {};
                        let message = ''
                        Object.keys(error.errors).forEach((key) => {
                            errors[key] = error.errors[key].message;
                            message += 'Please enter a valid ' + key
                        });

                        req.flash('error', message)
                        return res.redirect('/admin/product')
                    }
                    req.flash('error', 'Something went wrong')
                    return res.redirect('/admin/product')
                }

            }
        },
        async update(req, res) {
            // console.log(req.params.id)
            const productid = req.params.id
            const product = await Menu.findById(productid)
            return res.render('admin/updateProduct', { product })
        },
        async updateProduct(req, res) {
            const { name, price, size } = req.body
            // validate request
            if (!name || !price || !size) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('price', price)
                req.flash('size', size)
                return res.redirect('/admin/product/update/' + req.params.id)
            }

            const productid = req.params.id
            const product = await Menu.findById(productid)

            if (name === product.name) {

                if (req.file) {
                    var dataRecord = {
                        name: req.body.name,
                        image: req.file.filename,
                        price: req.body.price,
                        size: req.body.size
                    }
                } else {
                    var dataRecord = {
                        price: req.body.price,
                        size: req.body.size
                    }
                }
            } else {
                const found = await Menu.findOne({ name: req.body.name })

                if (found) {
                    req.flash('error', 'item already exists')
                    return res.redirect('/admin/product/update/' + req.params.id)
                } else {
                    if (req.file) {
                        var dataRecord = {
                            name: req.body.name,
                            image: req.file.filename,
                            price: req.body.price,
                            size: req.body.size
                        }
                    } else {
                        var dataRecord = {
                            name: req.body.name,
                            price: req.body.price,
                            size: req.body.size
                        }
                    }
                }
            }

            await Menu.findByIdAndUpdate(req.params.id, dataRecord, { new: true }).then((result) => {

                // Emit Updated item 
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('itemUpdated', result)

                req.flash('error', 'Item Updated')
                return res.redirect('/')
            }).catch(err => {
                console.log(err)
                req.flash('error', 'Something went wrong')
                return res.redirect('/admin/product/update/' + req.params.id)
            })
        },
        async delete(req, res) {
            await Menu.findByIdAndDelete(req.params.id).then((result) => {
                // console.log(result)
                // Emit Delete item 
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('itemDeleted', result)
            })
            res.redirect('/')
        }
    }
}


module.exports = productControler;