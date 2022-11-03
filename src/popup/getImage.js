let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);


imgElement.onload = function () {
    let src = cv.imread(imgElement);
    let src2 = src.clone();
    let dst = new cv.Mat();
    let dst2 = new cv.Mat();
    // You can try more different parameters
    let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
    let high = new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);

    let low2 = new cv.Mat(src2.rows, src2.cols, src.type(), [0, 128, 0, 0]);
    let high2 = new cv.Mat(src2.rows, src2.cols, src.type(), [100, 255, 100, 255]);

    cv.inRange(src, low, high, dst);
    cv.inRange(src2, low2, high2, dst2)
    let mask = dst.clone();
    let mask2 = dst2.clone();
    //use inrange function to set mask area


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
    for (let i = 0; i < mask2.rows; i++) {
        for (let j = 0; j < mask2.cols; j++) {
            if (mask2.ucharPtr(i, j)[0] === 255) {
                src2.ucharPtr(i, j)[0] = dst2.ucharPtr(i, j)[0]
                src2.ucharPtr(i, j)[1] = dst2.ucharPtr(i, j)[1]
                src2.ucharPtr(i, j)[2] = dst2.ucharPtr(i, j)[2]
                src2.ucharPtr(i, j)[3] = dst2.ucharPtr(i, j)[3]
            }
        }
    }
    let mani = new cv.Mat();

    cv.add(src, src2, mani);

    cv.imshow('canvasOutput2', mani);

    src.delete();
    dst.delete();
    src2.delete();
    dst2.delete();


};
