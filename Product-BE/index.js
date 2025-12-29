const express = require('express');
const methodOverride = require('method-override');


require('dotenv').config();

const database = require("./config/database");
const systemConfig = require('./config/system')

const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');


database.connect();

const app = express();
const port = process.env.PORT;
app.use(methodOverride('_method'));

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

//App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
