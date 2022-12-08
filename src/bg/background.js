console.log("Hello. This message was sent from background.js");
let imgPattern
let imgPattern2
let imgPattern3
//패턴 이미지 숨기기
window.addEventListener('DOMContentLoaded', function(e) {
  imgPattern = new Image()
  imgPattern.src = "./check.jpg"
  imgPattern2 = new Image()
  imgPattern2.src = "./diag.png"
  imgPattern3 = new Image()
  imgPattern3.src = "./dot.jpg"
  console.log(imgPattern)
});
function get_mask(x, l, h, imgP){
  //target image
  let src = cv.imread(x);

  //mask
  let dst = new cv.Mat();

  //symbol
  let y = cv.imread(imgP);

  //사이즈가 변경된 패턴 이미지가 rsize에 저장됨
  let rsize = new cv.Mat();

  //변경할 사이즈(imgElement로부터 받아옴)
  let dsize = new cv.Size(x.width, x.height);
      
  //resize
  cv.resize(y, rsize, dsize, 0, 0, cv.INTER_AREA);

  //inrange
  cv.inRange(src, l, h, dst);

  return [dst, rsize];

}

/*
function edge_detection(r){
  let edge = new cv.Mat();
  cv.Canny(r, edge, 50, 100, 3, false);

  let edge_rgba = new cv.Mat();
  cv.cvtColor(edge, edge_rgba, cv.COLOR_GRAY2RGBA, 0);
  

  return edge_rgba;
}*/

function edge_detection(x, isMat){
  let src
  if(isMat)
    src = x;
  else
    src = cv.imread(x);


    //mask
    let dst = new cv.Mat();
    let dst2 = new cv.Mat();
    let dst3 = new cv.Mat();

    //symbol
    let y = cv.imread(imgPattern);
    let y2 = cv.imread(imgPattern2);
    let y3 = cv.imread(imgPattern3);

    //let rcsize = new cv.Mat();
    //let csize = new cv.Size(1000, 1000);

    //cv.resize(src, rcsize, csize, 0, 0, cv.INTER_AREA);
    //cv.imshow('canvasOutput', rcsize);


    //변경할 사이즈(imgElement로부터 받아옴)
    //let dsize = new cv.Size(x.width, x.height);
    
    //resize
    //cv.resize(y, rsize, dsize, 0, 0, cv.INTER_AREA);
    //cv.resize(y2, rsize2, dsize, 0, 0, cv.INTER_AREA);


    //color space
    //let low = new cv.Mat(src.rows, src.cols, src.type(), [128, 0, 0, 0]);
    //let high = new cv.Mat(src.rows, src.cols, src.type(),  [255, 160, 147, 255]);

    //let low2 = new cv.Mat(src.rows, src.cols, src.type(), [0, 100, 0, 0]);
    //let high2 = new cv.Mat(src.rows, src.cols, src.type(),  [152, 255, 170, 255]);

    //cv.inRange(src, l, h, dst);

    //cv.inRange(src, low, high, dst);
    //cv.inRange(src, low2, high2, dst2);
    //dst2, rsize2 = get_mask(x, low2, high2, imgPattern);


    //inrange
    //cv.inRange(src, low, high, dst);
    //cv.inRange(src, low2, high2, dst2);

    //mask
    //let mask_inv = new cv.Mat();
    //let mask_inv2 = new cv.Mat();


    //bitwise_not
    //cv.bitwise_not(dst, mask_inv);
    //cv.bitwise_not(dst2, mask_inv2);

    let edge = new cv.Mat();
    cv.Canny(src, edge, 50, 100, 3, false);

    let edge_dst = new cv.Mat();
    cv.cvtColor(edge, edge_dst, cv.COLOR_GRAY2RGBA, 0);

    let src_edge = new cv.Mat();

    cv.add(edge_dst, src, src_edge);
    
    //edge표시
  // cv.imshow('canvasOutput', src_edge);

    //delete all
    src.delete();
    dst.delete();
    dst2.delete();
    dst3.delete();
    y.delete();
    y2.delete();
    y3.delete();
    //low.delete();
    //low2.delete();
    //high.delete();
    //high2.delete();
    //mask_inv.delete();
    //mask_inv2.delete();

    return src_edge;
}


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
  //let dsize = new cv.Size(x.width, x.height);
  
  //resize
  //cv.resize(y, rsize, dsize, 0, 0, cv.INTER_AREA);
  //cv.resize(y2, rsize2, dsize, 0, 0, cv.INTER_AREA);


  //color space
  let low = new cv.Mat(src.rows, src.cols, src.type(), [128, 0, 0, 0]);
  let high = new cv.Mat(src.rows, src.cols, src.type(),  [255, 160, 147, 255]);

  let low2 = new cv.Mat(src.rows, src.cols, src.type(), [0, 100, 0, 0]);
  let high2 = new cv.Mat(src.rows, src.cols, src.type(),  [152, 255, 170, 255]);

  dst = get_mask(x, low, high, imgPattern)[0];
  rsize = get_mask(x, low, high, imgPattern)[1];
  dst2 = get_mask(x, low2, high2, imgPattern2)[0];
  rsize2 = get_mask(x, low2, high2, imgPattern2)[1];
  //dst2, rsize2 = get_mask(x, low2, high2, imgPattern);


  //inrange
  //cv.inRange(src, low, high, dst);
  //cv.inRange(src, low2, high2, dst2);

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


  //addWeighted
  let mani2 = new cv.Mat();

  //addWeighted
  cv.addWeighted(src, 1.0, rsize,0.2, 0,  mani2);
  cv.addWeighted(mani2, 1.0, rsize2,0.2, 0,  mani2);

  //edge + symbol이미지
  //cv.imshow('canvasOutput2', mani2);

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

  return mani2;  

}

