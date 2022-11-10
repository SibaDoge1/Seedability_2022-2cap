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


function add_pattern(x, y){
    let dst = new cv.Mat();
    //let bg = new cv.Mat();
    //let dst2 = new cv.Mat();
    // You can try more different parameters
    let low = new cv.Mat(x.rows, x.cols, x.type(), [0, 128, 0, 0]);
    let high = new cv.Mat(x.rows, x.cols, x.type(),  [100, 255, 100, 255]);

    cv.inRange(x, low, high, dst);

    let mask = dst.clone();
    //use inrange function to set mask area
    let mask_inv = new cv.Mat();

    cv.bitwise_not(mask, mask_inv);

    cv.imshow('canvasOutput', dst);
    /*
    for (let i = 0; i < mask.rows; i++) {
        for (let j = 0; j < mask.cols; j++) {
            if (mask.ucharPtr(i, j)[0] === 255) {
                x.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0]
                x.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1]
                x.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2]
                x.ucharPtr(i, j)[3] = dst.ucharPtr(i, j)[3]
            }
        }
    }
    */
    for (let i = 0; i < mask_inv.rows; i++) {
        for (let j = 0; j < mask_inv.cols; j++) {
            if (mask_inv.ucharPtr(i, j)[0] === 255) {
                y.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0]
                y.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1]
                y.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2]
                y.ucharPtr(i, j)[3] = dst.ucharPtr(i, j)[3]
            }
        }
    }

    let mani = new cv.Mat();

    cv.bitwise_xor(x, y, mani);

    cv.imshow('canvasOutput2', y);

    cv.imshow('canvasOutput3', mani);

    x.delete();
    dst.delete();
    y.delete();

}

imgElement.onload = function () {
    let src = cv.imread(imgElement);
    //let src2 = cv.imread(imgElement2);
    let edge = new cv.Mat();
    let dst = new cv.Mat();

    let temp =src.clone();

    //add_pattern(src, src2);
    
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
	
	cv.Canny(src, edge, 50, 100, 3, false);

    cv.bitwise_xor(src, edge, dst);

    /*
    let rgbaPlanes = new cv.MatVector();
    let mergedPlanes = new cv.MatVector();

    cv.split(temp, rgbaPlanes);

    let R = rgbaPlanes.get(0);
    let G = rgbaPlanes.get(1);
    let B = rgbaPlanes.get(2);

    mergedPlanes.push_back(R);
    mergedPlanes.push_back(G);
    mergedPlanes.push_back(B);

    let test = new cv.Mat();
    cv.merge(mergedPlanes, test);*/

    cv.imshow('canvasOutput', dst);
d
    src.delete();
    dst.delete();
    edge.delete();
    


};
