(function($) {
var digitCharacters = [
"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
"U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d",
"e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
"o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
"y", "z", "#", "$", "%", "*", "+", ",", "-", ".",
":", ";", "=", "?", "@", "[", "]", "^", "_", "{",
"|", "}", "~",
];
function decode83(str) {
var value = 0;
for (var i = 0; i < str.length; i++) {
var c = str[i];
var digit = digitCharacters.indexOf(c);
value = value * 83 + digit;
}
return value;
}
function sRGBToLinear(value) {
var v = value / 255;
if (v <= 0.04045) {
return v / 12.92;
}
else {
return Math.pow((v + 0.055) / 1.055, 2.4);
}
}
function linearTosRGB(value) {
var v = Math.max(0, Math.min(1, value));
if (v <= 0.0031308) {
return Math.round(v * 12.92 * 255 + 0.5);
}
else {
return Math.round((1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255 + 0.5);
}
}
function sign(n) {
return (n < 0 ? -1 : 1);
}
function signPow(val, exp) {
return sign(val) * Math.pow(Math.abs(val), exp);
}
function decodeDC(value) {
var intR = value >> 16;
var intG = (value >> 8) & 255;
var intB = value & 255;
return [sRGBToLinear(intR), sRGBToLinear(intG), sRGBToLinear(intB)];
}
function decodeAC(value, maximumValue) {
var quantR = Math.floor(value / (19 * 19));
var quantG = Math.floor(value / 19) % 19;
var quantB = value % 19;
var rgb = [
signPow((quantR - 9) / 9, 2.0) * maximumValue,
signPow((quantG - 9) / 9, 2.0) * maximumValue,
signPow((quantB - 9) / 9, 2.0) * maximumValue,
];
return rgb;
}
$.decode = function(blurhash,width,height,punch) {
punch = punch | 1;
if (blurhash.length < 6) {
console.error('too short blurhash');
return null;
}
var sizeFlag = decode83(blurhash[0]);
var numY = Math.floor(sizeFlag / 9) + 1;
var numX = (sizeFlag % 9) + 1;
var quantisedMaximumValue = decode83(blurhash[1]);
var maximumValue = (quantisedMaximumValue + 1) / 166;
if (blurhash.length !== 4 + 2 * numX * numY) {
console.error('blurhash length mismatch', blurhash.length, 4 + 2 * numX * numY);
return null;
}
var colors = new Array(numX * numY);
for (var i = 0; i < colors.length; i++) {
if (i === 0) {
var value = decode83(blurhash.substring(2, 6));
colors[i] = decodeDC(value);
}
else {
var value = decode83(blurhash.substring(4 + i * 2, 6 + i * 2));
colors[i] = decodeAC(value, maximumValue * punch);
}
}
var bytesPerRow = width * 4;
var pixels = new Uint8ClampedArray(bytesPerRow * height);
for (var y = 0; y < height; y++) {
for (var x = 0; x < width; x++) {
var r = 0;
var g = 0;
var b = 0;
for (var j = 0; j < numY; j++) {
for (var i = 0; i < numX; i++) {
var basis = Math.cos(Math.PI * x * i / width) * Math.cos(Math.PI * y * j / height);
var color = colors[i + j * numX];
r += color[0] * basis;
g += color[1] * basis;
b += color[2] * basis;
}
}
var intR = linearTosRGB(r);
var intG = linearTosRGB(g);
var intB = linearTosRGB(b);
pixels[4 * x + 0 + y * bytesPerRow] = intR;
pixels[4 * x + 1 + y * bytesPerRow] = intG;
pixels[4 * x + 2 + y * bytesPerRow] = intB;
pixels[4 * x + 3 + y * bytesPerRow] = 255;
}
}
return pixels;
}
})(jQuery);
function getBlurImage(hash) {
const pixels = $.decode(hash,32,32);
if(pixels) {
const canvas = document.createElement("canvas");
canvas.height = 32;
canvas.width = 32;
const ctx = canvas.getContext('2d');
const imagedata = new ImageData(pixels,32,32);
ctx.putImageData(imagedata,0,0);
return canvas.toDataURL();
}
else return false;
} 
