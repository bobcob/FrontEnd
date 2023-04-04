export const getReq = async (url) => {
    const response = await fetch(url);
    const json = response.json();
    return json;
}

export const postReq = (data , url) => {
    const reqData = fetch(url, {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data),
    });
    const json = response.json();
    return json;
}