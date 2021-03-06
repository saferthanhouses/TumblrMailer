// Problem: Using the Tumblr blog you created in Part 1, you will create a node.js script file that will email a list of contacts your most recent blog posts.

// Solution:
// - Create another JavaScript file that can pull data from your Tumblr Blog
// - Read in a CSV file of your friends' emails
// - Load the content from some time-period of posts from your Tumblr blog
// - Populate an email template with your blog content and mail merge it with your friends data
// - Send the email using the Mandrill API

var fs = require('fs');
var jade = require('jade');
var tumblr = require('tumblr.js');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('YD8ioTHchF5YfVnB4BuCfg');

var client = tumblr.createClient({
  consumer_key: 'lKROSNnpzBtx1CjPeV8hr65n9NIdG01xMp8VyhtEZIFjMB4p92',
  consumer_secret: 'FbbBixWEns2Jb8ojZgHKdjpUCTstzStyLDn7Cz8VPZ13ZlLij6',
  token: 'ZJJbNrtqOiHrhphOe4c1Pi7qTd4tOpWZ5CnhYXEAMSBUQAInVE',
  token_secret: 'sY7eSuSlSplQdQlgjgH3c6QDAWENETN1iBrBGz6NlIm17EUEeC'
});


function app(csvFilename) {
	client.posts('candidcoding.tumblr.com', function (err, data) {
		latest_posts = filter_week(data.posts);
		csvParse(csvFilename).forEach(function(obj) {
			obj.latest_posts = latest_posts;
			var file = fs.readFileSync('email_template.jade');
			var fn=jade.compile(file)
			var finished_template = fn(obj);
			// console.log(Object.keys(obj));

			sendEmail(obj.firstName + obj.lastName, obj.emailAddress, "Joseph Oliver", "joey_oliver@hotmail.com", "Fullstack TumblrMailer Application", finished_template);
			// sendEmail(obj.firstName + obj.lastName, obj.emailAddress, "Joseph Oliver", "Fullstack TumblrMailer Application", finished_template);
		})
});
}

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html) {
	var message = {
		"html": message_html,
		"subject": subject,
		"from_email": from_email,
		"from_name": from_name,
		"to": [{
			"email": to_email,
			"name": to_name
		}],
		"important": false,
		"track_opens": true,
		"auto_html": false,
		"preserve_recipients": true,
		"merge": false,
		"tags": [
			"Fullstack_Tumblrmailer_Workshop"
		]	
	};
	var async = false;
	ip_pool = "Main Pool";
	mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result){
		console.log(result);
	}, function(e) {
		console.log("Mandrill encountered an error: " + e.name + " - " + e.message);
	})
}

function filter_week(posts) {
	// takes in an array of tumblr post objects ,returns an array of posts filtered under a week
	var last_week = Date.now() - (7*24*60*60*1000); // this is milliseconds since epooch

	latest_posts = posts.filter(function(p) { 
		// if the date of the post is less than 7 days from the current time, return true; 
		var post_date = new Date(p.date); 
		var post_date = post_date.getTime();
		if(post_date>last_week) {
			return true;
		}
	})
	return latest_posts;
}

function csvParse(csvFilename) {
	// array for parsed line objects
	var parsedLines = [];
	var file = fs.readFileSync(csvFilename, 'utf-8');
	var data, keys, parsed_data;

	file = file.split('\n');
	if (file[file.length-1]==""){
		file.pop() 
	}
	// pop the last line (if empty because of line carriage return)
	
	keys = file.shift().split(',');
	// shift the last line out and use that as the keys for the parsed data

	file.forEach(function(line) { 
	// iterate over the data in each line
		parsed_data = {};
		data = line.split(',');	
		for (var i=0; i<data.length; i++)
		{
			parsed_data[keys[i]] = data[i];
		}
		parsedLines.push(parsed_data);
	})
	return parsedLines;
}



app('friend_list.csv');





















// Homespun Render Function

// function render(data_object, template) {
// 	var template_constant;
// 	var string = fs.readFileSync(template, 'utf-8');
	
// 	// capitalize the string and add an underscore between the original camelcase break
// 	// replace the point in the string at which this value appears with it's value in data.
// 	for (var key in data_object) {
// 		template_constant = key.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
// 		string = string.replace(template_constant, data_object[key]);
// 	}

// 	return string;
// }
