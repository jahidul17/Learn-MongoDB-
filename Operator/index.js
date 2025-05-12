const { error } = require("console");
const express = require("express")
const mongoose = require("mongoose")

const app = express();

const port = 3002;
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/testProductBD');
        console.log("db is connected");
    }
    catch (error) {
        console.log("db is not connected");
        console.log(error.message);
        process.exit(1)
    }
}

app.listen(port, async () => {
    console.log(`server is running at http://localhost:${port}`);
    await connectDB()
})

app.get("/", (req, res) => {
    res.send("Welcome to home page.")
});


// create product schema 
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    // title: String,
    // price: Number,
    price: {
        type: Number,
        require: true,
    },
    rating: {
        type: Number,
        require: true,
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})


//Create product model
const Product = mongoose.model("Products", productsSchema);
//Database -> collections(table) -> Document(row)

// ------------------ Comparison Operator-------------------------
app.get("/comparison", async (req, res) => {
    try {

        //$lt $lte $gt $gte $eq $ne $in $nin
        // const products = await Product.find({ price: { $in: [700, 950, 1200] } }); 

        //user defind value
        const price = req.query.price;
        // const products = await Product.find({ price: { $eq: price } })
        let products;
        if (price) {
            products = await Product.find({ price: { $eq: price } })
        }
        else {
            products = await Product.find();
        }
        // http://localhost:3002/products?price=900
        if (products) {
            res.status(200).send(
                {
                    success: true,
                    message: "return single product",
                    data: products
                }
            );
        } else {
            res.status(404).send({
                message: "Products not found",
            });
        }
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
})


// --------------------logical operator------------------------

app.get("/logical", async (req, res) => {
    try {

        //user defined
        const price = req.query.price;
        const rating = req.query.rating;

        let products;
        // if (true) {
        if (price && rating) {
            products = await Product.find({
                // $or: [{ price: { $gt: 1000 } }, { rating: { $gt: 4 } }],
                // $and: [{ price: { $gt: 1000 } }, { rating: { $gt: 4 } }],
                // $nor: [{ price: { $gt: 900 } }, { rating: { $gt: 4 } }],
                $and: [{ price: { $gt: price } }, { rating: { $gt: rating } }],
            }).sort({ price: 1 })//1 mean assending and -1 mean desending //.countDocuments();//use for count
        }
        else {
            products = await Product.find().sort({
                price:
                    1
            }) //.countDocuments();
        }
        if (products) {
            res.status(200).send(
                {
                    success: true,
                    message: "return single product",
                    data: products
                }
            );
        } else {
            res.status(404).send({
                message: "Products not found",
            });
        }
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
})