function both(x){
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
  //let dsize = new cv.Size(x.width, x.height);
  
  //resize
  //cv.resize(y, rsize, dsize, 0, 0, cv.INTER_AREA);
  //cv.resize(y2, rsize2, dsize, 0, 0, cv.INTER_AREA);


  //color space
  let low = new cv.Mat(src.rows, src.cols, src.type(), [128, 0, 0, 0]);
  let high = new cv.Mat(src.rows, src.cols, src.type(),  [255, 160, 147, 255]);

  let low2 = new cv.Mat(src.rows, src.cols, src.type(), [0, 100, 0, 0]);
  let high2 = new cv.Mat(src.rows, src.cols, src.type(),  [152, 255, 170, 255]);

  dst = get_mask(x, low, high, imgPattern)[0];
  rsize = get_mask(x, low, high, imgPattern)[1];
  dst2 = get_mask(x, low2, high2, imgPattern2)[0];
  rsize2 = get_mask(x, low2, high2, imgPattern2)[1];
  //dst2, rsize2 = get_mask(x, low2, high2, imgPattern);


  //inrange
  //cv.inRange(src, low, high, dst);
  //cv.inRange(src, low2, high2, dst2);

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

  let edge = new cv.Mat();
  cv.Canny(dst, edge, 50, 100, 3, false);

  let edge_dst = new cv.Mat();
  cv.cvtColor(edge, edge_dst, cv.COLOR_GRAY2RGBA, 0);


  //addWeighted
  let mani2 = new cv.Mat();

  //addWeighted
  cv.addWeighted(src, 1.0, rsize,0.2, 0,  mani2);
  cv.addWeighted(mani2, 1.0, rsize2,0.2, 0,  mani2);

  cv.add(mani2, edge_dst, mani2);
  

  //edge + symbol이미지
  //cv.imshow('canvasOutput3', mani2);

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

  return mani2;  

}

function run(src,cmd, originSrc){
  let imgEle = new Image();

  imgEle.onload = async () => {
    let dst = null
    if(cmd == "edge"){
      console.log("hi")
      dst = edge_detection(imgEle)
    }
    else if(cmd == "symbol"){
      dst = add_pattern(imgEle)
    }
    else if(cmd == "both"){
      dst = add_pattern(imgEle)
      dst = edge_detection(dst, true)
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
        originSrc:originSrc,
        imgData:url,
        imgType:cmd,
      });
    });
  };
  
  imgEle.src = src;
}

// a list of commands we are willing to carry out when content scripts ask
const cmd = {
  runLogic: (request, sender) => {
    console.log(request.src)
    getImageData(request.src)
  },
  runSymbol: (request, sender) => {
    console.log("symbol: " + request.src)
    run(request.src, "symbol", request.originSrc)
  },
  runEdge: (request, sender) => {
    console.log("edge: " + request.src)
    run(request.src, "edge", request.originSrc)
  },
  runBoth: (request, sender) => {
    console.log("both: " + request.src)
    run(request.src, "both", request.originSrc)
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


async function getImageData(src){
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
        imageData:url
      });
    });
  };
  
  img.src = src;
};