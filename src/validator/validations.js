const mongoose = require("mongoose");
const regxName = function (val) {
    let regx = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/;
    return regx.test(val);
}

const validateNumber = function validateNumber(value) {
  if (typeof value == "number") {
    return true;
  }
  return false;
};

const validateString = function (name) {
  if (typeof name == undefined || typeof name == null) return false;
  if (typeof name == "string" && name.trim().length == 0) return false;

  return true;
};

const checkValue = function (value) {
  let arrValue = [];
  value.map((x) => {
    x = x.trim();
    if (x.length) arrValue.push(x);
  });
  return arrValue.length ? arrValue : false;
};

const convertToArray = function (value) {
  if (typeof value == "string") {
    value = value.trim();
    if (value) {
      return [value];
    }
  } else if (value?.length > 0) {
    return checkValue(value);
  }
  return false;
};

const validateEmail = function (value) {
  let re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  let validEmail = re.test(value);

  if (!validEmail) {
    return false;
  }

  return true;
};

const validatePassword = function (value) {
  let re = /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,}$/;
  let validPassword = re.test(value);

  if (!validPassword) {
    return false;
  }

  return true;
};

const validateRequest = function (value) {
  return Object.keys(value).length == 0
};
let validateObjectId = function (ObjectId) {
  return mongoose.isValidObjectId(ObjectId)
}
const passwordLength = function (password) {
  if (password.length >= 8 && password.length <= 15) {
    return true;
  } else return false;
};


const regexNumber = function(val){
    let regx = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
    return regx.test(val);
}
const isValidPincode =function(val){
    return   typeof val=="number"  && val.toString().length==6 
}


module.exports = {
  validateString,
  convertToArray,
  checkValue,
  validateEmail,
  validatePassword,
  validateRequest,
  validateNumber,
  validateObjectId,
  passwordLength,
  regexNumber,
  regxName,
  isValidPincode

  
};