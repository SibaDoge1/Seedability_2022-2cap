console.log("Hello. This message was sent from background.js");

function add_pattern(x, y){
    let dst = new cv.Mat();
    //let bg = new cv.Mat();
    //let dst2 = new cv.Mat();
    // You can try more different parameters
    let low = new cv.Mat(x.rows, x.cols, x.type(), [0, 128, 0, 0]);
    let high = new cv.Mat(x.rows, x.cols, x.type(),  [100, 255, 100, 255]);

    cv.inRange(x, low, high, dst);

    let mask = dst.clone();
    //use inrange function to set mask area
    let mask_inv = new cv.Mat();

    cv.bitwise_not(mask, mask_inv);

    cv.imshow('canvasOutput', dst);
    /*
    for (let i = 0; i < mask.rows; i++) {
        for (let j = 0; j < mask.cols; j++) {
            if (mask.ucharPtr(i, j)[0] === 255) {
                x.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0]
                x.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1]
                x.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2]
                x.ucharPtr(i, j)[3] = dst.ucharPtr(i, j)[3]
            }
        }
    }
    */
    for (let i = 0; i < mask_inv.rows; i++) {
        for (let j = 0; j < mask_inv.cols; j++) {
            if (mask_inv.ucharPtr(i, j)[0] === 255) {
                y.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0]
                y.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1]
                y.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2]
                y.ucharPtr(i, j)[3] = dst.ucharPtr(i, j)[3]
            }
        }
    }

    let mani = new cv.Mat();

    cv.bitwise_xor(x, y, mani);

    cv.imshow('canvasOutput2', y);

    cv.imshow('canvasOutput3', mani);

    x.delete();
    y.delete();
    return dst
}

function edgeDetect(imgElement) {
  let src = cv.imread(imgElement);
  let edge = new cv.Mat();
  let dst = new cv.Mat();

  let temp =src.clone();

  //add_pattern(src, src2);
  
  cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);

  cv.Canny(src, edge, 50, 100, 3, false);

  cv.bitwise_xor(src, edge, dst);

  /*
  let rgbaPlanes = new cv.MatVector();
  let mergedPlanes = new cv.MatVector();

  cv.split(temp, rgbaPlanes);

  let R = rgbaPlanes.get(0);
  let G = rgbaPlanes.get(1);
  let B = rgbaPlanes.get(2);

  mergedPlanes.push_back(R);
  mergedPlanes.push_back(G);
  mergedPlanes.push_back(B);

  let test = new cv.Mat();
  cv.merge(mergedPlanes, test);*/

  src.delete();
  edge.delete();
  return dst
};

function runSymbolize(src, idx){
  let imgEle = new Image();

  imgEle.onload = async () => {
    let dst = edgeDetect(imgEle)

    let canvas = document.createElement("canvas");
    cv.imshow(canvas, dst);
    let blob = await new Promise(resolve => canvas.toBlob(resolve))

    var url = URL.createObjectURL(blob)
    //console.log(url)
    //Array.from(new Uint8Array(xhr.response))
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        src:src,
        imageData:url,
        idx:idx
      });
    });
  };
  
  imgEle.src = src;
}

// a list of commands we are willing to carry out when content scripts ask
const cmd = {
  runLogic: (request, sender) => {
    console.log(request.src)
    getImageData(request.src, request.idx)
  },
  runSymbol: (request, sender) => {
    //console.log(request.src)
    runSymbolize(request.src, request.idx)
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