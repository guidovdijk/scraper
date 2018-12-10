const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('src'));

const Scraper = require('./src/script');
const dataBundle = require('./src/config.json');
const scrape = new Scraper();
const port = 3000;

// process.setMaxListeners(0);

const results = Promise.all(dataBundle.map(d => { 
    return Promise.all(d.url.map(url => { return scrape.scrapeData(d, url); }));
}));

app.get('/', (req, res) => {
    
    results.then((d) => {

        res.render('index.ejs', { d: d });
        
    }).catch(function(err){
        console.log('error', err);
    });
    
    // res.sendFile(path.join(__dirname + '/index.html')); 
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));