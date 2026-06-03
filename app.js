const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
app.get("/add", (req, res) => {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 + num2;
    res.send("Sum = " + sum);
});
app.post("/add", (req, res) => { 
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 + num2;
    res.send("Sum = " + sum);
}); 
app.put("/add", (req, res) => { 
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 * num2;
    res.send("Product = " + sum);
}); 
app.get("/div", (req, res) => {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 / num2;
    res.send("div = " + sum);
});
app.post("/div", (req, res) => {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 / num2;
    res.send("div = " + sum);
});
app.put("/div", (req, res) => {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 - num2;
    res.send("Difference = " + sum);
});
app.get("/mul", (req, res) => {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 * num2;
    res.send("Product = " + sum);
});
app.post("/mul", (req, res) => {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 * num2;
    res.send("Product = " + sum);
});
app.put("/mul", (req, res) => {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 + num2;
    res.send("Sum = " + sum);
});
app.get("/sub", (req, res) => {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 - num2;
    res.send("Difference = " + sum);
});
app.post("/sub", (req, res) => {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 - num2;
    res.send("Difference = " + sum);
});
app.put("/sub", (req, res) => {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let sum = num1 + num2;
    res.send("Sum = " + sum);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});