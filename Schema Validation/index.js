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
        // required: true
        required: [true, "product title is required"],
        minlength: [3, "minimum length of the product title should be 3"],
        maxlength: [15, "maximum length of the product title should be 15"],
        trim: true, //    samsung   here,when save in database space will be remove
        // enum: {
        //     values: ["iphone18", "samsung"], //create option
        //     message: "{VALUE} is not supported"
        // }

        // unique: true, //msut use for email or phone field
    },
    // title: String,
    // price: Number,
    price: {
        type: Number,
        require: true,
        min: 200,
        max: [2500, "maximum price 2500"]
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


// --------------------get request------------------------

app.get("/products", async (req, res) => {
    try {

        const products = await Product.find()

        if (products) {
            res.status(200).send(
                {
                    success: true,
                    message: "return product successfull.",
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


// ------------------Post operation------------------

app.post("/products", async (req, res) => {
    try {
        const title = req.body.title;
        const price = req.body.price;
        const rating = req.body.rating;
        const description = req.body.description;

        // use model schema
        const newProduct = new Product({
            title: req.body.title,
            price: req.body.price,
            rating: req.body.rating,
            description: req.body.description,
        });
        const productData = await newProduct.save();
        res.status(201).send({ productData });
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }
})



