const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const intdata = require("../init/data.js");

main()
    .then(() => {
        console.log("connection was successful");
    })
    .catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Travelbase');
}

const initDB = async () =>{
    await listing.deleteMany({});
    intdata.data = intdata.data.map((obj) => ({...obj, owner:"688dacf67c920daeff39ed1b"}));
    await listing.insertMany(intdata.data);
    console.log("data initializied");
}

initDB();