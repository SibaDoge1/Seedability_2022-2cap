let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');

let imgPattern = document.getElementById("imgPattern");
//패턴 이미지 숨기기
imgPattern.style.display = 'none';

inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);


function add_pattern(x){
    let src = cv.imread(imgElement);
    let dst = new cv.Mat();
    let y = cv.imread(imgPattern);

    //사이즈가 변경된 패턴 이미지가 rsize에 저장됨
    let rsize = new cv.Mat();
    //변경할 사이즈(imgElement로부터 받아옴)
    let dsize = new cv.Size(x.width, x.height);
    cv.resize(y, rsize, dsize, 0, 0, cv.INTER_AREA);

    let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 128, 0, 0]);
    let high = new cv.Mat(src.rows, src.cols, src.type(),  [100, 255, 100, 255]);

    cv.inRange(src, low, high, dst);

    let mask = dst.clone();
    //use inrange function to set mask area
    let mask_inv = new cv.Mat();

    cv.bitwise_not(mask, mask_inv);

    cv.imshow('canvasOutput', dst);

    for (let i = 0; i < mask_inv.rows; i++) {
        for (let j = 0; j < mask_inv.cols; j++) {
            if (mask_inv.ucharPtr(i, j)[0] === 255) {
                rsize.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0]
                rsize.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1]
                rsize.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2]
                rsize.ucharPtr(i, j)[3] = dst.ucharPtr(i, j)[3]
            }
        }
    }

    let mani = new cv.Mat();

    //let edge = new cv.Mat();
    //cv.Canny(rsize, edge, 50, 100, 3, false);

    //let edge_rgba = new cv.Mat();
    //cv.cvtColor(edge, edge_rgba, cv.COLOR_GRAY2RGBA, 0);
    
    //let edge_dst = new cv.Mat();
    
    //cv.add(rsize, edge_rgba, edge_dst);
    cv.imshow('canvasOutput2', rsize);

    cv.bitwise_xor(src, rsize, mani);

    //cv.imshow('canvasOutput2', y);

    cv.imshow('canvasOutput3', mani);

    src.delete();
    dst.delete();
    y.delete();

}



imgElement.onload = function () {
    let src = cv.imread(imgElement);

    let edge = new cv.Mat();
    let dst = new cv.Mat();

    let temp =src.clone();
    
    add_pattern(imgElement);
    //console.log(this.height);
    
    //cv.cvtColor(src, temp, cv.COLOR_RGB2GRAY, 0);
    
    //cv.Sobel(src, dstx, cv.CV_8U, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
    //cv.Sobel(src, dsty, cv.CV_8U, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
	
	//cv.Canny(src, edge, 50, 100, 3, false);

    //let white_low = new cv.Mat(edge.rows, edge.cols, edge.type(), [0, 0, 0, 0]);
    //let white_high = new cv.Mat(edge.rows, edge.cols, edge.type(),  [0, 0, 255, 255]);
    //let white_dst = new cv.Mat();

    //cv.inRange(edge, white_low, white_high, white_dst);

    //console.log(edge);
    //console.log(src);
    //console.log(temp);
    //console.log(white_dst);

    //let edge_rgba = new cv.Mat();

    //cv.cvtColor(edge, edge_rgba, cv.COLOR_GRAY2RGBA, 0);
    //console.log(edge_rgba);

    //cv.add(src, edge_rgba, dst);
    //cv.imshow('canvasOutput', src);
    //cv.imshow('canvasOutput2', edge_rgba);
    //cv.imshow('canvasOutput3', dst);


    


    //let rgbaPlanes = new cv.MatVector();
    //let mergedPlanes = new cv.MatVector();

    
    //cv.split(src, rgbaPlanes);

    //let R = rgbaPlanes.get(0);
    //let G = rgbaPlanes.get(1);
    //let B = rgbaPlanes.get(2);

    //mergedPlanes.push_back(R);
   // mergedPlanes.push_back(G);
    //mergedPlanes.push_back(B);
    //cv.imshow('canvasOutput', R);
   // cv.imshow('canvasOutput2', G);

    //let test = new cv.Mat();
    //cv.merge(mergedPlanes, test);
    
   // cv.imshow('canvasOutput3', test);



    src.delete();
    dst.delete();
    edge.delete();
    


};
