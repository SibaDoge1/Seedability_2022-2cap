chrome.runtime.onMessage.addListener(message => {
  if (message.imgData) {
    if(message.imgType == "symbol" && prevSymbol == "True"){
      showImg(message.imgData, message.idx, symbols)
      console.log("symbol completed")
      //URL.revokeObjectURL(message.imageData) 
    }
    else if(message.imgType == "edge" && prevEdge == "True"){
      console.log("edge completed")
      showImg(message.imgData, message.idx, edges)
      //URL.revokeObjectURL(message.imageData) 
    }
  }
  else if(message.type){
      refreshAll()
  }
});



window.addEventListener('DOMContentLoaded', function(e) {
  document.addEventListener("mouseover", function(e){
    if(prevSymbol == "True"){
      let elements = document.elementsFromPoint(e.clientX, e.clientY);
      let filt = Array.from(elements.filter(ele=>ele.src != null || ele.dataset.src != null))
      if(filt[0] && !symbols.includes(filt[0])){
        symbols.push(filt[0])
        sendImg(filt[0], symbols.indexOf(filt[0]), "runSymbol")
      }
    }
  })
  
  refreshAll()
});

function refreshAll(){
  chrome.storage.sync.get(['colorBlind', 'symbol', 'edge'], function(result) {
    if (result != null) {
      console.log('colorBlind is set to ' + result.colorBlind);
      refreshEdge(result.edge, result.colorBlind)
      refreshSymbol(result.symbol, result.colorBlind)
      prevColorBlind = result.colorBlind
    }
  });
}

function refreshEdge(edge, colorBlind) {
    console.log('edge is set to ' + edge);

    if(edge != prevEdge){
      if(edge == "True"){
        findAndDoEdge(colorBlind)
      }
      else{
        for(var ele  of edges){
          returnImg(ele)
          edges = []
        }
      }
    }
    else if (edge == "True" && colorBlind != prevColorBlind){
      findAndDoEdge(colorBlind)
    }
    prevEdge = edge
}

function refreshSymbol(symbol, colorBlind) {
  console.log('symbol is set to ' + symbol);

  if(symbol != prevSymbol){
    if(symbol == "True"){
      for(var [idx, ele]  of symbols.entries()){
        sendImg(ele,idx, "runSymbol", colorBlind)
      }
    }
    else{
      for(var ele  of symbols){
        returnImg(ele)
      }
      symbols = []
    }
  }
  else if (symbol == "True" && colorBlind != prevColorBlind){
    for(var [idx, ele]  of symbols.entries()){
      sendImg(ele,idx, "runSymbol", colorBlind)
    }
  }
  prevSymbol = symbol
}

function findAndDoEdge(blind){
  for(var ele  of edges){
    returnImg(ele)
  }
  edges = []
  const elements = Array.from(document.querySelectorAll("img"))
  edges = elements.filter(ele=>ele.width >= 50 && ele.height >= 50 || true)
  //console.log(edges)

  for(var [idx, ele]  of edges.entries()){
    sendImg(ele,idx, "runEdge", blind)
  }
}

function returnImg(ele){
    ele.src = ele.originSrc
}

function sendImg(imgEle,idx, cmd){
    if(curCnt < maxCnt){      
      //console.log('send')
      let src = imgEle.src == "" ? imgEle.dataset.src:imgEle.src
      console.log(src)
      imgEle.originSrc = src
      chrome.runtime.sendMessage({
        cmd: cmd,
        idx: idx,
        src: src
      });
      curCnt++
    }
}

edges = []
symbols = []
curCnt = 0;
maxCnt = 9999;
prevColorBlind = null
prevEdge = "False"
prevSymbol = "False"

async function showImg(url, idx, arrays){
  const tmp = await fetch(url)
  const blob = await tmp.blob()
  //console.log(blob)
  const newUrl = URL.createObjectURL(blob)
  arrays[idx].src = newUrl
}

console.log("Hello. This message was sent from symbol.js")