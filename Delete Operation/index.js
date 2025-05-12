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


// --------------------Delete Operation --------------------------

app.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        // const product = await Product.deleteOne({ _id: id });
        const product = await Product.findByIdAndDelete({ _id: id });
        if (product) {
            res.status(200).send({
                success: true,
                message: "Delete single product",
                data: product,
            })
        }
        else {
            res.status(404).send({
                success: false,
                message: "Product was not deleted with this id.",
            })
        }
    }

    catch (error) {
        res.status(500).send({ message: error.message });
    }
})


// --------------------Update Operation------------------------------

app.put("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        // const updateProduct = await Product.updateOne({ _id: id }, { $set: { rating: 4.9, } })
        // const updateProduct = await Product.findByIdAndUpdate({ _id: id }, { $set: { rating: 4.9, } }, { new: true })//new:true use for instant show update.

        //user defined method
        const updateProduct = await Product.findByIdAndUpdate({ _id: id },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    price: req.body.price,
                }
            },
            { new: true });
        if (updateProduct) {
            res.status(200).send({
                success: true,
                message: "Updated single data successful.",
                data: updateProduct,
            })
        }
        else {
            res.status(404).send({
                success: false,
                message: "Product was not updated this id.",

            })
        }

    }

    catch (error) {
        res.status(500).send({ message: error.message })
    }
})






