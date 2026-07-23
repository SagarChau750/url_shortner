const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encode(num){
    let short = "";

    while(num > 0){
        short = chars[num % 62] + short;
        num = Math.floor(num/62);
    }
    return short || "0";
}

function decode(str){
    let num = 0;
    for(let c of str){
        num = num*62 + chars.indexOf(c);
    }
    return num;
}

module.exports = {
    encode, decode,
};