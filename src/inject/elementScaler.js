const maxFontSize = 150;
const originFontSize = 100;

chrome.runtime.onMessage.addListener(message => {
  if(message.type =="expension"){
    chrome.storage.sync.get(['expension'], function(result) {
      if(result != null){
        expension = result.expension
      }
    });
  }
});

let expension = "False"

// document.onmousemove = function (e) {
// 	let tmp = document.elementFromPoint(e.clientX, e.clientY);
// 	if (x != null && x != tmp) {
// 		x.style.transform = "scale(1.0, 1.0)";
// 	}
// 	x = tmp;
// 	if (x != null) {
// 		x.style.transform = "scale(1.2, 1.2)";
// 		x.style.transition = "0.5s";
// 	}
// };

let targets = []
let affectedDoms = []
let parentCache = []
const blackList = []
// document.onmouseout = (e)=>{
//   let element = e.target

  
//   element.style = element.originStyle;
//   element.style.transition = "0.5s";
//   element.isZoomed = false
// 	targets.forEach(element=>{
//     element.style = element.originStyle;
//     element.style.transition = "0.5s";
//     element.isZoomed = false
// 	})
//   targets = []
//   affectedDoms = []
// }

window.addEventListener('DOMContentLoaded', function(e) {
  document.onmouseover = scaleElement
  chrome.storage.sync.get(['expension'], function(result) {
    if(result != null){
      expension = result.expension
    }
  });
  
});


function scaleElement(e){
  targets.forEach(element=>{
    console.log(element.originStyle)
    if(element.originStyle == ""){
      element.removeAttribute("style")
    }
    else{
      element.style = element.originStyle;
      element.style.transition = "0.5s";
      element.isZoomed = false
    }
  })
  targets = []
  affectedDoms = []
  if(expension != "True") return


  let element = e.target

  if(isVisible(element)){
    //텍스트일 경우
    //element.firstChild?.nodeValue != null && element.firstChild?.nodeValue.trim()
    if(checkText(element)){ 
      if(isDuplicate(element)) return
      //console.log(element.firstChild?.nodeValue)
      let originStyle = element.style
      if(element.originStyle === undefined){
        element.originStyle = originStyle;
        element.originFontSize = window.getComputedStyle(element).fontSize
      }
      

      var fontSize = changeFontSize(element.originFontSize);
      element.style.setProperty('font-size', fontSize, 'important');
      element.style.transition = "0.5s";
      element.isZoomed = true
      targets.push(element)
      
    }
    //이미지일 경우(src값이 있을 경우)
    else if((element.src != null || element.dataset.src != null)){ 
      if(isDuplicate(element)) return
        //console.log(element)
        let originStyle = element.style
        element.style.transform = "scale(1.4, 1.4)";
        element.originStyle = originStyle;
        element.style.transition = "0.5s";
        element.isZoomed = true
        targets.push(element)
    }
  }
}


function checkText(ele){  
  if (ele.hasChildNodes()) {
    for(child of ele.childNodes){
      if(child.nodeType == 3 && child.nodeValue.trim()){
        return true
      }
    }
  }
  return false
}


const getParents = el => {
  for (var parents = []; el; el = el.parentNode) {
    parents.push(el);
  }

  return parents;
};


function isDuplicate(el){
  if(el.isZoomed === true){
    return true
  }
  const parents = getParents(el)
  for(var ele  of parents){
    if(ele.isZoomed === true){
      return true
    }
  }
  return false
}


function isVisible(e) {
  return !!( e.offsetWidth || e.offsetHeight || e.getClientRects().length );
}


function isText(e){
  let child = e.firstChild,
  texts = [];

  while (child) {
      if (child.nodeType == 3) {
          if(child.data.trim()) return true
      }
      child = child.nextSibling;
  }
  return false
}


function convertCSSLengthUnit(fromUnitValue, toUnit){
  let value = fromUnitValue.match(/[0-9]+\.*[0-9]*/g)[0];
  let unit = fromUnitValue.match(/[a-zA-Z]+/g)[0];

  let frag = document.createRange().createContextualFragment(`
    <div style='all: initial; pointer-events: none; display: block; position: absolute; border: none; padding: 0; margin: 0; background: rgba(0,0,0,0); color: color: rgba(0,0,0,0); width: 1${unit}; height: 1px;'></div>
  `);
  document.body.appendChild(frag);
  let measureElement = document.body.children[document.body.children.length-1];
  let toUnitValuePixel = measureElement.getBoundingClientRect().width * value; // X
  measureElement.remove();

  if(toUnit){
    let frag = document.createRange().createContextualFragment(`
      <div style='all: initial; pointer-events: none; display: block; position: absolute; border: none; padding: 0; margin: 0; background: rgba(0,0,0,0); color: color: rgba(0,0,0,0); width: 1${toUnit}; height: 1px;'></div>
    `);
    document.body.appendChild(frag);
    let measureElement = document.body.children[document.body.children.length-1];
    let valueUnit = measureElement.getBoundingClientRect().width; // Y
    measureElement.remove();

    // Given: Aem and Bmm with B=1. We know: Aem = Xpx and Bmm = Ypx. Therefore: 1px = Bmm/Y Result: Aem = Xpx = X * 1px = X * Bmm/Y <=> Aem = X * 1mm/Y (with B=1) <=> Aem = X/Ymm
    return (toUnitValuePixel / valueUnit) + toUnit;
  }
  return toUnitValuePixel + 'px';
}


function changeFontSize(originFontSize){
  let converted = convertCSSLengthUnit(originFontSize, 'px')
  var fontSize = parseInt(converted) + 10 + "px";
  return fontSize
}
