// Libarys
let express = require('express');
let bodyparser = require('body-parser');
let fs = require('fs-extra')

// Configuration

let config = require('./config.json');

// Modules

let mod = require('./function.js');

// Setup Express

let app = express();
let port = process.env.port || 3030;

app.set('env', 'production');
app.use(bodyparser.json());
app.use(mod.Authorize);

// Main

app.get('/', (req, res) => res.status(200).send("Server is online!"));

app.get('/GetData', Authorize(req, res, function(req, res){
    let uid = req.body.uid;
    let dataname = req.body.dataname;
    if (`./${uid}` !== null){
        if (`./${uid}/${dataname}` !== null){
            fs.readFile(`./${uid}/${dataname}`, 'utf-8', (err, data) => {
                if (err) throw err;
                if (err) res.status(500).send("There was an error getting data!");
                res.status(200).send(data);
            });
        } else {
            res.status(500).send("Data is not found!");
        };
    } else {
        res.status(500).send("User is not on the server, creating directory...");
        fs.mkdir(`${uid}`)
    };

}));

app.post('/SetData', Authorize(req, res, function(req, res){
    let uid = req.body.uid;
    let dataname = req.body.dataname;
    let data = req.body.data;
    if (`./${uid}/${dataname}` !== null){
        fs.writeFile(`./${uid}/${dataname}`, data, 'utf-8');
        res.status(200).send("Data has been added!");
    } else {
        fs.writeFile(`./${uid}/${dataname}`, data, 'utf-8');
        res.status(200).send("Data has been added!");
    };
}));
