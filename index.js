import express from 'express';
import bp from 'body-parser';
import mongoose from 'mongoose';

const app = express();

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());

const mongoUrl = 'mongodb+srv://whatogift-user:vjyDggq3UeZZWe1Z@cluster0.exs8faa.mongodb.net/whatogiftdb?retryWrites=true&w=majority';

//////////////ROUTE//////////////
import accountRoute from './controllers/account.js';
app.use('/api/account', accountRoute);

import companiesRoute from './controllers/company.js';
app.use('api/company', companiesRoute);

const port = 3001;

mongoose.connect(mongoUrl)
.then(results => {console.log(results)
    app.listen(port, function(){
        console.log(`Server is running via port ${port}`);
    });
})
.catch(error => {console.log(error.message)})