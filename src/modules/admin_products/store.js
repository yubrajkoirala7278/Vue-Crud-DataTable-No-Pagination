import {defineStore} from 'pinia';
import {ref} from "vue";
import {fetchProductsApi,deleteProductApi,addProductApi} from './service';

export const useProducts=defineStore('products',()=>{
    // ===========reactive state====================
    const products=ref([]);
    const isLoading=ref(false);
    const error=ref(null);
    // ============================================

    // ============FETCH(GET) Product with filter==========
    const fetchProducts=async(productFilter)=>{
        try{
            isLoading.value=true;
            const apiData=await fetchProductsApi(productFilter);
            products.value = apiData.data.map((item, index) => {
                return { sno: index + 1 ,...item};
            });
        }catch(err){
            error.value=err;
        }finally{
            isLoading.value=false;
        }
    }
    // ====================================================

    // ===============DELETE==============================
    const deleteProduct=async(id)=>{
        try{
            await deleteProductApi(id);
        }catch(error){
            console.log(error);
        }
    }
    // ===================================================


    // =========POST(ADD PRODUCT)========================
    const addProduct=async(data)=>{
        try{
            const response=await addProductApi(data);
        }catch(error){
            console.log(error);
        }
    }
    // ==================================================

    // ==========return all the method and values=========
    return{
        isLoading,
        error,
        fetchProducts,
        products,
        deleteProduct,
        addProduct
    }
    // ===================================================
});