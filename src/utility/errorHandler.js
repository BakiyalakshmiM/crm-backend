const handleError = (error, res)=> {
    console.log(error);
    res.status(error.status || 500);
    res.send({ message: error.message});
}

module.exports = {
    handleError
}