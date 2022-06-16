const fs = require('fs');
const Jimp = require('jimp');
const WIDTH = 160;
const HEIGHT = 160;
const HEADER_OFFSET = 54;
let rows = 0;
let data_to_write ='';
// Read image, resize, color the background, resize, and convert to bmp
function ImageToBmp(){
    Jimp.read('1.png',(err, image)=>{
        if(err) throw err;
        image
        .resize(WIDTH,HEIGHT)
        .background(0xf1f1f1)
        .write('imgbmp.bmp');
    });
}
// Write unicode braille characters to text file
function ImageToBraille(){
    ImageToBmp();
    setTimeout(()=>{
        const ImageData = fs.readFileSync('imgbmp.bmp');
        for(let i = HEADER_OFFSET; i < ImageData.length; i+=6){
            data_to_write+=String.fromCharCode(PixelsToBinary(ImageData,i,WIDTH));
            rows++;
            if(rows % (WIDTH/2) == 0){
                data_to_write+='\r\n';
                i+=((WIDTH*3)*3);
            }
        }fs.writeFileSync('braille.txt',data_to_write);
        console.log(data_to_write);
    },400);
}
// Read pixel data in 2 x 4 chunks, read grayscale color values and determine if pixel will appear as braille
function PixelsToBinary(Data, i, Width){
    let binary = 10240;
    if(addColorVals(Data[i],Data[i+1],Data[i+2]) < 128) binary+=1;
    if(addColorVals(Data[i+3],Data[i+4],Data[i+5]) < 128) binary+=8;
    if(addColorVals(Data[i+(Width*3)],Data[i+(Width*3)+1],Data[i+(Width*3)+2]) < 128) binary+=2;
    if(addColorVals(Data[i+(Width*3)+3],Data[i+(Width*3)+4],Data[i+(Width*3)+5]) < 128) binary+= 16;
    if(addColorVals(Data[i+(Width*6)],Data[i+(Width*6)+1],Data[i+(Width*6)+2]) < 128) binary+= 4;
    if(addColorVals(Data[i+(Width*6)+3],Data[i+(Width*6)+4],Data[i+(Width*6)+5]) < 128) binary+= 32;
    if(addColorVals(Data[i+(Width*9)],Data[i+(Width*9)+1],Data[i+(Width*9)+2]) < 128) binary+= 64;
    if(addColorVals(Data[i+(Width*9)+3],Data[i+(Width*9)+4],Data[i+(Width*9)+5]) < 128) binary+= 128;
    return binary;
}
// Inverted version of the above
function PixelsToBinaryInverted(Data, i, Width){
    let binary = 10240;
    if(addColorVals(Data[i],Data[i+1],Data[i+2]) > 128) binary+=1;
    if(addColorVals(Data[i+3],Data[i+4],Data[i+5]) > 128) binary+=8;
    if(addColorVals(Data[i+(Width*3)],Data[i+(Width*3)+1],Data[i+(Width*3)+2]) > 128) binary+=2;
    if(addColorVals(Data[i+(Width*3)+3],Data[i+(Width*3)+4],Data[i+(Width*3)+5]) > 128) binary+= 16;
    if(addColorVals(Data[i+(Width*6)],Data[i+(Width*6)+1],Data[i+(Width*6)+2]) > 128) binary+= 4;
    if(addColorVals(Data[i+(Width*6)+3],Data[i+(Width*6)+4],Data[i+(Width*6)+5]) > 128) binary+= 32;
    if(addColorVals(Data[i+(Width*9)],Data[i+(Width*9)+1],Data[i+(Width*9)+2]) > 128) binary+= 64;
    if(addColorVals(Data[i+(Width*9)+3],Data[i+(Width*9)+4],Data[i+(Width*9)+5]) > 128) binary+= 128;
    return binary;
}
// Calculate greyscale color value of each pixel
function addColorVals(b,g,r){
    return Math.round((b+g+r)/3);
}
// Run program
ImageToBraille();
