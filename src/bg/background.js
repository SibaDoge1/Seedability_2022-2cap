console.log("Hello. This message was sent from background.js");

async function getImageData(src, idx){
    let img = new Image();

    img.onload = async () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);

      var blob = await new Promise(resolve => canvas.toBlob(resolve))
      console.log(idx+" " + blob)

      var url = await URL.createObjectURL(blob)
      console.log(url)

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          src:src,
          imageData:url,
          idx:idx
        });
      });
    };
    
    img.src = src;
};

// a list of commands we are willing to carry out when content scripts ask
const cmd = {
  runLogic: (request, sender) => {
    console.log(request.src)
    getImageData(request.src, request.idx)
  }
};

// listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd) {
    // can we carry out this command?
    if (typeof cmd[request.cmd] === "function") {
      cmd[request.cmd](request, sender);
    }
  }
});