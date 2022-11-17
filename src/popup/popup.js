function setState(key, value) {
  let recentState;

  chrome.storage.sync.get([key], function(result) {
    console.log(key + ' state was stored: ' + result.colorBlind);
    console.log(result);

    if (result != null) {
      recentState = result[key];
      
      console.log(recentState);
      console.log(value);

      var state = {};
      if (recentState == value) {
        state[key] = 'null';
      } else {
        state[key] = value;
      }

      chrome.storage.sync.set(state, function() {
        console.log(key + ' state was stored: ' + state.colorBlind);
      });

      chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { type: "refreshFilter" });
        });
      });

      refreshButton();
    }
  });
}

function refreshButton() {
  document.getElementById('protanopia').style.background='#ffffff';
  document.getElementById('deuteranopia').style.background='#ffffff';
  document.getElementById('tritanopia').style.background='#ffffff';

  document.getElementById('filter').style.background='#ffffff';
  document.getElementById('simbol').style.background='#ffffff';
  document.getElementById('edge').style.background='#ffffff';
  document.getElementById('expension').style.background='#ffffff';

  chrome.storage.sync.get(['colorBlind', 'filter', 'simbol', 'edge', 'expension'], function(result) {
    if (result != null) {
      if (result.colorBlind != null && result.colorBlind != 'null') {
        document.getElementById(result.colorBlind).style.background='#dedee2';
      }
      if (result.filter != null && result.filter != 'null') {
        document.getElementById('filter').style.background='#dedee2';
      }
      if (result.simbol != null && result.simbol != 'null') {
        document.getElementById('simbol').style.background='#dedee2';
      }
      if (result.edge != null && result.edge != 'null') {
        document.getElementById('edge').style.background='#dedee2';
      }
      if (result.expension != null && result.expension != 'null') {
        document.getElementById('expension').style.background='#dedee2';
      }
    }
  });
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
  refreshButton();

  document.getElementById("analyze").onclick = analyzeImage;
  document.getElementById("protanopia").addEventListener('click', function() { setState('colorBlind', 'protanopia'); });
  document.getElementById("deuteranopia").addEventListener('click', function() { setState('colorBlind', 'deuteranopia'); });
  document.getElementById("tritanopia").addEventListener('click', function() { setState('colorBlind', 'tritanopia'); });

  document.getElementById("filter").addEventListener('click', function() { setState('filter', 'True'); });
  document.getElementById("simbol").addEventListener('click', function() { setState('simbol', 'True'); });
  document.getElementById("edge").addEventListener('click', function() { setState('edge', 'True'); });
  document.getElementById("expension").addEventListener('click', function() { setState('expension', 'True'); });
});
console.log("Hello. This message was sent from popup.js")
// document.getElementById("test").onclick = function () {
//   chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {action: "START"}, /* callback */);
//   });
// };