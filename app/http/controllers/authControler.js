const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../../emails/account')
function authControler() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }

    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next) {
            const { email, password } = req.body
            //validate request
            if (!email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('email', email)
                return res.redirect('/login')
            }

            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.login(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res) {
            const { name, email, password } = req.body
            //validate request
            if (!name || !email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            //email exist 
            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already taken')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })

            //hash password 
            const hashedPassword = await bcrypt.hash(password, 10)
            //create a user account
            const user = new User({
                name,
                email,
                password: hashedPassword
            })

            user.save().then((r) => {
                sendWelcomeEmail(r.email, r.name)
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })
        },
        postLogout(req, res) {
            req.logout()
            delete req.session.cart
            return res.redirect('/login')
        }

    }
}

module.exports = authControler