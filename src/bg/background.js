console.log("Hello. This message was sent from background.js");
let imgPattern
let imgPattern2
let imgPattern3
//패턴 이미지 숨기기
window.addEventListener('DOMContentLoaded', function(e) {
  imgPattern = new Image()
  imgPattern.src = "./check.jpg"
  imgPattern2 = new Image()
  imgPattern2.src = "./stripe.jpg"
  imgPattern3 = new Image()
  imgPattern3.src = "./dot.jpg"
  console.log(imgPattern)
});


function add_pattern(x){
   //target image
   let src = cv.imread(x);

   //mask
   let dst = new cv.Mat();
   let dst2 = new cv.Mat();
   let dst3 = new cv.Mat();

   //symbol
   let y = cv.imread(imgPattern);
   let y2 = cv.imread(imgPattern2);
   let y3 = cv.imread(imgPattern3);

   //사이즈가 변경된 패턴 이미지가 rsize에 저장됨
   let rsize = new cv.Mat();
   let rsize2 = new cv.Mat();

   //변경할 사이즈(imgElement로부터 받아옴)
   let dsize = new cv.Size(x.width, x.height);
   
   //resize
   cv.resize(y, rsize, dsize, 0, 0, cv.INTER_AREA);
   cv.resize(y2, rsize2, dsize, 0, 0, cv.INTER_AREA);

   //color space
   let low = new cv.Mat(src.rows, src.cols, src.type(), [128, 0, 0, 0]);
   let high = new cv.Mat(src.rows, src.cols, src.type(),  [255, 160, 147, 255]);

   let low2 = new cv.Mat(src.rows, src.cols, src.type(), [0, 100, 0, 0]);
   let high2 = new cv.Mat(src.rows, src.cols, src.type(),  [152, 255, 170, 255]);


   //inrange
   cv.inRange(src, low, high, dst);
   cv.inRange(src, low2, high2, dst2);

   //mask
   let mask_inv = new cv.Mat();
   let mask_inv2 = new cv.Mat();


   //bitwise_not
   cv.bitwise_not(dst, mask_inv);
   cv.bitwise_not(dst2, mask_inv2);



   //image processing
   for (let i = 0; i < mask_inv.rows; i++) {
       for (let j = 0; j < mask_inv.cols; j++) {
           if (mask_inv.ucharPtr(i, j)[0] === 255) {
               rsize.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0]
               rsize.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1]
               rsize.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2]
               rsize.ucharPtr(i, j)[3] = dst.ucharPtr(i, j)[3]
           }
       }
   }
   for (let i = 0; i < mask_inv2.rows; i++) {
       for (let j = 0; j < mask_inv2.cols; j++) {
           if (mask_inv2.ucharPtr(i, j)[0] === 255) {
               rsize2.ucharPtr(i, j)[0] = dst2.ucharPtr(i, j)[0]
               rsize2.ucharPtr(i, j)[1] = dst2.ucharPtr(i, j)[1]
               rsize2.ucharPtr(i, j)[2] = dst2.ucharPtr(i, j)[2]
               rsize2.ucharPtr(i, j)[3] = dst2.ucharPtr(i, j)[3]
           }
       }
   }



   //output
   //bitwise_or
   let mani = new cv.Mat();
   //addWeighted
   let mani2 = new cv.Mat();
   /*
   let edge = new cv.Mat();
   cv.Canny(rsize, edge, 50, 100, 3, false);

   let edge_rgba = new cv.Mat();
   cv.cvtColor(edge, edge_rgba, cv.COLOR_GRAY2RGBA, 0);
   
   let edge_dst = new cv.Mat();
   
   cv.add(rsize, edge_rgba, edge_dst);
   //cv.imshow('canvasOutput2', rsize);*/

   //image manipulation
   cv.bitwise_or(src, rsize, mani);
   cv.bitwise_or(mani, rsize2, mani);


   //addWeighted
   cv.addWeighted(src, 1.0, rsize,1, 0.2,  mani2);
   cv.addWeighted(mani2, 1.0, rsize2,1, 0.2,  mani2);

   //delete all
   src.delete();
   dst.delete();
   dst2.delete();
   dst3.delete();
   y.delete();
   y2.delete();
   y3.delete();
   rsize.delete();
   rsize2.delete();
   low.delete();
   low2.delete();
   high.delete();
   high2.delete();
   mask_inv.delete();
   mask_inv2.delete();
   mani.delete();

   return mani2;

}

function edgeDetect(imgElement) {
  let src = cv.imread(imgElement);

  let edge = new cv.Mat();
  let dst = new cv.Mat();

  let temp =src.clone();
  
  //add_pattern(src);
  //console.log(this.height);
  
  cv.cvtColor(src, temp, cv.COLOR_RGB2GRAY, 0);
  //cv.Sobel(src, dstx, cv.CV_8U, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
  //cv.Sobel(src, dsty, cv.CV_8U, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);

cv.Canny(src, edge, 50, 100, 3, false);

  //let white_low = new cv.Mat(edge.rows, edge.cols, edge.type(), [0, 0, 0, 0]);
  //let white_high = new cv.Mat(edge.rows, edge.cols, edge.type(),  [0, 0, 255, 255]);
  //let white_dst = new cv.Mat();

  //cv.inRange(edge, white_low, white_high, white_dst);

  //console.log(edge);
  //console.log(src);
  //console.log(temp);
  //console.log(white_dst);

  let edge_rgba = new cv.Mat();

  cv.cvtColor(edge, edge_rgba, cv.COLOR_GRAY2RGBA, 0);
 // console.log(edge_rgba);

  cv.add(src, edge_rgba, dst);


  


  //let rgbaPlanes = new cv.MatVector();
  //let mergedPlanes = new cv.MatVector();

  /*
  cv.split(temp, rgbaPlanes);

  let R = rgbaPlanes.get(0);
  let G = rgbaPlanes.get(1);
  let B = rgbaPlanes.get(2);

  mergedPlanes.push_back(R);
  mergedPlanes.push_back(G);
  mergedPlanes.push_back(B);*/

  //let test = new cv.Mat();
  //cv.merge(mergedPlanes, test);



  src.delete();
  edge.delete();
  
  
  return dst
};

function run(src, idx,cmd){
  let imgEle = new Image();

  imgEle.onload = async () => {
    let dst = null
    if(cmd == "edge"){
      dst = edgeDetect(imgEle)
    }
    else if(cmd == "symbol"){
      dst = add_pattern(imgEle)
    }

    let canvas = document.createElement("canvas");
    cv.imshow(canvas, dst);
    let blob = await new Promise(resolve => canvas.toBlob(resolve))

    var url = URL.createObjectURL(blob)
    //console.log(url)
    //Array.from(new Uint8Array(xhr.response))
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        src:src,
        imgData:url,
        imgType:cmd,
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
    console.log("symbol: " + request.src)
    run(request.src, request.idx, "symbol")
  },
  runEdge: (request, sender) => {
    console.log("edge: " + request.src)
    run(request.src, request.idx, "edge")
  }
};

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