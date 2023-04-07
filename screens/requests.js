
export const validatePassword = (password)=> {
    const passReg = new RegExp("^(?=.*[A-Z])(?=.*[1@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$");
    if (!passReg.test(password)){
        return false
  }
  else {
    return true
  }
  }

export const areParametersPresent = (email, password) => {
    if (email.trim() == "" || password.trim() == ""){
        return false;
    }else{
    return true;
    }
 }
  
export const isEmailValid = (email) => {
     var validator = require ("email-validator");
     if (!validator.validate(email)){
        return false;
    }else {
        return true;
    }
}


export const getDomain = () => {
    const domain = "http://localhost:8080/"
    return domain;
}

export const getReq = async (url) => {
    const response = await fetch(url);
    const json = response.json();
    return {status : response.status , json};
}

export const postReq = async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    });
    const json = await response.text();
    return { status: response.status, json };
  };
  
  