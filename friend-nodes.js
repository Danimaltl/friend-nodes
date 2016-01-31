//ConnectionData = new Mongo.Collection("data");
//ConnectiionStats = new Mongo.Collection("stats");

if (Meteor.isClient) {
  //sets behavior for when uploading data
  Template.upload.onCreated(() => {
    Template.instance().uploading = new ReactiveVar( false );
  });
  Template.upload.helpers({
    uploading() {
      return Template.instance().uploading.get();
    }
  });
  Template.upload.events({
    //watch for an event on the file input, when input is recieved the code will run
    'change [name="uploadCSV"]' (event, template){
      template.uploading.set( true ); //tell the reactive variable that we are uploading
      //handles conversion and upload
      //targets the file input and calls papa-parse to parse the CSV into JSON data
      Papa.parse( event.target.files[0], {
        header: false, //first line of the CSV file are headers, the fields in each JSON object
        complete( results, file ){
        //call parseUpload  and pass the results.data to it (the array of json objects), checks for errors
           Meteor.call( 'parseUpload', results.data, ( error, response ) => {
             if (error){
               Bert.alert(error.reason, 'warning');
               //console.log(error.reason);
             }else{
               template.uploading.set( false );
	       Bert.alert('Upload Complete', 'success', 'growl-top-right');
             }
           });
           console.log("parsing complete");
        }
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  //publishes documents from the ConnectionData collection
  Meteor.publish('data', ()=> {
    return ConnectionData.find();
  });
  Meteor.publish('stats', ()=>{
    return ConnectionStats.find();
  });
  Meteor.methods({
    parseUpload(data){
       check( data, Array);



    }    
  });
}
