function setState(key, value) {
  state = {};
  state[key] = value;

  chrome.storage.sync.set(state, function() {
    console.log(key + ' state was stored: ' + state[key]);
  });

  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { type: "refreshFilter" });
    });
  });
}

function sendMessage() {
  
}

function analyzeImage(){
  const api = "https://2022cap-vision.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Categories,Description&details=Landmarks"
  const image = document.getElementById("url").value
  const body = {
    "url": image
  }
  
  console.log(JSON.stringify(body))
  fetch(api,{
    method:'POST',
    headers:{
      'Access-Control-Allow-Origin':'*',
      'Ocp-Apim-Subscription-Key':'c7ea24dfe4154ada90c01887684a393f',
      'Content-type': 'application/json',
    },
    body:JSON.stringify(body)
  })
  .then(res=>res.json())
  .then((data) => {
    alert(data.description.captions[0].text)
    console.log(data.description.captions[0].text)
  })
  .catch((error) => {
    console.log(error)
    alert('Error:'+ error)}
  );
}

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById("analyze").onclick = analyzeImage;
  document.getElementById("protan").addEventListener('click', function() { setState('colorBlind', 'protanopia'); });
  document.getElementById("deuteran").addEventListener('click', function() { setState('colorBlind', 'deuteranopia'); });
  document.getElementById("tritan").addEventListener('click', function() { setState('colorBlind', 'tritanopia'); });
});
console.log("Hello. This message was sent from popup.js")
// document.getElementById("test").onclick = function () {
//   chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {action: "START"}, /* callback */);
//   });
// };