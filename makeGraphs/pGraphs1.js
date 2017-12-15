function getParameter(s, s1){
    return document.getElementsByName(s)[0]== null ? s1 : document.getElementsByName(s)[0];
    }
function readTextFile(file){	 
    return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(this.responseText);
    };
    xhr.onerror = reject;
    xhr.open('GET', file);
    xhr.send();
  });
} 
function drawChart(result) {     	 	 
    // input file data into array       
    arrayOfLines = result.trim().split("\n");        
	var k=[];
	var f=[];
	var f10 = 0;    
	var hAxisNo=[];	 	 
    
	for(var i=0;i<unit;i++){
          k[i] = i;
          f[i] = -1;
        }
	for(var j=0;j<arrayOfLines.length;j++){
	   var as = arrayOfLines[j].split(" ");
           kn=parseInt(as[0]);
           fn=parseFloat(as[1]);
           f[unit-kn]  = fn;    
	 }
	 console.log(f);
   //threshold line array;	 
    var thr=[];	
	var thr1=[];
    for(var i=0;i<=unit;i++){
	    thr.push(thrs1);
		thr1.push(thrs1*2);
        hAxisNo.push(unit-i); 		
	}
	console.log(thr1);
	//Y Axis ticks array; 
    maxY=Math.ceil((Math.max.apply(null,f))*1000) ;        
    maxY = maxY * 1.05;
    // 1.05 is added y aix 5%
    var gap=Math.round(maxY/10);
    var maxValue= maxY *0.0010;		
	console.log(maxValue);
    var ticksArr=[];
	for(var j=0;j<=maxY;j=j+gap){
        ticksArr[j]=(j*10/factor).toFixed(4);            
	}
    ticksArr.push(thrs1);
	ticksArr.push(thrs1*2)
    ticksArr.sort();
    //draw the Chart
    //define the chart color;
	var chartColors = {
    red: 'rgba(255, 0, 0,0.85)',
    blue: 'rgba(0, 0, 255,1)',
    green:'rgba(0,255,0,1)',
    yellow:'rgba(255,255,0,1)',
	grey:'rgba(224,224,224,0.85)',
	black:'rgba(0, 0, 0, 1)'
    };
    var backgroundColors=[];
    var borderColors = []; 
    var pointBackgroundColors = []; 
    var pointBorderColors = []; 
    var pointHoverBackgroundColors = []; 
    var pointHoverBorderColors =[];
    var ctx = document.getElementById("myChart").getContext("2d");		
    var myChart = new Chart(ctx,{ 
        type: 'bar', 
        labels:hAxisNo,         
        data:{	
	    datasets: [{	    
            data: f,		 
            backgroundColor: backgroundColors,
	        borderColor: borderColors,       
            pointBackgroundColor : pointBackgroundColors,
            pointBorderColor : pointBorderColors,
            pointHoverBackgroundColor :pointHoverBackgroundColors,
            pointHoverBorderColor :pointHoverBorderColors,             
            },{	     
            data: thr,
		    type: 'line',
		    borderWidth: 1, 
		    borderColor: chartColors.blue,   
		    fill: false,
            },
			{	     
            data: thr1,
		    type: 'line',
		    borderWidth: 1, 
		    borderColor: chartColors.black,   
		    fill: false,
            }]	          
        },
        options:{
        showTooltips: true,   
        responsive:false,                 
        legend:false,  
        tooltips: {
			mode: 'point',
			callbacks:{
				label:function(tooltipItems,data){
					if(tooltipItems.yLabel==maxValue){
					return "Missing Data";
					}else{
					return tooltipItems.yLabel
					}
				}
			}
		}, 
        elements: {point:{radius: 0}},		 
	    scales: {
            xAxes: [{
                labels:hAxisNo,
                barPercentage: 1.0,
                categoryPercentage: 1.0, 
                ticks: { 
                    autoSkip: false,
                    suggestedMin: 0,            
                    fontSize:10,
                    maxRotation:0,
                    callback: function(value) {
                        if (value % label=== 0){
                        return ((Number(value))/label).toFixed(0)};            
                    }                     
                }
            }],			  
	        yAxes: [{                        
                ticks: { 
                    autoSkip: false,
                    fontSize:8,                 
                    min:ticksArr[0],
                    max:ticksArr[ticksArr.length-1],
                    callback: function(value) {
					    if(value==0){
						    return "0";
					    }else{
                            return Number(value).toFixed(4).toString();
                        }  
                    }
				},  
                afterBuildTicks: function(scale) {                                
                    scale.ticks = ticksArr;
                    return;
                },
                beforeUpdate: function(oScale) {
                    return;
                }   
                            
            }]
        }
    }	
 });     
    var dataset = myChart.data.datasets[0];    
    for (var i = 0; i < dataset.data.length; i++) {	   
        if (dataset.data[i] > thrs1) {
            backgroundColors.push(chartColors.red);
	        borderColors.push(chartColors.red);
	        pointBackgroundColors.push(chartColors.red);
	        pointBorderColors.push(chartColors.red);
	        pointHoverBackgroundColors.push(chartColors.red);
	        pointHoverBorderColors.push(chartColors.red);
        }else if (dataset.data[i] <=thrs1&&dataset.data[i]>thrs2){
            backgroundColors.push(chartColors.yellow);
            borderColors.push(chartColors.yellow);
            pointBackgroundColors.push(chartColors.yellow);
	        pointBorderColors.push(chartColors.yellow);
	        pointHoverBackgroundColors.push(chartColors.yellow);
	        pointHoverBorderColors.push(chartColors.yellow);
        }else if(dataset.data[i] <=thrs2&&dataset.data[i]>=f10){
            backgroundColors.push(chartColors.green);
            borderColors.push(chartColors.green);
            pointBackgroundColors.push(chartColors.green);
	        pointBorderColors.push(chartColors.green);
	        pointHoverBackgroundColors.push(chartColors.green);
	        pointHoverBorderColors.push(chartColors.green);  
        }else if(dataset.data[i]<0){
            dataset.data[i]=maxValue;	  
            backgroundColors.push(chartColors.grey);
            borderColors.push(chartColors.grey);
            pointBackgroundColors.push(chartColors.grey);
	        pointBorderColors.push(chartColors.grey);
	        pointHoverBackgroundColors.push(chartColors.grey);
	        pointHoverBorderColors.push(chartColors.grey);
	    }	    	
    }
    
    myChart.update();      
}	 
//Get parameters
var maxY = parseInt(getParameter("maxY", "140"));
var factor =parseInt(getParameter("factor", "10000"));
var file = getParameter("file", "data3.txt"); 
var unit =parseInt(getParameter("unit", "96")); 
var label =parseInt(getParameter("label", "4"));
var threshold = getParameter("threshold", "0.0025");
var thrs1 = parseFloat(threshold);
var thrs2 = (thrs1 * 3) / 4;
// Get data from the file,then draw graph
//create endsWith for IE
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
   };
 }     
if (file.endsWith(".txt")){
    readTextFile(file)
    .then(function(result){ 
    drawChart(result);})
    .catch(function(reason) {alert(reason);});			 
    }else{
        alert("Can not parse this type file");
	}  	