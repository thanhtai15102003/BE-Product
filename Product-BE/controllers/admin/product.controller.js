const Product = require('../../models/product.model');

// [GET] /admin/products

module.exports.index = async (req, res) => {
    let filterStatus = [
        {
            name: 'Tất cả',
            status: '',
            class: ''
        },
        {
            name: 'Hoạt động',
            status: 'active',
            class: ''
        },
        {
            name: 'Ngưng hoạt động',
            status: 'inactive',
            class: ''
        }
    ];

    if (req.query.status) {
        const index = filterStatus.findIndex((item) => item.status === req.query.status);
        filterStatus[index].class = 'active';
    } else {
        filterStatus[0].class = 'active';
    }
    // console.log(req.query.status);
    let find = {
        deleted: false,
    };
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;

        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }
    if (req.query.status) {
        find.status = req.query.status;
    }

    const products = await Product.find(find);

    res.render('admin/pages/products/index', {
        pageTitle: 'Danh sách sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    });
};
