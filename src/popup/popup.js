function setColorBlindState(value) {
  let recentState;

  chrome.storage.sync.get(['colorBlind'], function(result) {
    console.log('colorBlind state was stored: ' + result.colorBlind);
    console.log(result);

    if (result != null) {
      recentState = result.colorBlind;
      
      console.log(recentState);
      console.log(value);

      var state = {};
      if (recentState == value) {
        state['colorBlind'] = 'null';
      } else {
        state['colorBlind'] = value;
      }

      chrome.storage.sync.set(state, function() {
        console.log('colorBlind state was stored: ' + state.colorBlind);
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

  chrome.storage.sync.get(['colorBlind'], function(result) {
    if (result != null && result.colorBlind != 'null') {
      document.getElementById(result.colorBlind).style.background='#dedee2';
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
  document.getElementById("protanopia").addEventListener('click', function() { setColorBlindState('protanopia'); });
  document.getElementById("deuteranopia").addEventListener('click', function() { setColorBlindState('deuteranopia'); });
  document.getElementById("tritanopia").addEventListener('click', function() { setColorBlindState('tritanopia'); });
});
console.log("Hello. This message was sent from popup.js")
// document.getElementById("test").onclick = function () {
//   chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {action: "START"}, /* callback */);
//   });
// };