const randomPinGenerator = () => {
    let pin = '';

    pin = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    console.log(pin);
    return pin;
}

module.exports = {
    randomPinGenerator
}
