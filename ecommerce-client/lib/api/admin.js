import axiosInstance from "./axios.js";

export const getProducts = ( ) => {     
    return axiosInstance.get('/admin/getProducts');
    
}
export const updateStatus = (productId,action ) => {     
    return axiosInstance.post(`/admin/products/${productId}/${action}`);
    
}



