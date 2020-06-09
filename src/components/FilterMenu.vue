<template>
  <v-container id="dropdown-example">
    <v-row>
      <v-col>
        <DropDown />
      </v-col>

      <v-col>
        <PopoverMenu />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PopoverMenu from "./PopoverMenu.vue";
import DropDown from "./DropDown.vue";
export default {
  components: {
    PopoverMenu,
    DropDown,
  },
  data: () => ({
    items: ["foo", "bar", "fizz", "buzz", "fizzbuzz", "foobar"],
    value: ["foo", "bar", "fizz"],
  }),
};
</script>
