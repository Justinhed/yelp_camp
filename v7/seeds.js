var mongoose = require('mongoose');
var Campground = require('./models/campgrounds');
var Comment = require('./models/comment');

var data = [
	{
		name        : "Cloud's rest",
		image       : 'https://photosforclass.com/download/flickr-886904463',
		description :
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ac turpis egestas maecenas pharetra convallis posuere morbi leo. Odio euismod lacinia at quis risus sed vulputate odio. Pulvinar pellentesque habitant morbi tristique senectus et netus et. Cursus euismod quis viverra nibh. Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum. Non pulvinar neque laoreet suspendisse interdum consectetur libero. Arcu cursus euismod quis viverra. Orci sagittis eu volutpat odio facilisis. Egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Bibendum enim facilisis gravida neque convallis a cras semper. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Sit amet mattis vulputate enim nulla aliquet.'
	},
	{
		name        : "Tree's rest",
		image       : 'https://photosforclass.com/download/flickr-1430198323',
		description :
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ac turpis egestas maecenas pharetra convallis posuere morbi leo. Odio euismod lacinia at quis risus sed vulputate odio. Pulvinar pellentesque habitant morbi tristique senectus et netus et. Cursus euismod quis viverra nibh. Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum. Non pulvinar neque laoreet suspendisse interdum consectetur libero. Arcu cursus euismod quis viverra. Orci sagittis eu volutpat odio facilisis. Egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Bibendum enim facilisis gravida neque convallis a cras semper. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Sit amet mattis vulputate enim nulla aliquet.'
	},
	{
		name        : "Moon's Sky",
		image       : 'https://photosforclass.com/download/flickr-7299820870',
		description :
			'Come sleep unLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ac turpis egestas maecenas pharetra convallis posuere morbi leo. Odio euismod lacinia at quis risus sed vulputate odio. Pulvinar pellentesque habitant morbi tristique senectus et netus et. Cursus euismod quis viverra nibh. Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum. Non pulvinar neque laoreet suspendisse interdum consectetur libero. Arcu cursus euismod quis viverra. Orci sagittis eu volutpat odio facilisis. Egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Bibendum enim facilisis gravida neque convallis a cras semper. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Sit amet mattis vulputate enim nulla aliquet.der the moon'
	}
];
function seedDB() {
	//Remove all campgrounds
	Campground.deleteMany({}, function(err) {
		if (err) {
			console.log(err);
		}
		console.log('removed campgrounds!');
		//add a few campgrounds
		data.forEach(function(seed) {
			Campground.create(seed, function(err, campground) {
				if (err) {
					console.log(err);
				} else {
					console.log('added a campground');
					// create a comment on each campground
					Comment.create(
						{
							text   : 'This place is great, who needs internet',
							author : 'Homer'
						},
						function(err, comment) {
							if (err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log('created new comment');
							}
						}
					);
				}
			});
		});
	});
}

module.exports = seedDB;
