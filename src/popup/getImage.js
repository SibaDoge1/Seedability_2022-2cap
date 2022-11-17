let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');

let imgPattern = document.getElementById("imgPattern");
let imgPattern2 = document.getElementById("imgPattern2");
let imgPattern3 = document.getElementById("imgPattern3");
//패턴 이미지 숨기기
imgPattern.style.display = 'none';
imgPattern2.style.display = 'none';
imgPattern3.style.display = 'none';

inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);



function add_pattern(x){
    //target image
    let src = cv.imread(x);

    //mask
    let dst = new cv.Mat();
    let dst2 = new cv.Mat();
    let dst3 = new cv.Mat();
    let dst4 = new cv.Mat();
    let dst5 = new cv.Mat();
    let dst6 = new cv.Mat();
    let dst7 = new cv.Mat();
    let dst8 = new cv.Mat();

    //symbol
    let y = cv.imread(imgPattern);
    let y2 = cv.imread(imgPattern2);
    let y3 = cv.imread(imgPattern3);

    //사이즈가 변경된 패턴 이미지가 rsize에 저장됨
    let rsize = new cv.Mat();
    let rsize2 = new cv.Mat();
    let rsize3 = new cv.Mat();
    let rsize4 = new cv.Mat();
    let rsize5 = new cv.Mat();
    let rsize6 = new cv.Mat();
    let rsize7 = new cv.Mat();
    let rsize8 = new cv.Mat();

    //변경할 사이즈(imgElement로부터 받아옴)
    let dsize = new cv.Size(x.width, x.height);
    
    //resize
    cv.resize(y, rsize, dsize, 0, 0, cv.INTER_AREA);
    cv.resize(y, rsize2, dsize, 0, 0, cv.INTER_AREA);
    cv.resize(y, rsize3, dsize, 0, 0, cv.INTER_AREA);
    cv.resize(y, rsize4, dsize, 0, 0, cv.INTER_AREA);
    cv.resize(y, rsize5, dsize, 0, 0, cv.INTER_AREA);
    cv.resize(y, rsize6, dsize, 0, 0, cv.INTER_AREA);
    cv.resize(y, rsize7, dsize, 0, 0, cv.INTER_AREA);
    cv.resize(y, rsize8, dsize, 0, 0, cv.INTER_AREA);

    //color space
    let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
    let high = new cv.Mat(src.rows, src.cols, src.type(),  [32, 255, 255, 255]);

    let low2 = new cv.Mat(src.rows, src.cols, src.type(), [33, 0, 0, 0]);
    let high2 = new cv.Mat(src.rows, src.cols, src.type(),  [64, 255, 255, 255]);

    let low3 = new cv.Mat(src.rows, src.cols, src.type(), [65, 0, 0, 0]);
    let high3 = new cv.Mat(src.rows, src.cols, src.type(),  [96, 255, 255, 255]);

    let low4 = new cv.Mat(src.rows, src.cols, src.type(), [97, 0, 0, 0]);
    let high4 = new cv.Mat(src.rows, src.cols, src.type(),  [128, 255, 255, 255]);

    let low5 = new cv.Mat(src.rows, src.cols, src.type(), [129, 0, 0, 0]);
    let high5 = new cv.Mat(src.rows, src.cols, src.type(),  [160, 255, 255, 255]);

    let low6 = new cv.Mat(src.rows, src.cols, src.type(), [161, 0, 0, 0]);
    let high6 = new cv.Mat(src.rows, src.cols, src.type(),  [192, 255, 255, 255]);
    
    let low7 = new cv.Mat(src.rows, src.cols, src.type(), [193, 0, 0, 0]);
    let high7 = new cv.Mat(src.rows, src.cols, src.type(),  [224, 255, 255, 255]);
    
    let low8 = new cv.Mat(src.rows, src.cols, src.type(), [225, 0, 0, 0]);
    let high8 = new cv.Mat(src.rows, src.cols, src.type(),  [255, 255, 255, 255]);

    //inrange
    cv.inRange(src, low, high, dst);
    cv.inRange(src, low2, high2, dst2);
    cv.inRange(src, low3, high3, dst3);
    cv.inRange(src, low4, high4, dst4);
    cv.inRange(src, low5, high5, dst5);
    cv.inRange(src, low6, high6, dst6);
    cv.inRange(src, low7, high7, dst7);
    cv.inRange(src, low8, high8, dst8);

    //mask
    let mask_inv = new cv.Mat();
    let mask_inv2 = new cv.Mat();
    let mask_inv3 = new cv.Mat();
    let mask_inv4 = new cv.Mat();
    let mask_inv5 = new cv.Mat();
    let mask_inv6 = new cv.Mat();
    let mask_inv7 = new cv.Mat();
    let mask_inv8 = new cv.Mat();



    //bitwise_not
    cv.bitwise_not(dst, mask_inv);
    cv.bitwise_not(dst2, mask_inv2);
    cv.bitwise_not(dst3, mask_inv3);
    cv.bitwise_not(dst4, mask_inv4);
    cv.bitwise_not(dst5, mask_inv5);
    cv.bitwise_not(dst6, mask_inv6);
    cv.bitwise_not(dst7, mask_inv7);
    cv.bitwise_not(dst8, mask_inv8);



    //image processing
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
    for (let i = 0; i < mask_inv2.rows; i++) {
        for (let j = 0; j < mask_inv2.cols; j++) {
            if (mask_inv2.ucharPtr(i, j)[0] === 255) {
                rsize2.ucharPtr(i, j)[0] = dst2.ucharPtr(i, j)[0]
                rsize2.ucharPtr(i, j)[1] = dst2.ucharPtr(i, j)[1]
                rsize2.ucharPtr(i, j)[2] = dst2.ucharPtr(i, j)[2]
                rsize2.ucharPtr(i, j)[3] = dst2.ucharPtr(i, j)[3]
            }
        }
    }
    for (let i = 0; i < mask_inv3.rows; i++) {
        for (let j = 0; j < mask_inv3.cols; j++) {
            if (mask_inv3.ucharPtr(i, j)[0] === 255) {
                rsize3.ucharPtr(i, j)[0] = dst3.ucharPtr(i, j)[0]
                rsize3.ucharPtr(i, j)[1] = dst3.ucharPtr(i, j)[1]
                rsize3.ucharPtr(i, j)[2] = dst3.ucharPtr(i, j)[2]
                rsize3.ucharPtr(i, j)[3] = dst3.ucharPtr(i, j)[3]
            }
        }
    }
    for (let i = 0; i < mask_inv4.rows; i++) {
        for (let j = 0; j < mask_inv4.cols; j++) {
            if (mask_inv4.ucharPtr(i, j)[0] === 255) {
                rsize4.ucharPtr(i, j)[0] = dst4.ucharPtr(i, j)[0]
                rsize4.ucharPtr(i, j)[1] = dst4.ucharPtr(i, j)[1]
                rsize4.ucharPtr(i, j)[2] = dst4.ucharPtr(i, j)[2]
                rsize4.ucharPtr(i, j)[3] = dst4.ucharPtr(i, j)[3]
            }
        }
    }
    for (let i = 0; i < mask_inv5.rows; i++) {
        for (let j = 0; j < mask_inv5.cols; j++) {
            if (mask_inv5.ucharPtr(i, j)[0] === 255) {
                rsize5.ucharPtr(i, j)[0] = dst5.ucharPtr(i, j)[0]
                rsize5.ucharPtr(i, j)[1] = dst5.ucharPtr(i, j)[1]
                rsize5.ucharPtr(i, j)[2] = dst5.ucharPtr(i, j)[2]
                rsize5.ucharPtr(i, j)[3] = dst5.ucharPtr(i, j)[3]
            }
        }
    }
    for (let i = 0; i < mask_inv6.rows; i++) {
        for (let j = 0; j < mask_inv6.cols; j++) {
            if (mask_inv6.ucharPtr(i, j)[0] === 255) {
                rsize6.ucharPtr(i, j)[0] = dst6.ucharPtr(i, j)[0]
                rsize6.ucharPtr(i, j)[1] = dst6.ucharPtr(i, j)[1]
                rsize6.ucharPtr(i, j)[2] = dst6.ucharPtr(i, j)[2]
                rsize6.ucharPtr(i, j)[3] = dst6.ucharPtr(i, j)[3]
            }
        }
    }
    for (let i = 0; i < mask_inv7.rows; i++) {
        for (let j = 0; j < mask_inv7.cols; j++) {
            if (mask_inv7.ucharPtr(i, j)[0] === 255) {
                rsize7.ucharPtr(i, j)[0] = dst7.ucharPtr(i, j)[0]
                rsize7.ucharPtr(i, j)[1] = dst7.ucharPtr(i, j)[1]
                rsize7.ucharPtr(i, j)[2] = dst7.ucharPtr(i, j)[2]
                rsize7.ucharPtr(i, j)[3] = dst7.ucharPtr(i, j)[3]
            }
        }
    }
    for (let i = 0; i < mask_inv8.rows; i++) {
        for (let j = 0; j < mask_inv8.cols; j++) {
            if (mask_inv8.ucharPtr(i, j)[0] === 255) {
                rsize8.ucharPtr(i, j)[0] = dst8.ucharPtr(i, j)[0]
                rsize8.ucharPtr(i, j)[1] = dst8.ucharPtr(i, j)[1]
                rsize8.ucharPtr(i, j)[2] = dst8.ucharPtr(i, j)[2]
                rsize8.ucharPtr(i, j)[3] = dst8.ucharPtr(i, j)[3]
            }
        }
    }



    //output
    //bitwise_or
    let mani = new cv.Mat();
    //addWeighted
    let mani2 = new cv.Mat();
    /*
    let edge = new cv.Mat();
    cv.Canny(rsize, edge, 50, 100, 3, false);

    let edge_rgba = new cv.Mat();
    cv.cvtColor(edge, edge_rgba, cv.COLOR_GRAY2RGBA, 0);
    
    let edge_dst = new cv.Mat();
    
    cv.add(rsize, edge_rgba, edge_dst);
    //cv.imshow('canvasOutput2', rsize);*/

    //image manipulation
    //cv.bitwise_xor(src, rsize, mani);
   // cv.bitwise_xor(mani, rsize2, mani);
    //cv.bitwise_xor(mani, rsize3, mani);

    //cv.imshow('canvasOutput', mani);

    //addWeighted
    cv.addWeighted(src, 1.0, rsize,0.1, 0,  mani2);
    cv.addWeighted(mani2, 1.0, rsize2,0.2, 0,  mani2);
    cv.addWeighted(mani2, 1.0, rsize3,0.3, 0,  mani2);
    cv.addWeighted(mani2, 1.0, rsize4,0.4, 0,  mani2);
    cv.addWeighted(mani2, 1.0, rsize5,0.5, 0,  mani2);
    cv.addWeighted(mani2, 1.0, rsize6,0.6, 0,  mani2);
    cv.addWeighted(mani2, 1.0, rsize7,0.7, 0,  mani2);
    cv.addWeighted(mani2, 1.0, rsize8,0.8, 0,  mani2);
    cv.imshow('canvasOutput', y);

    //delete all
    src.delete();
    dst.delete();
    dst2.delete();
    dst3.delete();
    y.delete();
    y2.delete();
    y3.delete();
    rsize.delete();
    rsize2.delete();
    rsize3.delete();
    low.delete();
    low2.delete();
    low3.delete();
    high.delete();
    high2.delete();
    high3.delete();
    mask_inv.delete();
    mask_inv2.delete();
    mask_inv3.delete();
    mani.delete();

    return mani2;
    

}



