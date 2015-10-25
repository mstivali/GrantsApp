//---NodeJS Library Imports---//
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/test');
//var db = mongoose.connect('mongodb://matt:password123@ds041934.mongolab.com:41934/heroku_5wmtd6lw');

//---Dependency Injections---//
var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer());
app.use(session({secret:'this is the secret'}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//---Passport authentication initializations---//
passport.use(new LocalStrategy(function(username, password, done) 
{
	UserModel.findOne({username:username, password:password}, function(err,user) {
		if(user) {
			return done(null, user);
		}

		return done(null, false, {message:'Unable to login'});
	});
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var UserSchema = new mongoose.Schema({
	firstName:String,
	lastName:String,
	email:String,
	phone:String,
	username:String,
	password:String,
	roles:[String]
});

var ProjectSchema = new mongoose.Schema({
	schoolName:String,
	schoolAddress:String,
	schoolCity:String,
	schoolState:String,
	schoolZip:String,
	projectTitle:String,
	gradeLevel:String,
	titleOneSchool:String,
	numberOfStudents:Number,
	projectCategory:String,
	mosaicProject:String,
	cityOfTampaWaterProject:Boolean,
	goalAndObjective:String,
	measureProjectImpact:String,
	userId:String
});

var ProjectItemsSchema = new mongoose.Schema({
	itemName:String,
	quantity:Number,
	cost:Number,
	description:String,
	projectId:String
});

var UserModel = mongoose.model('HefUser', UserSchema);
var ProjectModel = mongoose.model('HefProject', ProjectSchema);
var ProjectItemModel = mongoose.model('HefProjectItem', ProjectItemsSchema);

app.post("/login", passport.authenticate('local'), function(req, res) {
	console.log("/login");
	console.log(req.user);
	res.json(req.user);
});

app.post('/logout', function(req, res) {
	req.logOut();
	res.sendStatus(200);
});

app.get("/loggedin", function(req, res) {
	res.send(req.isAuthenticated() ? req.user : '0');
})

app.post("/register", function(req, res) {
	var newUser = req.body;
	console.log(newUser);
	UserModel.findOne({username:req.body.username}, function(err, user) {

		if(err) { return next(err); }
		if(user) {
			res.json(null);
			return;
		} 

		var newUser = new UserModel(req.body);
		newUser.roles = ['applicant'];
		newUser.save(function(err, user) {
			req.login(user, function(err) {
				if(err) {return next(err); }
				res.json(user);
			});
		});
	});
});

var auth = function(req, res, next) {
	if(!req.isAuthenticated())
		res.sendStatus(401)
	else
		next();
};

app.get('/rest/users', auth, function(req, res) {
	UserModel.find(function(err, users) {
		res.json(users);
	});
});

app.post('/project', function(req, res) {
	console.log(req.body);
	var newProject = new ProjectModel(req.body);
	newProject.save(function(err, project) {
		res.json(project);
	});
});

app.post('/projectItems', function(req, res) {
	console.log(req.body);
	var newProjectItem = new ProjectItemModel(req.body);
	newProjectItem.save(function(err, project) {
		res.json(project);
	});
});

app.get('/projectItems/:projectId', function(req, res) {
	var projectId = req.params.projectId;
	console.log(projectId);
	ProjectItemModel.find({projectId:projectId}, function(err, items) {
		console.log(items);
		res.json(items);
	});
});

var port = process.env.PORT || 8080; 
app.listen(port);	
console.log('Magic happens on port ' + port); 