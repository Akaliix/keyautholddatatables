document.addEventListener('DOMContentLoaded', function () {
	
	document.getElementById("tf-submit").addEventListener("click", function () {
		var allText = document.getElementById("oldText").value;
		
		allText = allText.trim();
		
		var theSep = document.getElementById("sep").value;
		if(theSep == "lines"){
			theSep='\n';
		}else if(theSep == "commas"){
			theSep=',';
		}else if(theSep == "semi-colons"){
			theSep=';';
		}else if(theSep == "space"){
			theSep=' ';
		}
		var choiceArray = allText.split(theSep);

		choiceArray = choiceArray.filter(function(item) {
		    return !item.trim().toLowerCase().includes("mehmet");
		});
		
		var numOfChoices = (choiceArray.length);
	    var x=Math.floor(Math.random()*numOfChoices);
		document.getElementById("newText").value = choiceArray[x];
	});
	
	document.getElementById("tf-reset").addEventListener("click", function () {
		document.getElementById("oldText").value = "";
		document.getElementById("newText").value = "";
		document.getElementById("oldText").focus();
	});
	
});
