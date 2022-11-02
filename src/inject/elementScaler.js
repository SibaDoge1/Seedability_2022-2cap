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