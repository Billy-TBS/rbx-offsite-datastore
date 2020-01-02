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

app.post('/GetData', function(req,res,next){
    let uid = req.body.uid;
    let dataname = req.body.dataname;
    let exists1 = fs.pathExistsSync(`./${uid}`)
    let exists2 = fs.pathExistsSync(`./${uid}/${dataname}`)
    if (exists1 == true){
        if (exists2 == true){
            fs.readFile(`./${uid}/${dataname}`, 'utf-8', (err,data) => {
                if (err) res.status(500).send('Error retriving data!')
                if (err) throw err
                res.status(200).send(data)
            });
        } else {
            res.status(500).send('Unable to find data!')
        };
    } else {
        res.status(500).send('Unable to find user in database! Creating new folder...')
        fs.mkdir(`./${uid}`)
    }
    

});

app.post('/SetData', function(req,res,next){
    let uid = req.body.uid;
    let dataname = req.body.dataname;
    let data = req.body.data;
    let exists = fs.pathExistsSync(`./${uid}/${dataname}`)
    if (exists == true){
        fs.writeFile(`./${uid}/${dataname}`, data, 'utf-8');
        res.status(200).send("Data has been added!");
    } else {
        fs.writeFile(`./${uid}/${dataname}`, data, 'utf-8');
        res.status(200).send("Data has been added!");
    };
});

app.listen(port, function(){
    console.log(`Listening on port ${port}`);
});