imgElement.onload = function () {
    let src = cv.imread(imgElement);

    let edge = new cv.Mat();
    let dst = new cv.Mat();

    let temp =src.clone();
    
    add_pattern(imgElement);
    //console.log(this.height);
    
    cv.cvtColor(src, temp, cv.COLOR_RGB2GRAY, 0);
    
    //cv.Sobel(src, dstx, cv.CV_8U, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
    //cv.Sobel(src, dsty, cv.CV_8U, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
	
	cv.Canny(src, edge, 50, 100, 3, false);

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
    //console.log(edge_rgba);

    cv.add(src, edge_rgba, dst);
    //cv.imshow('canvasOutput', src);
    //cv.imshow('canvasOutput2', edge_rgba);
    //cv.imshow('canvasOutput3', dst);


    


    let rgbaPlanes = new cv.MatVector();
    let mergedPlanes = new cv.MatVector();
    let mergedPlanes2 = new cv.MatVector();
    let mergedPlanes3 = new cv.MatVector();
    
    cv.split(src, rgbaPlanes);

    let R = rgbaPlanes.get(0);
    let G = rgbaPlanes.get(1);
    let B = rgbaPlanes.get(2);

    mergedPlanes.push_back(R);
    mergedPlanes2.push_back(G);
    mergedPlanes3.push_back(B);
    //mergedPlanes.push_back(G);
    //mergedPlanes.push_back(B);
    //mergedPlanes.push_back(B);
    //cv.imshow('canvasOutput', R);
    //cv.imshow('canvasOutput2', B);
    console.log(R);

    let test = new cv.Mat();
    let test2 = new cv.Mat();
    let test3 = new cv.Mat();
    cv.merge(mergedPlanes, test);
    cv.merge(mergedPlanes2, test2);
    cv.merge(mergedPlanes3, test3);


    let test_edge = new cv.Mat();
    cv.Canny(test, test_edge, 50, 100, 3, false);

    //cv.imshow('canvasOutput', test);
    cv.cvtColor(test2, test2, cv.COLOR_GRAY2RGBA, 0);
    //cv.imshow('canvasOutput2', test2);
    cv.cvtColor(test3, test3, cv.COLOR_GRAY2RGBA, 0);
    //cv.imshow('canvasOutput3', test3);

    



    src.delete();
    dst.delete();
    edge.delete();
    


};
