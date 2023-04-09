import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const areParametersPresent = (email, password) => {
  if (email.trim() == "" || password.trim() == "") {
    return false;
  } else {
    return true;
  }
};

export const isEmailValid = (email) => {
  var validator = require("email-validator");
  if (!validator.validate(email)) {
    return false;
  } else {
    return true;
  }
};

export const getDomain = () => {
  const domain = "http://localhost:8080/";
  return domain;
};

export const getReq = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": await getAuthToken(),
      Uid: await getUid(),
    },
  });
  const json = response.json();
  return { status: response.status, json };
};

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

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    return token;
  } catch (error) {
    return "";
  }
};

export const getUid = async () => {
  try {
    const token = await AsyncStorage.getItem("id");
    return token;
  } catch (error) {
    console.log(error);
  }
};
