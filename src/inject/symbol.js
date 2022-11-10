chrome.runtime.onMessage.addListener(message => {
  if (message.imageData) {
    showImg(message.imageData, message.idx)
    URL.revokeObjectURL(message.imageData) 
  }
});


window.addEventListener('DOMContentLoaded', function(e){
  findAndSendImg()
  var timer = setInterval(findAndSendImg(), 500)
})

function findAndSendImg(){
  const elements = Array.from(document.querySelectorAll("img"))
  filtered = elements.filter(ele=>ele.width >= 50 && ele.height >= 50 || true)
  console.log(filtered)

  for(var [idx, ele]  of filtered.entries()){
    if(curCnt < maxCnt){      
      console.log(ele.src == "" ? ele.dataset.src:ele.src)
      chrome.runtime.sendMessage({
        cmd: "runSymbol",
        idx: idx,
        src: ele.src == "" ? ele.dataset.src:ele.src
      });
      curCnt++
    }
  }
}

filtered = []
curCnt = 0;
maxCnt = 0;

async function showImg(url, idx){
  const tmp = await fetch(url)
  const blob = await tmp.blob()
  //console.log(blob)
  const newUrl = URL.createObjectURL(blob)
  filtered[idx].src = newUrl
}

console.log("Hello. This message was sent from symbol.js")