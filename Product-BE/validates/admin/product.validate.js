module.exports.createPost = (req, res, next) => { 
    if (!req.body.title) {
            req.flash('error', 'Tiêu đề sản phẩm không được để trống');
            const referer = req.get('Referer');
            const fallback =
                (req.app && req.app.locals && req.app.locals.prefixAdmin
                    ? req.app.locals.prefixAdmin
                    : '') + '/products/create';
            res.redirect(referer || fallback);
            return;
    }
    next();
}