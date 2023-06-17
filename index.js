const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const https = require("https");
const _ = require("lodash");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req,res) =>{
    res.render("pokedex.ejs")
})
app.get("/pokedex", (req,res) =>{
    res.render("pokedex.ejs")
})




app.post("/pokedex", (req, res) => {
    const pokemon = req.body.pokemonName;
    const URL = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
    https.get(URL, function (response) {
        if (response.statusCode === 200) {
            let data = "";

            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on("end", () => {
                const responseData = JSON.parse(data);
                let pokemonName = _.capitalize(responseData.name);
                let pokemonWeight = responseData.weight;
                let pokemonHeight = responseData.height;
                let pokemonSprite = responseData.sprites.front_default;

                res.render("pokedex-result.ejs", {
                    pokemonName: pokemonName,
                    pokemonWeight: pokemonWeight,
                    pokemonHeight: pokemonHeight,
                    pokemonSprite: pokemonSprite,
                });
            });
        }
        else{
            res.redirect("/pokedex")
        }
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log("server started at port 3000");
});