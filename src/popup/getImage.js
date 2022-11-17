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

    let dstx = new cv.Mat();
    let dsty = new cv.Mat();

    let edge = new cv.Mat();
    let dst = new cv.Mat();
    let dst2 = new cv.Mat();

    //사이즈가 변경된 패턴 이미지가 rsize에 저장됨
    let rsize = new cv.Mat();
    //변경할 사이즈(imgElement로부터 받아옴)
    let dsize = new cv.Size(imgElement.width, imgElement.height);
    cv.resize(src3, rsize, dsize, 0, 0, cv.INTER_AREA);

    let temp =src.clone();
    
    //add_pattern(src, rsize);
    //console.log(this.height);
    
    cv.cvtColor(src, temp, cv.COLOR_RGB2GRAY, 0);
    //cv.Sobel(src, dstx, cv.CV_8U, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
    //cv.Sobel(src, dsty, cv.CV_8U, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
	
	cv.Canny(temp, edge, 50, 100, 3, false);

    //let white_low = new cv.Mat(edge.rows, edge.cols, edge.type(), [0, 0, 0, 0]);
    //let white_high = new cv.Mat(edge.rows, edge.cols, edge.type(),  [0, 0, 255, 255]);
    //let white_dst = new cv.Mat();

    //cv.inRange(edge, white_low, white_high, white_dst);

    //console.log(edge);
    //console.log(src);
    //console.log(temp);
    //console.log(white_dst);

    let edge_rgba = new cv.Mat();

    cv.cvtColor(edge, edge_rgba, cv.COLOR_GRAY2RGBA, 0);
    console.log(edge_rgba);

    cv.add(src, edge_rgba, dst);
    cv.imshow('canvasOutput', src);
    cv.imshow('canvasOutput2', edge_rgba);
    cv.imshow('canvasOutput3', dst);


    


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
