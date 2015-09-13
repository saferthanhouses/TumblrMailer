// Problem: 
// Using the Tumblr blog you created in Part 1, you will create a node.js script file that will email a list of contacts your most recent blog posts.
// Solution:

// - Create another JavaScript file that can pull data from your Tumblr Blog
// - Read in a CSV file of your friends' emails
// - Load the content from some time-period of posts from your Tumblr blog
// - Populate an email template with your blog content and mail merge it with your friends data
// - Send the email using the Mandrill API

var fs = require('fs');
var jade = require('jade');

function csvParse(csvFilename) {
	// array for parsed line objects
	var parsedLines = [];
	var file = fs.readFileSync(csvFilename, 'utf-8');
	var data, keys, parsed_data;

	file = file.split('\n');
	file.pop() 
	// pop the last line (empty because of line carriage return)
	
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


// a function that iterates over the return value from you csvParse function. 
// Replace FIRST_NAME and NUM_MONTHS_SINCE_CONTACT fields in your email_template.html 
// file with their actual values for each contact

function render(data_object, template) {
	var template_constant;
	var string = fs.readFileSync(template, 'utf-8');
	
	// capitalize the string and add an underscore between the original camelcase break
	// replace the point in the string at which this value appears with it's value in data.


	for (var key in data_object) {
	
		template_constant = key.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
		// console.log(template_constant);
		string = string.replace(template_constant, data_object[key]);
	}
	return string;
}

/// ################### JADE ###################

var data = csvParse('friend_list.csv');
var file = fs.readFileSync('email_template.jade');
data.forEach(function(d) {
	var fn=jade.compile(file)
	var finished_template = fn(d);
	console.log(finished_template)
});

/// ################# Runtime #####################

// var data = csvParse('friend_list.csv');


// // data.forEach(function(d) { 
// // 	console.log(render(d, 'email_template.html'));
// // })

// var data_object = data[0];
// console.log(data_object);
// // console.log(render(data[0], 'email_template.html'));


