
const mongoose			= require('mongoose');
// Mongo Database Connector
mongoose.connect("mongodb+srv://admin:1234@socialnetworkcluster.hrcpl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
	useNewUrlParser: true
}).then (() =>{
	console.log("Mongo Database Connected");
}).catch((err)=>console.log('Mongo Database not connected'+err));