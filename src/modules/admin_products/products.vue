<script setup>
import { onMounted, computed, reactive, ref } from "vue";
import { useProducts } from "./store";
import { headers, getProductStatusClass } from "./util.js";
import { storeToRefs } from "pinia";

// ========fetch products=========
const productStore = useProducts();
const filter = reactive({
  sortBy: [],
});
onMounted(() => {
  productStore.fetchProducts(filter);
});
const products = computed(() => productStore.products);
// ========================================

// ======Delete Product====================
function deleteProducts(id) {
  productStore.deleteProduct(id);
}
// ========================================

// =======Add Product======================
const product = reactive({
  title: null,
  price: null,
  description: null,
  image: null,
  category: null,
});
// rules
const rules = {
  required: (v) => !!v || "Required",
  price: (v) => (!!v && v > 10) || "Amount must be greater than 10",
};
// submit form
const productForm = ref(null);
const dialog = ref(false);
const { valid } = storeToRefs(productForm);
function submit() {
  productForm.value.validate().then(async ({ valid }) => {
    if (valid) {
      await productStore.addProduct(product);
      dialog.value = false;
      // append in frontend
      products.value.unshift({sno:0,...product});
      // reset form
      productForm.value?.reset();
    }
  });
}
// ========================================

// ====Select Item for Category============
const productCategory = [
  "electronics",
  "men's clothing",
  "jewelery",
  "women's clothing",
];
// =======================================
</script>
<template>
  <!-- ==========Add Product=================== -->
  <div class="text-start pa-4">
    <v-btn @click="dialog = true" color="green" class="text-capitalize">
      Add Product
    </v-btn>

    <v-dialog v-model="dialog" width="auto" persistent scrollable>
      <v-card max-width="700" min-width="700" title="Add Product">
        <!-- form -->
        <v-form :valid="valid" @submit.prevent="submit" ref="productForm">
          <v-container>
            <v-row>
              <!-- title -->
              <v-col cols="12">
                <v-text-field
                  v-model="product.title"
                  :rules="[rules.required]"
                  label="Product Title"
                ></v-text-field>
              </v-col>
              <!-- price -->
              <v-col cols="12">
                <v-text-field
                  v-model="product.price"
                  :rules="[rules.price]"
                  label="Product Price"
                ></v-text-field>
              </v-col>
              <!-- Description -->
              <v-col cols="12">
                <v-textarea
                  v-model="product.description"
                  :rules="[rules.required]"
                  label="Product Description"
                ></v-textarea>
              </v-col>
              <!-- Image -->
              <!-- <v-col cols="12">
                <v-file-input
                  label="Product Image"
                  accept="image/png, image/jpeg, image/svg"
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera"
                  :rules="[rules.required]"
                  v-model="product.image"
                  show-size
                  counter
                  chips
                ></v-file-input>
              </v-col> -->
              <v-col cols="12">
                <v-text-field
                  v-model="product.image"
                  :rules="[rules.required]"
                  label="Product Image"
                ></v-text-field>
              </v-col>
              <!-- category -->
              <v-col cols="12">
                <v-select
                  label="Category"
                  :items="productCategory"
                  v-model="product.category"
                  :rules="[rules.required]"
                  chips
                ></v-select>
              </v-col>
            </v-row>
          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="Cancel"
              @click="
                dialog = false;
                productForm.reset();
              "
              class="text-capitalize"
              variant="tonal"
            ></v-btn>
            <v-btn
              type="submit"
              text="Submit"
              color="green"
              variant="flat"
              class="text-capitalize"
            ></v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
  <!-- ========================================= -->
  <!-- ==========Display data with dataTable======== -->
  <v-data-table-virtual
    v-if="products.length"
    :loading="productStore.isLoading"
    :headers="headers"
    :items="products"
    :sort-by="filter.sortBy"
    fixed-header
    fixed-footer
    :hover="true"
    :height="products.length > 10 ? '100vh' : '100vh'"
  >
    <!-- display category with unique colors -->
    <template v-slot:[`item.category`]="{ item }">
      <v-alert :color="getProductStatusClass(item.category)" height="15">
        {{ item.category }}
      </v-alert>
    </template>

    <!-- display actions -->
    <template v-slot:[`item.action`]="{ item }">
      <div class="d-flex justify-space-evenly">
        <v-btn
          icon="mdi:mdi-pencil"
          variant="text"
          density="compact"
          color="warning"
        ></v-btn>
        <v-btn
          icon="mdi:mdi-trash-can-outline"
          variant="text"
          density="compact"
          color="red"
          @click="deleteProducts(item.id)"
        ></v-btn>
        <router-link :to="{ name: 'product-details', params: { id: item.id }}">
          <v-btn
            icon="mdi:mdi-eye"
            variant="text"
            density="compact"
            color="green"
          ></v-btn>
      </router-link>
      </div>
    </template>
  </v-data-table-virtual>
  <!-- ============================================== -->
</template>
