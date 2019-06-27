var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	Campground = require('./models/campgrounds'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds');

var commentsRoutes = require('./routes/comments');

//creating yelp_camp DB
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

mongoose.connection.once('open', function() {
	console.log('Connection has been made, now make fireworks');
});
//this line you will use all the time with body Parser:
app.use(bodyParser.urlencoded({ extended: true }));
// ejs files.
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
seedDB();

//PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret            : 'Our Business will grow and i will be doing websites for clients ',
		resave            : false,
		saveUninitialized : false
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//below function will call currentUser on all routes
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});
//Landing page template
app.get('/', function(req, res) {
	res.render('landing');
});

//camp grounds template
//INDEX ROUTE - show all campgrounds
app.get('/campgrounds', function(req, res) {
	//get all campground from DB
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: allCampgrounds });
		}
	});
});

//POST ROUTE
// CREATE - add new campground to DB
app.post('/campgrounds', function(req, res) {
	//Get data from form and add to campground array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = { name: name, image: image, description: desc };
	//Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect('/campgrounds');
		}
	});
});

//NEW - show form to create new campground
app.get('/campgrounds/new', function(req, res) {
	res.render('campgrounds/new');
});

//SHOW - shows more info about one campground
app.get('/campgrounds/:id', function(req, res) {
	//fnd the campground with the provided ID
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			//render show template with that campground
			res.render('campgrounds/show', { campground: foundCampground });
		}
	});
});

//====================
// COMMENTS ROUTES
//====================
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
	// find campground by id
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
	//this below caused the "campground is not defined" error
	/* res.render('comments/new'); */
});
app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
	// lookup campground using ID
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			// create new comments
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});
// ===============
// AUTH ROUTES
// ===============
//show register form
app.get('/register', function(req, res) {
	res.render('register');
});

//Will handle sign up logic
app.post('/register', function(req, res) {
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function() {
			res.redirect('/campgrounds');
		});
	});
});

//Show login form
app.get('/login', function(req, res) {
	res.render('login');
});
//login route - handling login logic

app.post(
	'/login',
	passport.authenticate('local', { successRedirect: '/campgrounds', failureRedirect: '/login' }),
	function(req, res) {}
);

//logout route
app.get('/logout', function(req, res) {
	req.logOut();
	res.redirect('/campgrounds');
});
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

//CONNECTS TO LOCALHOST SERVER
app.listen(8080, 'localhost', function() {
	console.log('The YelpCamp server has started!');
});
