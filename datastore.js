// Libarys
let express = require('express');
let bodyparser = require('body-parser');
let fs = require('fs-extra')

// Configuration

let config = require('./config.json');

// Setup Express

let app = express();
let port = process.env.port || 3450;
app.set('env', 'production');
app.use(bodyparser.json());
app.use(Authorize);


// Main

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
            res.status(500).send(`Unable to find data for ${uid}!`)
            console.log(`Unable to find data for ${uid}!`)
        };
    } else {
        res.status(400).send('Unable to find user in database! Creating new folder...')
        console.log(`Creating folder for ${uid}...`)
        fs.mkdir(`./${uid}`)
    };
    

});

app.post('/GetFilesForUser', function(req,res,next){
    let uid = req.body.uid;
    let exists = fs.pathExistsSync(`./${uid}`);
    if (exists == true){
        var filen = [];
        fs.readdir(`./${uid}`, function (err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }; 
            if (files == null){
                res.status(400).send("No files found in directory!");
            } else {
              files.forEach(function (file) {
                  filen.push(file);
              });
              res.status(200).send(filen);
            };

        });
    } else {
        res.status(400).send('Unable to find user in database! Creating new folder...');
        console.log(`Creating folder for ${uid}...`);
        fs.mkdir(`./${uid}`);
    };
});

app.post('/SetData', function(req,res,next){
    let uid = req.body.uid;
    let dataname = req.body.dataname;
    let data = req.body.data;
    let exists2 = fs.pathExistsSync(`./${uid}/${dataname}`)
    let exists = fs.pathExistsSync(`./${uid}`)
    if (exists == true){
        if (exists2 == true){
            fs.writeFile(`./${uid}/${dataname}`, data, 'utf-8');
             res.status(200).send("Data has been added!");   
        } else {
             fs.writeFile(`./${uid}/${dataname}`, data, 'utf-8');
             res.status(200).send(`Data has been added for ${uid}!`);
             console.log(`Data has been added for ${uid}!`)
        };
    } else {
        console.log(`Folder for ${uid} doesn't exist. Creating new folder...`);
        fs.mkdir(`./${uid}`);
        fs.writeFile(`./${uid}/${dataname}`, data, 'utf-8');
        res.status(200).send(`Data saved for ${uid}!`);
        console.log(`Data Saved for ${uid}!`);
    };  
});


function Authorize(req, res, next_function){ // Credits to H_mzah for this function
    if (req.body.auth_key === config.authorization_key){
        next_function();
    } else {
        res.status(500).send('Incorrect Authorization Key!')
    };
};

app.listen(port, function(){
    console.log(`Listening on port ${port}`);
});
