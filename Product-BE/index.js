const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('dotenv').config();

const database = require('./config/database');
const systemConfig = require('./config/system');

const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

database.connect();

const app = express();
const port = process.env.PORT;
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));

//Flash
app.use(cookieParser('bcjbjbkxnkx'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use(express.static(`${__dirname}/public`));

//App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
