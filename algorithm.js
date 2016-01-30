// ver 16.1.30.1447

var convLapse = 57600000;
var scoreLim =100.00;
var sendWeight =1;
var recWeight =2;
var repeatWeight = 0.1;
var debug=1;
var threadArray =[];

//text message containing 
function text(number, personName, timeS,sent, message){
	this.personName= name;	
	this.sent= sent;	
	this.number = number;
	this.time= new Date(Integer.parseInt(date.substring(0,3)).trim(),
			Integer.parseInt(timeS.substring(5,6)).trim(),
			Integer.parseInt(timeS.substring(8,9)).trim(),
			Integer.parseInt(timeS.substring(15,16)).trim(),
			Integer.parseInt(timeS.substring(18,19)).trim(z),
			Integer.parseInt(timeS.substring(21,22)).trim(),0);
	this.message = message;
	
}  
//takes in texts and injects them into 

//function to sort texts by number
function nameComparator(a,b){
	if (a[0] < b[0]) return -1;
	if (a[0] > b[0]) return 1;
	return 0;
}
//sorts text by time
function timeComparator(a,b){
	if(a[2] < b[2]) return -1;
	if(a[2] > b[2]) return 1;
	return 0;
}
//takes in data and adds to existing threads or creates new entries
function textThreadFactory(data){
	data = data.sort(nameComparator);
	var tempIndex=0;
	for(var index=0; index< data.length; index++)
		if(data[index].number  === data[index-1].number){
			
		}else{
			addToTextArray(data.slice(tempIndex,index).sort(timeComparator));
			
			tempIndex = index+1;
		}
	//determines if entry already exists for given number or not
	this.addToTextArray = new function(array){
		for(var num in threadArray){
			if( array[0].number=== threadArray[num].number){
				threadArray[num].addTexts(array);
				threadArray[num].evalConvo();
				return 0;
			}
		}
		threadArray[threadArray.length] = new textThread(array);
		//threadArray[threadArray.length-1];
		return 1;
		
	};
	
}
//thread of texts to and from a person
function textThread(text) {
	// phone number of the contact
	this.number=text[0].number;
	//an array of messages
	this.text = text;
	//indices of conversation end points
	this.convos =[];
	//
	this.score =0;
	
	findEndpoints();
	evalConvo(0);
	//generates list of all non-determined conversation end points
	this.findEndpoints= new function(){
		//generates and stores conversation end points into convos array 
		for(var x=convos[convos.length-1]+1; x<texts.length; x++)
			
			if((text[x].time-text[x+1].time)/3600000 <= convLapse)
				convos[convos.length] = x; 
			//else if(containsEndStatement(message.getContents))
			//	convos[convos.length] = x;
	};
	//calculates score based previous score 
	this.recalcScore= new function(newScore){
		score =score+(newScore/convos.length);
	};
	// evaluates conversations starting from a set index
	this.evalConvo= new function(index){
		if(convos[index] ===null || convos[index+1]=== null){
			return 0; 
		}
		
		convoLength = convos[index+1]-convos[index] ;
		var localScore =0;
		var repeat = 0.0;
		var prevState = "";
		for(var i =convos[index]; i <convos[index+1]; i++){
			if(prevState == text[i].state)
				localScore +=  sendWeight*repeat;
			else
				repeat  =0;
			if(text[i].state = "sent")
				localScore +=  sendWeight*timeWeight(i)*(1.0-repeat);
			else if(text[i].state = "recieved"){
				localScore += recWeight*timeWeight(i)*(1.0+repeat);
				repeat-=repeatWeight;
			};
			
		}
		return localScore;
	};
	//evaluates thread
	this.evalThread = new function(){
		for(var i in convos){
			recalcScore((evalConvo(convos[i])));
		}
	};
	this.timeWeight = new function(index){
		return 1;
	};
};



