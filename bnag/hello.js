sit = "" //hlavni objekt

if (Meteor.isClient) {

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

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}



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