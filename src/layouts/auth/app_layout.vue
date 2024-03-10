<script setup>
import {ref} from "vue";
import { displayMessage } from "@/utils";

</script>
<template>
  <v-app>
    <v-layout>
      <v-main>
        <p>Top of admin page</p>
        <router-view />
        <p>Bottom of admin page</p>
        <!-- display success and error msg -->
        <v-snackbar v-model="displayMessage.snackbar"  v-if="displayMessage.message"  :timeout="2000" rounded="pill" :color="displayMessage.color"
        location="end bottom" 
          min-width="auto"
          min-height="auto"

        >
           <p class="text-center px-3">{{ displayMessage.message }}</p> 
        </v-snackbar>
      </v-main>
    </v-layout>
  </v-app>
</template>
