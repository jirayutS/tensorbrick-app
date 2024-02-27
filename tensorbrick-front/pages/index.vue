<template>
  <div>
    <h2>Product Grouping</h2>
    <div class="table-container">
      <table class="table-main">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header.value"
              style="text-align: start; padding: 10px; width: 200px"
            >
              {{ header.text }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(dessert, index) in product">
            <tr :key="index" @click="toggleNestedTable(index)">
              <td :colspan="headers.length">
                <div class="group-header">
                  {{ index + 1 }}. {{ dessert.size }}
                </div>
                <table
                  class="nested-table"
                  v-show="isNestedTableVisible(index)"
                >
                  <tbody>
                    <tr
                      v-for="item in dessert.list"
                      :key="item.name"
                      @click="navigateToPage(item)"
                      class="table-row"
                    >
                      <td
                        v-for="header in headers"
                        :key="header.value"
                        style="width: 200px"
                        class="table-cell"
                      >
                        <template v-if="header.text === 'STATUS'">
                          <v-icon
                            large
                            color="green darken-2"
                            v-if="item[header.value] === 1"
                          >
                            mdi-check-circle-outline
                          </v-icon>
                        </template>
                        <template v-else-if="header.value === 'created_at'">
                          {{ formatDateTime(item[header.value]) }}
                        </template>
                        <template v-else>
                          {{ item[header.value] }}
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "IndexPage",
  data() {
    return {
      visibleNestedTables: [],
      selectedSize: null,
      headers: [
        {
          text: "LOT NO.",
          align: "start",
          sortable: false,
          value: "name",
          width: "300px !important",
        },
        { text: "TYPE", value: "type", width: "200px !important" },
        {
          text: "PRODUCT NAME",
          value: "product_name",
          width: "600px !important",
        },
        { text: "CREATED AT", value: "created_at", width: "300px !important" },
        { text: "AMOUNT", value: "amount", width: "200px !important" },
        { text: "STATUS", value: "status" },
      ],
      product: [],
    };
  },
  computed: {
    selectedList() {
      const selectedItem = this.product.find(
        (item) => item.size === this.selectedSize
      );
      return selectedItem ? selectedItem.list : [];
    },
  },
  async created() {
    await this.fetchData();
    // Set selectedSize to the size of the first item if product is not empty
    if (this.product.length > 0) {
      this.selectedSize = this.product[0].size;
      this.product.forEach((_, index) => {
        this.$set(this.visibleNestedTables, index, true);
      });
    }
  },
  methods: {
    formatDateTime(isoString) {
      const date = new Date(isoString);

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();

      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}/${month}/${year + 543} ${hours}:${minutes}`;
    },
    navigateToPage(item) {
      console.log("item", item);
      this.$router.push({
        name: "product-detail",
        params: { name: item.name },
      });
    },
    toggleNestedTable(index) {
      this.$set(
        this.visibleNestedTables,
        index,
        !this.isNestedTableVisible(index)
      );
    },
    isNestedTableVisible(index) {
      return this.visibleNestedTables[index] || false;
    },
    async fetchData() {
      try {
        const response = await this.$axios.get("/data"); // Assuming 'posts' is your API endpoint
        this.product = response.data;
      } catch (error) {
        console.error(error);
        // Handle errors appropriately
      }
    },
    toggleList(item) {
      this.selectedSize = this.selectedSize === item.size ? null : item.size;
    },
  },
};
</script>

<style scoped>
/* Add your scoped styles here */
.table-cell {
  text-align: start;
  padding: 10px;
  white-space: nowrap; /* Prevent wrapping */
}

.group-header {
  background-color: #2596be;
  padding: 10px;
  border-radius: 10px;
  color: white;
}

.nested-table {
  width: 100%;
  background-color: #ffffff;
  border: none;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 10px !important;
}

.table-row {
  cursor: pointer;
}
.table-container {
  overflow-x: auto;
  padding: 10px;
}
.table-main {
  width: 100%;
  border-collapse: collapse;
}
th,
.table-row {
  cursor: pointer;
}
</style>
