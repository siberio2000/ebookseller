const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars Middlware
app.engine('handlebars', exphbs({ defaultLayout: 'main' })); //this is all in documentation for express handlebars
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Index route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey : keys.stripePublishableKey
    }); //we want to render template
});

//Charge Route
app.post('/charge', (req, res) => {
    const amount = 2500;

    // console.log(req.body);
    // return res.send('TEST');

    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer => stripe.charges.create({
            amount,
            description: 'Web Development Ebook',
            currency: 'GBP',
            customer: customer.id
        }))
        .then(charge => res.render('success'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});