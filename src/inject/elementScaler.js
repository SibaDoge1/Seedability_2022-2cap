const maxFontSize = 150;
const originFontSize = 100;

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
let parentCache = []
const blackList = []

document.onmousemove = function (e) {
	targets.forEach(element=>{
    element.style = element.originStyle;
    element.style.transition = "0.5s";
    element.isZoomed = false
	})
  targets = []

	let elements = document.elementsFromPoint(e.clientX, e.clientY);

  for(var element  of elements){
		if ((!blackList.includes(element.tagName))){
      //텍스트일 경우
      if(element.firstChild?.nodeValue != null && element.firstChild?.nodeValue.replace(/\s/g, "") != ""){ 

        //console.log(element.firstChild?.nodeValue)
        let originStyle = window.getComputedStyle(element)
        var fontSize = parseInt(originStyle.fontSize) + 5 + "px";
        element.style.fontSize = fontSize;
        element.originStyle = originStyle;
        element.style.transition = "0.5s";
        element.isZoomed = true
        targets.push(element)
        
      }
      //이미지일 경우(src값이 있을 경우)
      else if((element.src != null || element.dataset.src != null)){ 

          //console.log(element)
          let originStyle = window.getComputedStyle(element)
          element.style.transform = "scale(1.3, 1.3)";
          element.originStyle = originStyle;
          element.style.transition = "0.5s";
          element.isZoomed = true
          targets.push(element)
      }
		}
  }
};

const getParents = el => {
  for (var parents = []; el; el = el.parentNode) {
    parents.push(el);
  }

  return parents;
};

function isDuplicate(el){
  const parents = getParents(el)
  for(var ele  of parents){
    if(ele.isZoomed == true){
      return true
    }
  }
  return false
}