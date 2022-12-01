chrome.runtime.onMessage.addListener(message => {
  if (message.imgData) {
    if(message.imgType == "symbol" && prevSymbol == "True"){
      console.log("symbol completed" + message.originSrc)
      showImg(message.imgData, message.originSrc, symbols)
      //URL.revokeObjectURL(message.imageData) 
    }
    else if(message.imgType == "edge" && prevEdge == "True"){
      console.log("edge completed" + message.originSrc)
      showImg(message.imgData, message.originSrc, edges)
      //URL.revokeObjectURL(message.imageData) 
    }
    else if(message.imgType == "both" && prevEdge == "True" && prevSymbol == "True"){
      console.log("both completed" + message.originSrc)
      showImg(message.imgData, message.originSrc, edges)
      //URL.revokeObjectURL(message.imageData) 
    }
  }
  else if(message.type){
      refreshAll()
  }
});



window.addEventListener('DOMContentLoaded', function(e) {
  document.addEventListener("mouseover", function(e){
    let elements = document.elementsFromPoint(e.clientX, e.clientY);
    let filt = Array.from(elements.filter(ele=>ele.src != null || ele.dataset.src != null))

    if(prevSymbol == "True" && prevEdge == "True"){
      if(filt[0] && (!symbols.has(getOriginSrc(filt[0])) && !edges.has(getOriginSrc(filt[0])))){
        symbols.set(getOriginSrc(filt[0]), filt[0])
        edges.set(getOriginSrc(filt[0]), filt[0])
        sendImg(filt[0], "runBoth", prevColorBlind)
      }
    }
    else if(prevSymbol == "True"){
      if(filt[0] && !symbols.has(getOriginSrc(filt[0]))){
        symbols.set(getOriginSrc(filt[0]), filt[0])
        if(edges.has(getOriginSrc(filt[0]))){
          sendImg(filt[0], "runSymbol", prevColorBlind, true)
        }
        else{
          sendImg(filt[0], "runSymbol", prevColorBlind)
        }
      }
    }
    else if(prevEdge == "True"){
      if(filt[0] && !edges.has(getOriginSrc(filt[0]))){
        edges.set(getOriginSrc(filt[0]), filt[0])
        if(symbols.has(getOriginSrc(filt[0]))){
          sendImg(filt[0], "runEdge", prevColorBlind,true)
        }
        else{
          sendImg(filt[0], "runEdge", prevColorBlind)
        }
      }
    }
  })
  
  refreshAll()
});

function refreshAll(){
  chrome.storage.sync.get(['colorBlind', 'symbol', 'edge'], function(result) {
    if (result != null) {
      if(result.edge == "True" && result.symbol == "True"){
          refreshBoth(result.edge, result.symbol, result.colorBlind)
          prevEdge = result.edge
          prevSymbol = result.symbol
      }
      else{
          refreshEdge(result.edge, result.colorBlind, result.symbol)
          refreshSymbol(result.symbol, result.colorBlind, result.edge)
      }
      prevColorBlind = result.colorBlind
    }
  });
}

function refreshBoth(edge, symbol, colorBlind) {
  if(edge == prevEdge && symbol == prevSymbol && colorBlind == prevColorBlind)
    return
  if(prevEdge != "True"){
    for(var [idx, ele]  of symbols){
      edges.set(getOriginSrc(ele), ele)
      sendImg(ele, "runEdge", prevColorBlind,true)
    }
  }
  else{
    for(var [idx, ele]  of edges){
      symbols.set(getOriginSrc(ele), ele)
      sendImg(ele, "runSymbol", prevColorBlind,true)
    }
  }
}

function refreshEdge(edge, colorBlind, symbol) {
    console.log('edge is set to ' + edge);

    if(edge != prevEdge){
      if(edge == "True"){
      }
      else{
        for(var [idx, ele]  of edges){
          if(symbol == "True"){
            symbols.set(getOriginSrc(ele), ele)
            sendImg(ele, "runSymbol", colorBlind)
          }
          else
            returnImg(ele)
        }
        edges.clear()
      }
    }
    else if (edge == "True" && colorBlind != prevColorBlind){
      for(var [idx, ele]  of edges){
        sendImg(ele, "runSymbol", colorBlind)
      }
    }
    prevEdge = edge
}

function refreshSymbol(symbol, colorBlind, edge) {
  console.log('symbol is set to ' + symbol);

  if(symbol != prevSymbol){
    if(symbol == "True"){

    }
    else{
      for(var [idx, ele]  of symbols){
        if(edge == "True"){
          edges.set(getOriginSrc(ele), ele)
          sendImg(ele, "runEdge", colorBlind)
        }
        else
          returnImg(ele)
      }
      symbols.clear()
    }
  }
  else if (symbol == "True" && colorBlind != prevColorBlind){
    for(var [idx, ele]  of symbols){
      sendImg(ele, "runSymbol", colorBlind)
    }
  }
  prevSymbol = symbol
}

function findAndDoEdge(blind){
  for(var ele  of edges){
    returnImg(ele)
  }
  edges = new Map()
  const elements = Array.from(document.querySelectorAll("img"))
  elements.forEach((ele)=>{
    if(ele.width >= 50 && ele.height >= 50 || true){
      edges.set(getOriginSrc(ele), ele)
    }
  })
  //console.log(edges)

  for(var [idx, ele]  of edges.entries()){
    if(symbols.has(getOriginSrc(ele))){
      console.log("both found")
      sendImg(ele, "runBoth", blind)
    }
    else{
      
      sendImg(ele, "runEdge", blind)
    }
  }
}

function returnImg(ele){
    ele.src = ele.originSrc
}

function getOriginSrc(ele){
  if(ele.originSrc) return ele.originSrc
  return ele.src == "" ? ele.dataset.src:ele.src
}
function getSrc(ele){
  return ele.src == "" ? ele.dataset.src:ele.src
}

function sendImg(imgEle, cmd, blind, isBoth){
    if(curCnt < maxCnt){      
      //console.log('send')
      let src
      if(isBoth)
        src = getSrc(imgEle)
      else
        src = getOriginSrc(imgEle)
      console.log(src)
      imgEle.originSrc = getOriginSrc(imgEle)
      chrome.runtime.sendMessage({
        cmd: cmd,
        src: src,
        originSrc:imgEle.originSrc,
        colorBlind: blind
      });
      curCnt++
    }
}

edges = new Map()
symbols = new Map()
curCnt = 0;
maxCnt = 9999;
prevColorBlind = null
prevEdge = "False"
prevSymbol = "False"

async function showImg(url, src, arrays){
  if(!arrays.has(src)) return
  const tmp = await fetch(url)
  const blob = await tmp.blob()
  //console.log(blob)
  const newUrl = URL.createObjectURL(blob)
  arrays.get(src).src = newUrl
}

console.log("Hello. This message was sent from symbol.js")