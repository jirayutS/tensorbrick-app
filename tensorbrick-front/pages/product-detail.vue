<template>
  <div>
    <div class="row">
      <div class="col">
        <h2>
          <v-icon
            large
            color="blue darken-2"
            style="cursor: pointer"
            @click="navigateToPage()"
            >mdi-keyboard-backspace </v-icon
          >Producing
        </h2>
        <p>Choose material to produce</p>
      </div>
      <div class="col d-flex justify-end align-center" style="text-align: end">
        <v-btn
          class="text-none outlined-button"
          color="blue"
          outlined
          @click="updateStatus(product.name)"
        >
          Confirm
        </v-btn>
      </div>
    </div>

    <div>
      <v-card style="padding: 10px">
        <v-row>
          <v-col cols="6"><h4 style="color: #4495ad">Total</h4></v-col>
          <v-col cols="3"
            ><h4 style="color: #4495ad">
              <v-chip class="ma-2" color="primary" outlined>
                Related Work
              </v-chip>
            </h4></v-col
          >
          <v-col cols="3"
            ><h4 style="color: #4495ad">Remain to produce: 0(box)</h4></v-col
          >
        </v-row>
      </v-card>
      <v-card style="padding: 30px; margin-top: 20px; min-height: 300px">
        <v-row>
          <v-col cols="6"
            ><table class="box mx-auto">
              <tr>
                <th></th>
                <th></th>
              </tr>
              <tr>
                <td colspan="2" style="background-color: #d3d3d3"></td>
              </tr></table
          ></v-col>
          <v-col cols="6">
            <v-card style="padding: 30px; margin-top: 20px; min-height: 300px">
              <div class="title-container">
                <span class="title">Mfg. Lot.No : </span>
                <span class="value">{{ productId }}</span>
              </div>
              <div class="title-container">
                <span class="title">Raw material : </span>
              </div>
              <div class="title-container">
                <v-text-field
                  class="input-box"
                  disabled
                  v-model="product.product_name"
                  outlined
                  dense
                ></v-text-field>
              </div>
              <div class="title-container">
                <span class="title"
                  >Cutting Layout <span style="color: red">*</span>
                </span>
              </div>
              <div class="title-container">
                <v-text-field
                  class="input-box"
                  disabled
                  v-model="product.layout"
                  outlined
                  dense
                ></v-text-field>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "detailPage",
  data() {
    return {
      productId: null,
      product_name: "Initial Value",
      layout: "dw",
      product: {},
    };
  },
  mounted() {
    // Accessing the ID parameter
    if (this.$route.params.name && this.$route.params.name != "") {
      this.productId = this.$route.params.name;
      this.fetchData(this.productId);
    }

    // Do something with the dessertId...
  },
  methods: {
    navigateToPage() {
      this.$router.push({
        name: "index",
      });
    },
    async fetchData(name) {
      try {
        const response = await this.$axios.get(`/data/${name}`); // Assuming 'posts' is your API endpoint
        this.product = response.data;
      } catch (error) {
        console.error(error);
        // Handle errors appropriately
      }
    },
    async updateStatus(name) {
      try {
        const status = 1; // Define the status value
        const response = await this.$axios.put(
          `/data/${name}?status=${status}`
        );
        // Handle the response data
        if (response.status == 200) {
          this.navigateToPage();
        }
      } catch (error) {
        // Handle errors
        console.error(error);
      }
    },
  },
};
</script>
<style scoped>
.box {
  border: 1px solid black !important;
  border-collapse: collapse;
}
.box th {
  background-color: #808080;
  border: 1px solid #000;
  width: 200px;
  height: 200px;
}
.box td,
.box th {
  border: 1px solid #000;
  width: 200px;
  height: 200px;
}
.input-box {
  height: 50px !important;
}
.title {
  font-weight: 500px;
}
</style>
<!-- Start Styles. Move the 'style' tags and everything between them to between the 'head' tags -->
