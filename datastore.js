// Libarys
let express = require('express');
let bodyparser = require('body-parser');
let fs = require('fs-extra')

// Configuration File

let config = require('./config.json');


// Setup Express

let app = express();
let port = process.env.port || 3030;
app.set('env', 'production');
app.use(Authorize)
app.use(bodyparser.json())

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
            console.log(`Unable to find dad for ${uid}!`)
        };
    } else {
        res.status(500).send('Unable to find user in database! Creating new folder...')
        console.log(`Creating folder for ${uid}...`)
        fs.mkdir(`./${uid}`)
    }
    

});

app.post('/SetData', function(req,res,next){
    let uid = req.body.uid;
    let dataname = req.body.dataname;
    let data = req.body.data;
    let exists = fs.pathExistsSync(`./${uid}/${dataname}`)
    if (exists == true){
        let lengh = data.lengh()
        if (lengh < config.max_amount_of_data){
            fs.writeFile(`./${uid}/${dataname}`, data, 'utf-8');
            res.status(200).send("Data has been added!");
        } else {
            res.status(500).send('The data provided is too long!')
        };    
    } else {
        let lengh = data.lengh()
        if (lengh < config.max_amount_of_data){
            fs.writeFile(`./${uid}/${dataname}`, data, 'utf-8');
            res.status(200).send(`Data has been added for ${uid}!`);
            console.log(`Data has been added for ${uid}!`)
        } else {
            res.status(500).send('The data provided is too long!');
            console.log(`The data provided is too long!`)
        }
    };
});

function Authorize(req, res, next_function){
    if (req.body.auth_key === config.authorization_key){
        next_function();
    } else {
        res.status(500).send('Incorrect Authorization Key!')
    };
}

app.listen(port, function(){
    console.log(`Listening on port ${port}`);
});
