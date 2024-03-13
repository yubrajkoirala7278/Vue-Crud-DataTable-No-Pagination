<script setup>
import { onMounted, computed, reactive, ref,watch } from "vue";
import { useProducts } from "./store";
import { headers, getProductStatusClass } from "./util.js";
import { storeToRefs } from "pinia";

// ========fetch products=========
const productStore = useProducts();
const filter = reactive({
  sortBy: [],
  sort: null,
});
onMounted(() => {
  productStore.fetchProducts(filter);
});
const products = computed(() => productStore.products);
// ========================================

// ======Delete Product====================
async function deleteProducts(id) {
  var result = confirm("Want to delete?");
  if (result) {
    await productStore.deleteProduct(id);
    productStore.products = productStore.products.filter((currProduct) => {
      return currProduct.id != id;
    });
  }
}
// ========================================

// =======Add Product======================
const product = reactive({
  id: null,
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
// submit form if validated
const productForm = ref(null);
const dialog = ref(false);
const btnName = ref("");
const { valid } = storeToRefs(productForm);
function submit() {
  productForm.value.validate().then(async ({ valid }) => {
    if (valid) {
      if (btnName.value == "Submit") {
        await productStore.addProduct(product);
        // append in frontend
        products.value.unshift({ sno: 0, ...product });
      } else {
        await productStore.updateProduct(product);
        // update in frontend
        productStore.products = productStore.products.map((currProduct) => {
          if (currProduct.id === product.id) {
            return product; // Replace the object with updatedObject
          }
          return currProduct; // Keep the original object if it doesn't match the ID
        });
      }
      // close dialog
      dialog.value = false;
      // reset form
      // productForm.value?.reset();
    }
  });
}
// reset form
const resetForm = () => {
  Object.assign(product, {
    id: null,
    title: null,
    price: null,
    description: null,
    image: null,
    category: null,
  });
};

// ========================================

// ====Select Item for Category============
const productCategory = [
  "electronics",
  "men's clothing",
  "jewelery",
  "women's clothing",
];
// =======================================

//============Display current row value in form for updation=========
function updateForm(item) {
  Object.assign(product, {
    id: item.id,
    title: item.title,
    price: item.price,
    description: item.description,
    image: item.image,
    category: item.category,
  });
}
// ====================================

// ========search===================
// instant search with select
// watch(filter,()=>{
//   productStore.fetchProducts(filter);
// });
// search from free text after 2 second
let timeoutId = null;
function searchProduct() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => productStore.fetchProducts(filter), 2000);
}
// ========================================
</script>
<template>
  <!-- ==========Add Product=================== -->
  <div class="text-start pa-4">
    <v-btn
      @click="
        resetForm();
        dialog = true;
        btnName = 'Submit';
      "
      color="green"
      class="text-capitalize"
    >
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
              :text="btnName"
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

  <!-- ========Search Product====================== -->
  <!-- with select input field -->
  <!-- <v-select
    label="Select"
    :items="[
      'asce',
      'desc',
    ]"
    v-model="filter.sort"
    class="w-50" 
  ></v-select> -->
  <!-- with free text field -->
  <v-text-field label="Select" variant="outlined"  v-model="filter.sort"
    class="w-50"  @keyup="searchProduct"></v-text-field>
  <!-- ============================================ -->
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
          @click="
            updateForm(item);
            dialog = true;
            btnName = 'Update';
          "
        ></v-btn>
        <v-btn
          icon="mdi:mdi-trash-can-outline"
          variant="text"
          density="compact"
          color="red"
          @click="deleteProducts(item.id)"
        ></v-btn>
        <router-link :to="{ name: 'product-details', params: { id: item.id } }">
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
