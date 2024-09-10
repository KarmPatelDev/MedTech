import cryptoJs from "crypto-js";

const encrypt = (text) => {
    var data = cryptoJs.AES.encrypt(text.toString(), 'Encryptionanddecryption').toString();
    return data;
};

const decrypt = (text) => {
    var data = cryptoJs.AES.decrypt(text.toString(), 'Encryptionanddecryption');
    data = data.toString(cryptoJs.enc.Utf8);
    return data;
};

const convertArray = (arr) => {
    
    arr.forEach(function(item){
        item.height = decrypt(item.height);
        item.weight = decrypt(item.weight);
        item.lowBloodPressure = decrypt(item.lowBloodPressure);
        item.highBloodPressure = decrypt(item.highBloodPressure);
        item.pulse = decrypt(item.pulse);
        item.symptoms = decrypt(item.symptoms);
        item.advice = decrypt(item.advice);
    })

    return arr;
};

export { encrypt, decrypt, convertArray };