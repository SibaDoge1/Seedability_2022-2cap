const maxFontSize = 150;
const originFontSize = 100;

let elementsToMinimize = [];
let lerpAmountOfFocus = 0.0;
let animIDOfMaximize;

let currentScrollTop;
let currentScrollLeft;

let currentFocus = null;
let newFocus = null;
let paragraph = null;
let hasChildParagraph = false;

document.onmousemove = function (e) {
	newFocus = document.elementFromPoint(e.clientX, e.clientY);

	if (newFocus != null) {
		findParagraph(newFocus);

		if (paragraph != null) {
			if (currentFocus != null && currentFocus != paragraph) {
				let index = elementsToMinimize.length;

				elementsToMinimize.push({
					element: currentFocus,
					lerpAmount: 100.0 - lerpAmountOfFocus
				});

				let animID = setInterval(Minimize, 5, index);

				elementsToMinimize[index].animID = animID;

				clearInterval(animIDOfMaximize);
				lerpAmountOfFocus = 0.0;
			}
			currentFocus = paragraph;
			if (currentFocus != null && lerpAmountOfFocus == 0.0) {		
				animIDOfMaximize = setInterval(Maximize, 5);
			}
		}
	}
};

function Minimize (index) {
	if (elementsToMinimize[index].lerpAmount >= 100.0) {
		clearInterval(elementsToMinimize[index].animID);
	} else {
		elementsToMinimize[index].lerpAmount += 20.0;
		if (elementsToMinimize[index].lerpAmount >= 100.0) { 
			elementsToMinimize[index].lerpAmount = 100.0;
		}
		let fontSize = (maxFontSize - (maxFontSize - originFontSize) * elementsToMinimize[index].lerpAmount / 100.0);
		
		elementsToMinimize[index].element.style.fontSize = fontSize + "%";
	}
}

function Maximize () {
	if (lerpAmountOfFocus >= 100.0) {
		clearInterval(animIDOfMaximize);
	} else {
		lerpAmountOfFocus += 20.0;
		let fontSize = (originFontSize + (maxFontSize - originFontSize) * lerpAmountOfFocus / 100.0);

		currentFocus.style.fontSize = fontSize + "%";
	}
}

function findParagraph (target) {
	paragraph = null;
	hasChildParagraph = false;

	//단 하나라도 자식 문단이 있다면, 상위 오브젝트로 판단하여 크기를 조정하지 않는다.
	for (var i = 0; i < target.children.length; i++) {
		findParagraphFromChildren(target.children[i]);
	}

	if (hasChildParagraph == false) {
		//문단, 혹은 문단의 자식 노드일 경우, 가장 가까운 부모 문단을 찾는다.
		findParagraphFromParents(target);
	}
}


function findParagraphFromChildren (target) {
	//가장 하위 자식 노드가 될 때까지 반복함.
	if (target.children.length == 0) {

	} else {
		if (target.tagName == "pre" || target.tagName == "p") {
			//'pre' or 'p' 태그일 경우
			hasChildParagraph = true;
		} else  {
			//'br' 태그를 포함한 자식을 가지고 있는 경우
			if (target.querySelectorAll('br').length > 0) {
				hasChildParagraph = true;
			} else {
				for (var i = 0; i < target.children.length; i++) {
					findParagraphFromChildren(target.children[i]);
				}
			}
		}
	}
}

function findParagraphFromParents (target) {
	if (target.tagName == "pre" || target.tagName == "p") {
		paragraph = target;
	} else  {
		if (target.querySelectorAll('br').length > 0) {
			paragraph = target;
		} else {
			findParagraphFromParents(target.parentElement);
		}
	}
}