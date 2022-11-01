let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

imgElement.onload = function () {

    let src = cv.imread(imgElement);
    let dst = new cv.Mat();
    let dst_1 = new cv.Mat();

    // converting from gbr to hsv color space
    cv.cvtColor(src, dst, cv.COLOR_RGB2HSV)
    cv.cvtColor(dst, dst, cv.COLOR_RGB2BGR)

    let hsv_low = new cv.Mat(dst.rows, dst.cols, dst.type(), [60, 25, 0, 0]);
    let hsv_high = new cv.Mat(dst.rows, dst.cols, dst.type(), [255, 170, 20, 0]);

    // skin color range for hsv color space 
    cv.inRange(dst, hsv_low, hsv_high, dst);

    // converting from gbr to YCbCr color space
    cv.cvtColor(src, dst_1, cv.COLOR_RGB2YCrCb);
    cv.cvtColor(dst_1, dst_1, cv.COLOR_RGB2BGR);

    let YCbCr_low = new cv.Mat(dst_1.rows, dst_1.cols, dst_1.type(), [90, 135, 10, 0]);
    let YCbCr_high = new cv.Mat(dst_1.rows, dst_1.cols, dst_1.type(), [125, 175, 235, 0]);

    // skin color range for YCbCr color space 
    cv.inRange(dst_1, YCbCr_low, YCbCr_high, dst_1);

    // merge skin detection (YCbCr and hsv)
    cv.bitwise_and(dst_1, dst, dst)
    cv.medianBlur(dst, dst, 3)

    let ksize = new cv.Size(80, 80);
    let anchor = new cv.Point(-1, -1);


    // make blurred copy of original image
    cv.blur(src, dst_1, ksize, anchor, cv.BORDER_DEFAULT);

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

    // mask blurred image to create image with only skin blurred, rest is opaque
    dst_1.copyTo(dst, dst)

    cv.imshow('canvasOutput', src);

    src.delete();
    dst.delete();
    dst_1.delete();
    hsv_low.delete();
    hsv_high.delete();
    YCbCr_low.delete();
    YCbCr_high.delete();
    document.get
};
