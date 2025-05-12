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

// mongoose.connect('mongodb://127.0.0.1:27017/testProductBD')
//     .then(() => console.log("db is connected"))
//     .catch((error) => {
//         console.log("db is NOT connected");
//         console.log(error);
//         process.exit(1);
//     });


// app.listen(port, () => {
//     console.log(`server is running at http://localhost:${port}`);
// })

app.get("/", (req, res) => {
    res.send("Welcome to home page.")
});


// -----------------Post Operation-------------------------

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
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})


app.post("/products", async (req, res) => {
    try {
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;

        // use model schema
        const newProduct = new Product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
        });
        const productData = await newProduct.save();

        // static way insert 
        // const productData = await Product.insertMany([
        //     {
        //         title: "Iphone 5",
        //         price: 1000,
        //         description: "This is old version iphone 5."
        //     },
        //     {
        //         title: "Iphone 4",
        //         price: 700,
        //         description: "This is old version iphone four but good."
        //     }
        // ]);

        res.status(201).send({ productData });
        // res.status(201).send({ title, price, description });
        // res.send("welcome to home page");
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }
})




//Create product model
const Product = mongoose.model("Products", productsSchema);
//Database -> collections(table) -> Document(row)

// ------------------Get Operation -------------------------
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        // const products = await Product.find().limit(2);
        if (products) {
            res.status(200).send(products);
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
// ------------------Find with id Operation -------------------------
app.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        // const product = await Product.find({ _id: id }); //return array
        const product = await Product.findOne({ _id: id }); //return one object
        // const product = await Product.findOne({ _id: id }).select({ title: 1, _id: 0 }); //return specifique value here 1,0 means true false
        // res.send(product);
        if (product) {
            res.status(200).send(
                {
                    success: true,
                    message: "return single product",
                    data: product
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
