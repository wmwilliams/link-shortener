var express = require('express');
var bodyParser = require('body-parser');
var db = require('./models');
var app = express();
var Hashids = require("hashids");
var hashids = new Hashids("link-shortener", 4);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/static'));


app.get('/', function(req, res) {
	db.links.findAll().then(function(links) {
		res.render('index', {linksArray: links});
	});
});

app.post('/', function(req, res) {
	var newLink = {
		links: req.body.URL
	};
	db.links.create(newLink).then(function(links) {
		var linkHash = {
		  id : links.id,
		  hash: hashids.encode(links.id)
	  	};
    	db.links.upsert(linkHash);
		res.redirect('/');
	});
});	


app.get('/search/:hash', function (req, res) {
    var hash = req.params.hash;
    console.log(hash);
    db.links.find({where: {hash: hash}}).then(function (links) {
    	res.redirect(links.links);
    })
});





app.listen(3500);