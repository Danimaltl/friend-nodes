ConnectionData = new Mongo.Collection("data");

if (Meteor.isClient) {
  // counter starts at 0
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
    'change [name="uploadCSV"]' (event, template){
      template.uploading.set( true ); //tell the reactive variable that we are uploading
      //handles conversion and upload
      Papa.parse( event.target.files[0], { //target the file input
        header: true, //first line of the CSV file are headers
        complete( results, file ){
        //call parseUpload  and pass the results.data to it (the array of json objects)
           Meteor.call( 'parseUpload', results.data, ( error, response ) => {
             if (error){
               Bert.alert(error.reason, 'warning');
               //console.log(error.reason);
             }else{
               template.uploading.set( false );
	       Bert.alert('Upload Complete', 'success', 'growl-top-right');
             }
           });
        }
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.methods({
    parseUpload( data ){
      check( data, Array );
      
      for(let i =0; i<data.length; i++){
         let item = data[i],
            exists = ConnectionData.findOne({ 
             Date:item.Date
            });
         if(!exists){
           ConnectionData.insert( item );
	   //console.log(item.Name);
         }else{
	   console.warn('Rejected. This item already exists.');		
         }
      }
    }
  });
  
}
