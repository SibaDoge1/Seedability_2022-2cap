let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);


imgElement.onload = function () {
    let src = cv.imread(imgElement);
    let dst = new cv.Mat();
    // You can try more different parameters
    let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
    let high = new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);

    cv.inRange(src, low, high, dst);
    let mask = dst.clone();
    for (let i = 0; i < mask.rows; i++) {
        for (let j = 0; j < mask.cols; j++) {
            if (mask.ucharPtr(i, j)[0] === 255) {
                src.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0]
                src.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1]
                src.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2]
                src.ucharPtr(i, j)[3] = dst.ucharPtr(i, j)[3]
            }
        }
    }
    cv.imshow('canvasOutput', src);
    src.delete();
    dst.delete();

};
