<script setup>
import { useRoute } from "vue-router";
import { reactive, onMounted, computed } from "vue";
import { useProducts } from "../store";

// ====get id from url======
const route = useRoute();
const id = route.params.id;
// =========================

// ========fetch products=========
const productStore = useProducts();
const filter = reactive({
  productId: id,
});
onMounted(() => {
  productStore.fetchSingleProduct(filter.productId);
});
const product = computed(() => productStore.singleProduct);
// ========================================
</script>
<template>
  <h1>Title: {{ product.title }}</h1>
  <p>Price: {{ product.price }}</p>
  <p>Description: {{ product.description }}</p>
  <p>Category: {{ product.category }}</p>
  <v-img :width="300" aspect-ratio="16/9" cover :src="product.image"></v-img>
</template>
