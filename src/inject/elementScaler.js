let x = null;

document.onmousemove = function (e) {
	let tmp = document.elementFromPoint(e.clientX, e.clientY);
	if (x != null && x != tmp) {
		x.style.transform = "scale(1.0, 1.0)";
	}
	x = tmp;
	if (x != null) {
		x.style.transform = "scale(1.1, 1.1)";
	}
};

// let targets = [];
// const blackList = ["div"]

// document.onmousemove = function (e) {
// 	targets.forEach(element=>{
// 		element.style.transform = "scale(1.0, 1.0)";
// 	})

// 	let elements = document.elementsFromPoint(e.clientX, e.clientY);

// 	elements.forEach(element => {
// 		//if (!blackList.includes(element.tagName))
// 		if (!blackList.includes(element.tagName) &&element.firstChild.nodeValue != null){
// 			console.log(element.tagName)
// 			console.log(element.firstChild.nodeValue)
// 			element.style.transform = "scale(1.1, 1.1)";
// 		}
// 	});
// 	targets = elements
// };