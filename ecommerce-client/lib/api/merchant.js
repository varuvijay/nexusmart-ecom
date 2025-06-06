import axiosInstance from "./axios.js";

export const addProducts = (data  ) => {     
    console.log(data);    
    return axiosInstance.post("/merchant/addProducts", data,{
        headers: {
            'Content-Type': 'multipart/form-data' 
        }
    });
}
export const editProducts = (data,id  ) => {     
    console.log((data));    
    return axiosInstance.put(`/merchant/editProducts/${id}`, data,{
        headers: {
            'Content-Type': 'multipart/form-data' 
        }
    });
}

export const getProducts = () => {
    return axiosInstance.get("/merchant/getProducts");
}
export const deleteProduct = (productId) => {
    console.log(productId);
  return axiosInstance.delete(`/merchant/deleteProduct/${productId}`);
};