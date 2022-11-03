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
    //let dst2 = new cv.Mat();
    // You can try more different parameters
    let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 128, 0, 0]);
    let high = new cv.Mat(src.rows, src.cols, src.type(),  [100, 255, 100, 255]);

    //let low2 = new cv.Mat(src2.rows, src2.cols, src.type(), [0, 128, 0, 0]);
    //let high2 = new cv.Mat(src2.rows, src2.cols, src.type(), [100, 255, 100, 255]);

    cv.inRange(src, low, high, dst);
    //cv.inRange(src2, low2, high2, dst2)
    let mask = dst.clone();
    //use inrange function to set mask area
    let mask_inv = new cv.Mat();
    
    cv.bitwise_not(mask, mask_inv);
    /*
    for (let i = 0; i < mask.rows; i++) {
        for (let j = 0; j < mask.cols; j++) {
            if (mask.ucharPtr(i, j)[0] === 255) {
                src.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0]
                src.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1]
                src.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2]
                src.ucharPtr(i, j)[3] = dst.ucharPtr(i, j)[3]
            }
        }
    }*/
    cv.imshow('canvasOutput', dst);
    
    for (let i = 0; i < mask_inv.rows; i++) {
        for (let j = 0; j < mask_inv.cols; j++) {
            if (mask_inv.ucharPtr(i, j)[0] === 255) {
                src2.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0]
                src2.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1]
                src2.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2]
                src2.ucharPtr(i, j)[3] = dst.ucharPtr(i, j)[3]
            }
        }
    }
    let mani = new cv.Mat();

    //cv.add(src, src2, mani);
    cv.addWeighted(src,0.7,  src2,0.3, 0.0, mani);

    cv.imshow('canvasOutput2', src2);
    cv.imshow('canvasOutput3', mani);

    src.delete();
    dst.delete();
    src2.delete();
    //dst2.delete();


};
