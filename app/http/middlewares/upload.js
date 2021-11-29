const multer = require("multer");

function uploadFile(req, res, next) {

    //Configuration for Multer
    const multerStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public/img/");
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split("/")[1];
            cb(null, `item-${file.fieldname}-${Date.now()}.${ext}`);
        },
    });
    // Multer Filter
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "png") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    };

    //Calling the "multer" Function
    const upload = multer({
        storage: multerStorage,
        fileFilter: multerFilter,
    }).single('iimage')


    // const upload = multer().single('yourFileNameHere');

    upload(req, res, function (err) {
        const { iname, iprice, isize } = req.body
        if (err instanceof multer.MulterError) {

            // A Multer error occurred when uploading.
            req.flash('error', 'Please select a proper image')
            if (req.params.id) {
                return res.redirect('/admin/product/update/' + req.params.id)
            }
            return res.redirect('/admin/product')
        } else if (err) {
            // An unknown error occurred when uploading.
            req.flash('error', 'Please select a proper image')
            if (req.params.id) {
                return res.redirect('/admin/product/update/' + req.params.id)
            }
            return res.redirect('/admin/product')
        }
        if (!req.params.id) {
            if (typeof req.file === "undefined") {
                req.flash('error', 'All fields are required')
                req.flash('iname', iname)
                req.flash('iprice', iprice)
                req.flash('isize', isize)
                if (req.params.id) {
                    return res.redirect('/admin/product/update/' + req.params.id)
                }
                return res.redirect('/admin/product')
            }
        }

        next()
    })
}



module.exports = uploadFile