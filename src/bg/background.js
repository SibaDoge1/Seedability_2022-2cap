console.log("Hello. This message was sent from background.js");

// convert an image URL into a data:URI
const getImageData = async src => {
  // being able to wrap all of this in a single promise is super handy
  return new Promise(resolve => {
    // make a new image
    let img = new Image();
    // once the image has loaded, do all this
    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      resolve({
        imageData: new Promise(resolve => canvas.toBlob(resolve))
      });
    };
    // this should never happen, since the image has already rendered to the browser
    img.onerror = function() {
      resolve({ status: "error", url: img });
    };
    
    // setup is complete; source the image to load
    img.src = src;
  });
};

// a list of commands we are willing to carry out when content scripts ask
const cmd = {
  runLogic: (request, sender) => {
    console.log(request.src)
    getImageData(request.src).then(async result => {
      var blob = await result.imageData
      var url = await URL.createObjectURL(blob)
      console.log(url)
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          src:request.src,
          imageData:url,
          idx:request.idx
        });
      });
    });  
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