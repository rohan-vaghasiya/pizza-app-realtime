function errorControler() {
    return {
        index(req, res) {
            res.render('errors/404')
        }
    }
}
module.exports = errorControler