const homeControler = require('../app/http/controllers/homeControler')
const authControler = require('../app/http/controllers/authControler')
const cartControler = require('../app/http/controllers/customers/cartControler')
const orderControler = require('../app/http/controllers/customers/orderControler')
const AdminOrderControler = require('../app/http/controllers/admin/orderControler')
const AdminStatusControler = require('../app/http/controllers/admin/statusControler')
const AdminProductControler = require('../app/http/controllers/admin/productControler')
const errorControler = require('../app/http/controllers/errorControler')
//middleware
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')
const upload = require('../app/http/middlewares/upload')

function initRoutes(app) {

    app.get('/', homeControler().index)
    app.get('/login', guest, authControler().login)
    app.post('/login', authControler().postLogin)
    app.get('/register', guest, authControler().register)
    app.post('/register', authControler().postRegister)
    app.post('/logout', authControler().postLogout)

    //cart Routers
    app.get('/cart', cartControler().index)
    app.post('/update-cart', cartControler().update)
    app.post('/minus-qty/:id', cartControler().minusQty)
    app.post('/add-qty/:id', cartControler().addQty)
    app.get('/empty-cart', cartControler().empty)
    //customers Routes
    app.post('/orders', auth, orderControler().store)
    app.get('/customer/orders', auth, orderControler().index)
    app.get('/customer/orders/:id', auth, orderControler().show)

    //admin Routes
    app.get('/admin/orders', admin, AdminOrderControler().index)
    app.post('/admin/order/status', admin, AdminStatusControler().update)
    //product Routes
    app.get('/admin/product', admin, AdminProductControler().index)
    app.post('/admin/product/add', admin, upload, AdminProductControler().addProduct)
    app.get('/admin/product/update/:id', admin, AdminProductControler().update)
    app.post('/admin/product/update/:id', admin, upload, AdminProductControler().updateProduct)
    app.get('/admin/product/delete/:id', admin, AdminProductControler().delete)


    app.get('*', errorControler().index)
}
module.exports = initRoutes