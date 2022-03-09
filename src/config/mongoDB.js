
const mongoose			= require('mongoose');
// Mongo Database Connector
mongoose.connect("mongodb+srv://admin:1234@socialnetworkcluster.hrcpl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
	useNewUrlParser: true
}).then (() =>{
	console.log("Database Connected");
}).catch((err)=>console.log('Database not connected'+err));