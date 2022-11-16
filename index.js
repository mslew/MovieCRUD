const express = require("express");
const app = express();

app.use(express.static(__dirname + '/client'))

// Start MongoDB Atlas ********
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");

//"mongodb+srv://mslew:TqY6kejYb2NZtBIA@movie-crud.uvrcryf.mongodb.net/?retryWrites=true&w=majority"
//TqY6kejYb2NZtBIA
const mongooseUri = "mongodb+srv://mslew:TqY6kejYb2NZtBIA@movie-crud.uvrcryf.mongodb.net/movie-crud"
mongoose.connect(mongooseUri, {useNewUrlParser: true}, {useUnifiedTopology: true})
const movieSchema = {
	title: String,
	comments: String
}
const Movie = mongoose.model("movie", movieSchema);

// Create route called from create.html
app.post("/create", function(req, res){
	let newNote = new Movie({
		title: req.body.title.trim(),
		comments: req.body.comments.trim()
	})
	
	newNote.save();
	res.redirect("/");
})

const renderNotes = (notesArray) => {
	let text = "Movies Collection:\n\n";
	notesArray.forEach((note)=>{
		text += "Title: " + note.title  + "\n";
		text += "Comments: " + note.comments  + "\n";
		text += "ID:" + note._id + "\n\n";
	})
	text += "Total Count: " + notesArray.length;
	return text
}

app.get("/read", function(request, response) {
	Movie.find({}).then(notes => { 
		response.type('text/plain');
		response.send(renderNotes(notes));
	})
})

app.post("/update", function(req, res){
	Movie.findOneAndUpdate(
		{title: req.body.title.trim()},
		{$set: {comments: req.body.comments.trim()}},
		{upsert: true, new: true}
	).catch(function(error,affected,resp){
		console.log(error)
	})
	console.log("Updated " + req.body.title + " " + req.body.comments)
	res.redirect("/");
})

app.post("/delete", function(req, res){
	Movie.findOneAndDelete({title: req.body.title.trim()}).catch(function(error, affected, resp){
		console.log(error)
	})
	console.log("Removed " + req.body.title)
	res.redirect("/");
})

// End MongoDB Atlas ********

const port = process.env.PORT || 3000
app.get('/test', function(request, response) {
	response.type('text/plain')
	response.send('Node.js and Express running on port='+port)
})

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
})