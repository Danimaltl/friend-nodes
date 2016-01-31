//Javascript file for Connected web application
//written for HACK UCSC 2016
//Austen Barker (backend)
//David Chalco (backend)
//Bryan Tsai (frontend)
//Brian Holt (backend)
//John "Dan" Cochran (frontend)


//client side code
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
  Template.graf.rendered = function() {

        // Meteor.defer(function() {
        //setTimeout(function(){

        console.log("on rendered called");
        //var divcy = $('#cy');
        // console.log("ss " + divcy);
        sit = cytoscape({
            container: document.getElementById('cy'), // container to render in

        elements: [
            { // node n1
            group: 'nodes', // 'nodes' for a node, 'edges' for an edge
            // NB the group field can be automatically inferred for you

            // NB: id fields must be strings or numbers
            data: { // element data (put dev data here)
                id: 'n1', // mandatory for each element, assigned automatically on undefined
                  },

            // scratchpad data (usually temp or nonserialisable data)
            scratch: {
                foo: 'bar'
            },

            position: { 
                x: 0,
                y: 0
            },

            locked: true, // when locked a node's position is immutable (default false)

            grabbable: false, // whether the node can be grabbed and moved by the user

            },

            { // node n2
            data: { id: 'n2' }, 
            position: {x: snapToRadiusX(100), y: snapToRadiusY(100)},
            locked: true
            },

            { // edge e1
            data: {
                id: 'e1',
                // inferred as an edge because `source` and `target` are specified:
                source: 'n1', // the source node id (edge comes from this node)
                target: 'n2'  // the target node id (edge goes to this node)
            },
            },
            
        ],

        layout: {
            name: 'preset'
        },

        // so we can see the ids
        style: [
            {
            selector: 'node',
            style: {
                'content': 'data(id)'
            }
            }
        ]
        });        
    }
}
//server side code
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
  //methods to be called on the client side
  Meteor.methods({
    //processes the JSON data in the 'data' archive once extracted from a CSV file
    //without a header from papa-parse it is simply an array of arrays, each row in the CSV being an
    parseUpload(data){
      check( data, Array);
      radii = radiusGeneratorSMS(data); 
    }    
  });
}
//counts instances of first field in JSON dataset out of the papa-parse
radiusGeneratorSMS = function(data){
  var radiusArray = [[]];
  //loops through the rows present in the data
  for (var i = 0; i<data.length; i++){
    //extracts the first element from each interior array
    var addr = data[i][0];
    //boolean to tell if the item has already been seen or not
    var exists = true;
    //looping through the radiusArray method to see if something exists or not
    for(var j = 0; j<radiusArray.length; i++){
      if(addr == radiusArray[0][j]){
        exists = true;
      }else{
        exists = false;
      }
    }
    //checks if a given value exists in the output 2d array or not
    //if it exists in the array then iterate the counter, if not add it to the counter and name arrays
    if(exists){
      radiusArray[1][j]++;
    }else{
      radiusArray[0].push(addr);
      radiusArray[1].push(1);
    }  
  }
  return radiusArray;
};
function snapToRadius(n1, n2, radius) {

    var x_1, x_2, y_1, y_2, x_c, y_c, x_u, y_u;
    
    x_1 = n1.renderedPosition(x);
    x_2 = n2.renderedPosition(x);
    y_1 = n1.renderedPosition(y);
    y_2 = n2.renderedPosition(y);
    
    x_c = x_2 - x_1;
    y_c = y_2 - y_1;
    
    x_u = x_c / Math.sqrt(Math.pow(x_c,2) 
                        + Math.pow(y_c,2));
    
    y_u = y_c / Math.sqrt(Math.pow(x_c,2)
                        + Math.pow(y_c,2));
    
    n2.renderedPosition(x) = x_u * radius;
    n2.renderedPosition(y) = y_u * radius;
    
}

function snapToRadiusX(radius) {
    x1 = 0
    x2 = 1000
    y1 = 0
    y2 = -1000
    
    xC = x2-x1;
    yC = y2-y1;
    
    xU = xC/Math.sqrt(Math.pow(xC,2)+Math.pow(yC,2));
    yU = yC/Math.sqrt(Math.pow(xC,2)+Math.pow(yC,2));
    
    x2 = x1 + xU*radius;
    y2 = y1 + yU*radius;
    
    return(x2)
    }
    
function snapToRadiusY(radius) {
    x1 = 0
    x2 = 1000
    y1 = 0
    y2 = -1000
    
    xC = x2-x1;
    yC = y2-y1;
    
    xU = xC/Math.sqrt(Math.pow(xC,2)+Math.pow(yC,2));
    yU = yC/Math.sqrt(Math.pow(xC,2)+Math.pow(yC,2));
    
    x2 = x1 + xU*radius;
    y2 = y1 + yU*radius;
    
    return(y2)
    }