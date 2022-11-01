let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);
imgElement.onload = function () {

    let src = cv.imread(imgElement);
    let dst = new cv.Mat();
    let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
    let high = new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);
    // You can try more different parameters
    cv.inRange(src, low, high, dst);
    cv.imshow('canvasOutput', dst);
    src.delete(); dst.delete(); low.delete(); high.delete();
};
