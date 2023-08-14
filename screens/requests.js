import AsyncStorage from "@react-native-async-storage/async-storage";
/*
 Here is the function file , pre defining lots of commonly used functions so they can be imported externally and
 save a lot of code reuse

 The first function here locally verifys the string password to ensure that it meets the regEx constraints
*/
export const validatePassword = (password) => {
  const passReg = new RegExp(
    "^(?=.*[A-Z])(?=.*[1@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$"
  );
  if (!passReg.test(password)) {
    return false;
  } else {
    return true;
  }
};
/*
function that checks id the paramaters are present before the data is sent 
*/
export const areParametersPresent = (email, password) => {
  // checks if the values are empty beefore return a boolean value
  if (email.trim() == "" || password.trim() == "") {
    return false;
  } else {
    return true;
  }
};
/*
function that checks if the email is a valid one using a react function
returning a boolean value depending on the result 
*/
export const isEmailValid = (email) => {
  var validator = require("email-validator");
  if (!validator.validate(email)) {
    return false;
  } else {
    return true;
  }
};
/*
returning the domain of the api
*/
export const getDomain = () => {
  const domain = "http://localhost:8080/";
  return domain;
};
/*
function that proccesses all get requests , taking in the url setting the X-Authorization and Uid headers and 
then executing the request 
*/
export const getReq = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": await getAuthToken(),
      Uid: await getUid(),
    },
  });
  // the response is taken as json as set up in the api
  const json = await response.json();
  // the function then outputs a status object that contains the status code and the json object of the data
  return { status: response.status, json };
};
/* 
  the same as the get request but post instead . Meaning that a data variable is also taken as a input
  the headers are applied and then sent alongside the data

*/
export const postReq = async (url, data) => {
  const auth = await getAuthToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": auth,
      Uid: await getUid(),
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  return { status: response.status, json };
};
/* 
  delete request function taking the url and data
  applying the headers then returning the object
   
*/
export const deleteReq = async (url, data) => {
  const auth = await getAuthToken();
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": auth,
      Uid: await getUid(),
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  return { status: response.status, json };
};
/*
  Put request function takes the url , data applies the headers and returns the status and json
*/
export const putReq = async (url, data) => {
  const auth = await getAuthToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": auth,
      Uid: await getUid(),
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  return { status: response.status, json };
};
// function which uses AsyncStorage and returns the auth token 
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    return token;
  } catch (error) {
    return "";
  }
};
// function which uses AsyncStorage and returns the id token 
export const getUid = async () => {
  try {
    const token = await AsyncStorage.getItem("id");
    return token;
  } catch (error) {
    console.log(error);
  }
};
// function which uses AsyncStorage and returns the targetConversation  
export const getTargetUser = async () => {
  try {
    const token = await AsyncStorage.getItem("targetConversation");
    console.log("target convo:" + token);
    return token;
  } catch (error) {
    console.log(error);
  }
};
// function which uses AsyncStorage and returns the targetUserID  
export const getTargetChat = async () => {
  try {
    const token = await AsyncStorage.getItem("targetUserID");
    console.log("target user:" + token);
    //security feature?
    return token;
  } catch (error) {
    console.log(error);
  }
};
// function that sorts the numbers in a array
export function sortArray(array) {
  return array.sort(function (a, b) {
    return a - b;
  });
}
// function which uses AsyncStorage and returns the getTargetChatContacts 
export const getTargetChatContacts = async () => {
  try {
    const token = await AsyncStorage.getItem("getTargetChatContacts");
    return token;
  } catch (error) {
    console.log(error);
  }
};
