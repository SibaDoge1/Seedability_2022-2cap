let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');

let imgPattern = document.getElementById("imgPattern");
//패턴 이미지 숨기기
imgPattern.style.display = 'none';

inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
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

    //패턴 이미지
    let src3 = cv.imread(imgPattern);

    let edge = new cv.Mat();
    let dst = new cv.Mat();

    //사이즈가 변경된 패턴 이미지가 rsize에 저장됨
    let rsize = new cv.Mat();
    //변경할 사이즈(imgElement로부터 받아옴)
    let dsize = new cv.Size(imgElement.width, imgElement.height);
    cv.resize(src3, rsize, dsize, 0, 0, cv.INTER_AREA);

    let temp =src.clone();
    
    //add_pattern(src, rsize);
    //console.log(this.height);

    
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
	
	cv.Canny(temp, edge, 50, 100, 3, false);

    cv.bitwise_xor(src, edge, dst);
    cv.imshow('canvasOutput', dst);


    //let rgbaPlanes = new cv.MatVector();
    //let mergedPlanes = new cv.MatVector();

    /*
    cv.split(temp, rgbaPlanes);

    let R = rgbaPlanes.get(0);
    let G = rgbaPlanes.get(1);
    let B = rgbaPlanes.get(2);

    mergedPlanes.push_back(R);
    mergedPlanes.push_back(G);
    mergedPlanes.push_back(B);*/

    //let test = new cv.Mat();
    //cv.merge(mergedPlanes, test);



    src.delete();
    dst.delete();
    edge.delete();
    


};
