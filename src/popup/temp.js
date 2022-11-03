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

///////////////////////////////////////////////////////////
let imgElement = document.getElementById('imageSrc');
let imgElement2 = document.getElementById('imageSrc2');
let inputElement = document.getElementById('fileInput');
let inputElement2 = document.getElementById('fileInput2')
inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);
inputElement2.addEventListener('change', (e) => {
    imgElement2.src = URL.createObjectURL(e.target.files[0]);
}, false);


imgElement2.onload = function () {
    let src = cv.imread(imgElement);
    let src2 = cv.imread(imgElement2);
    let dst = new cv.Mat();
    let dst2 = new cv.Mat();
    // You can try more different parameters
    let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
    let high = new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);

    //let low2 = new cv.Mat(src2.rows, src2.cols, src.type(), [0, 128, 0, 0]);
    //let high2 = new cv.Mat(src2.rows, src2.cols, src.type(), [100, 255, 100, 255]);

    cv.inRange(src, low, high, dst);
    //cv.inRange(src2, low2, high2, dst2)
    let mask = dst.clone();
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
    cv.imshow('canvasOutput', dst);
    /*
    for (let i = 0; i < mask.rows; i++) {
        for (let j = 0; j < mask.cols; j++) {
            if (mask.ucharPtr(i, j)[0] === 255) {
                src2.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0]
                src2.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1]
                src2.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2]
                src2.ucharPtr(i, j)[3] = dst.ucharPtr(i, j)[3]
            }
        }
    }*/
    //let mani = new cv.Mat();

    //cv.add(src, src2, mani);
    let res = cv.bitwise_and(src2, src2, dst2, mask);

    cv.imshow('canvasOutput2', res);

    src.delete();
    dst.delete();
    src2.delete();
    dst2.delete();


};
