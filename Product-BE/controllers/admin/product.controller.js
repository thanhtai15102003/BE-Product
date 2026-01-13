const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system');

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            limitItem: 4,
            currentPage: 1
        },
        req.query,
        countProducts
    );

    const products = await Product.find(find)
        .sort({ position: 'desc' })
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    res.render('admin/pages/products/index', {
        pageTitle: 'Danh sách sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật thành công');

    const referer = req.get('Referer');
    const fallback =
        (req.app && req.app.locals && req.app.locals.prefixAdmin
            ? req.app.locals.prefixAdmin
            : '') + '/products';
    res.redirect(referer || fallback);
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case 'active':
            await Product.updateMany({ _id: { $in: ids } }, { status: 'active' });
            req.flash('success', `Cập nhật thành công ${ids.length} sản phẩm`);
            break;
        case 'inactive':
            await Product.updateMany({ _id: { $in: ids } }, { status: 'inactive' });
            req.flash('success', `Cập nhật thành công ${ids.length} sản phẩm`);
            break;
        case 'deleteAll':
            await Product.updateMany(
                { _id: { $in: ids } },
                { deleted: true, deleteAt: new Date() }
            );
            req.flash('success', `Xóa thành công thành công ${ids.length} sản phẩm`);
            break;
        case 'changePosition':
            for (const item of ids) {
                let [id, position] = item.split('-');
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            break;
        default:
            break;
    }

    const referer = req.get('Referer');
    const fallback =
        (req.app && req.app.locals && req.app.locals.prefixAdmin
            ? req.app.locals.prefixAdmin
            : '') + '/products';
    res.redirect(referer || fallback);
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id }); delete vĩnh viễn
    await Product.updateOne(
        { _id: id },
        {
            deleted: true,
            deleteAt: new Date()
        }
    );
    req.flash('success', `Đã xóa thành công sản phẩm`);
    const referer = req.get('Referer');
    const fallback =
        (req.app && req.app.locals && req.app.locals.prefixAdmin
            ? req.app.locals.prefixAdmin
            : '') + '/products';
    res.redirect(referer || fallback);
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/products/create', {
        pageTitle: 'Thêm mới sản phẩm'
    });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseFloat(req.body.price);
    req.body.discountPercentage = parseFloat(req.body.discountPercentage);
    req.body.stock = parseFloat(req.body.stock);

    if (req.body.position === '') {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    const product = new Product(req.body);
    await product.save();
    req.flash('success', 'Thêm mới sản phẩm thành công');
    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const product = await Product.findOne(find);

        res.render('admin/pages/products/edit', {
            pageTitle: 'Chỉnh sửa sản phẩm',
            product: product
        });
    } catch (error) {
        req.flash('NotExit', 'Sản phẩm không tồn tại');
        const referer = req.get('Referer');
        const fallback =
            (req.app && req.app.locals && req.app.locals.prefixAdmin
                ? req.app.locals.prefixAdmin
                : '') + '/products';
        res.redirect(referer || fallback);
    }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseFloat(req.body.price);
    req.body.discountPercentage = parseFloat(req.body.discountPercentage);
    req.body.stock = parseFloat(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    try {
        await Product.updateOne({ _id: id }, req.body);
    } catch (error) {
        req.flash('error', 'Cập nhật sản phẩm không thành công');
    }
    req.flash('updateSuccess', 'Cập nhật sản phẩm thành công');
    res.redirect(`${systemConfig.prefixAdmin}/products/edit/${id}`);
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const product = await Product.findOne(find);
        console.log(product);
        res.render('admin/pages/products/detail', {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};
