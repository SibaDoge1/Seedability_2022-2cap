
// send a message to the background requesting our business logic

// listen for messages from the background
chrome.runtime.onMessage.addListener(message => {
  // should we render our converted image?
  if (message.imageData) {
    analyzeImage(message.src,message.imageData, message.idx)
  }
});


window.addEventListener('DOMContentLoaded', function(e){
  const elements = Array.from(document.querySelectorAll("img"))
  filtered = elements.filter(ele=>ele.width >= 50 && ele.height >= 50 && (ele.alt == null || ele.alt == ""))
    //   if (/^([\w]+\:)?\/\//.test(src) && src.indexOf(location.host) === -1) {
    //   img.crossOrigin = "anonymous"; // or "use-credentials"
    // }
  console.log(filtered)
  for(var [idx, ele]  of filtered.entries()){
    if(curCnt < maxCnt){      
      //ele.crossOrigin = ""
      chrome.runtime.sendMessage({
        cmd: "runLogic",
        idx: idx,
        src: ele.src
      });
      curCnt++
    }
  }
})

filtered = []
pendingCnt = 0;
curCnt = 0;
maxCnt = 0;
proxyServer = "https://justcors.com/tl_d7ab8ec/"

async function analyzeImage(imageSrc, imageData, idx){
  console.log("image: " + imageSrc)
  const api = "https://2022cap-vision.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Description"
  const tmp = await fetch(imageData)
  const blob = await tmp.blob()
  console.log(blob)
  console.log(idx)

  await until(()=>pendingCnt<10)
  pendingCnt++
  const res = await fetch(api,{
    method:'POST',
    headers:{
      'Access-Control-Allow-Origin':'*',
      'Ocp-Apim-Subscription-Key':'c7ea24dfe4154ada90c01887684a393f',
      'Content-Type' : 'application/octet-stream'
    },
    body:blob
  })
  pendingCnt--

  let body = await res.json()
  if (!res.ok) {
    throw new Error("HTTP status " + res.status+"\n body: " + JSON.stringify(body));
  }

  console.log(body.description.captions[0].text + ": "+imageSrc)
  filtered[idx].alt = body.description.captions[0].text
  createText(filtered[idx],body.description.captions[0].text)
}


function createText(node, text){
  let textDom = document.createElement("p")
  textDom.innerText = text
  node.parentNode.insertBefore(textDom,node.nextSibling);
}


async function getBinaryImage(img) {
  // var res = await fetch(img.src)
  // var blob = await res.blob()
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  document.body.appendChild(canvas)
  const blob = await new Promise(resolve => canvas.toBlob(resolve));
  return blob;
}


const until = (predFn) => {
  const poll = (done) => (predFn() ? done() : setTimeout(() => poll(done), 1000));
  return new Promise(poll);
};


console.log("Hello. This message was sent from altText.js")
// document.getElementById("test").onclick = function () {
//   chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {action: "START"}, /* callback */);
//   });
// };