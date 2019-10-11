document.getElementById("wordSubmit").addEventListener("click", function(event) {
  event.preventDefault();
  const value = document.getElementById("wordInput").value;
  if (value === "")
    return;
  console.log(value);
  
  makeCorsRequest();
  
  // Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Make the actual CORS request.
function makeCorsRequest() {
  // This is a sample server that supports CORS.
  
  var url = "https://cors-anywhere.herokuapp.com";
  url += "/http://www.wordgamedictionary.com/api/v1/references/scrabble/" + value + "?key=5.0208969840309806e29";
  //url += "/https://dictionaryapi.com/api/v3/references/collegiate/json/" + value + "?key=c86d684d-9a57-443f-b045-1b45c7c0b52b";

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    console.log("a");
    console.log(xhr.responseXML);
    var scoreNode = xhr.responseXML.getElementsByTagName('scrabblescore')[0];
    console.log(scoreNode);
    var score = Number(scoreNode.textContent);
    console.log(score);
    
    var word = "";
    for (var i = 0; i < value.length; i++) {
      console.log(value.charAt(i));
      if (value.charAt(i) == 'h') {
        score += 1;
      }
      var imageText = 'images/' + value.charAt(i).toLowerCase() + '.png'
      word += "<img src=" + imageText + "></img>";
    }
    
    if (score == 0) {
      document.getElementById("wordResults").innerHTML = '<h1>is NOT a real word!</h1>'
      document.getElementById("wordScore").innerHTML = '<h2>You must forfeit your turn!</h2>'
    }
    else {
      document.getElementById("wordResults").innerHTML = '<h1>IS a real word!</h1>'
      document.getElementById("wordScore").innerHTML = '<h2>' + value + ' is worth ' + score + ' points!</h2>'
    }
    document.getElementById("word").innerHTML = word;
    
    console.log("b");
    var text = xhr.responseText;
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}
});

function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};