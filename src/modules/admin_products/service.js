import axios from "axios";
import { displaySuccessMessage,displayErrorMessage } from "@/utils";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_HOST
});

// ========FETCH(GET) Product with filter==============
export const fetchProductsApi=async(productFilter={})=>{
    try{
        const response=await api.get('products',{
            params:productFilter
        });
        return response;
    }catch(error){
        displayErrorMessage('Something went wrong');
        console.log(error);
    }
}
// ===================================================

// ===============DELETE==========================
export const deleteProductApi=async(id)=>{
    try{
        const response=await api.delete(`products/${id}`);
        displaySuccessMessage('Product deleted successfully');
    }catch(error){
        displayErrorMessage('Something went wrong');
        console.log(error);
    }
}
// ===============================================

// =========POST(ADD PRODUCT)====================
// 'Content-Type':'application/json'
// 'Content-Type':'multipart/form-data',
export const addProductApi=async(data)=>{
    try{
        const response=await api.post('products',data,{
            headers:{
                'Content-Type':'application/json'
            },
        });
        displaySuccessMessage('Product added successfully');
        return response;
    }catch(error){
        displayErrorMessage('Something went wrong');
        console.log(error);
    }
}
// ==============================================

// ===============Fetch single Product===========
export const fetchSingleProductsApi=async(id)=>{
    try{
        const response=await api.get(`products/${id}`);
        return response;
    }catch(error){
        displayErrorMessage('Something went wrong');
        console.log(error);
    }
}
// ==============================================