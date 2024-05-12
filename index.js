const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require('body-parser');
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan")
const ticketRouter = require("./src/routers/ticket.router")
const tokensRouter = require("./src/routers/tokens.router")
const userRouter = require("./src/routers/user.router")
const {handleError} = require("./src/utility/errorHandler")
const mongoose = require("mongoose");
const port = process?.env?.PORT || 4000

// app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}))

if( process.env.NODE_ENV != 'production'){
    app.use(morgan("tiny"))
}

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    console.log(process.env.MONGO_URL)
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use('/v1/ticket', ticketRouter)

app.use('/v1/user', userRouter)

app.use('/v1/tokens', tokensRouter)

app.use('*', (req, res, next)=> {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    handleError(error, res)
})


app.listen(port, ()=>{
    console.log(`App listening on port ${port}`)
})