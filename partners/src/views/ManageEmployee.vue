<template>
  <v-content id="AllClasses">
    <masonry
      :cols="{ default: 5, 1000: 3, 700: 2, 400: 1 }"
      :gutter="{ default: '30px', 700: '20px' }"
    >
      <div v-for="employee in employees" :key="employee.id">
        <v-card class="mx-auto" max-width="344" outlined>
          <v-list-item two-line>
            <v-list-item-content>
              <div v-resize-text>{{ employee.name }}</div>
              <v-list-item-subtitle>{{ employee.email }}</v-list-item-subtitle>

              <v-list-item-subtitle>{{
                employee.position
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item-avatar size="80">
            <v-img :src="employee.picture" alt="Logo"
          /></v-list-item-avatar>
          <v-card-actions class="justify-center">
            <v-btn text>Delete</v-btn>
            <v-btn text>more info</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </masonry>
  </v-content>
</template>

<script>
import { mapState } from "vuex";
import ResizeText from "vue-resize-text";

export default {
  directives: {
    ResizeText,
  },
  computed: {
    employees() {
      return [
        {
          id: 0,
          name: "Kwon Jiyong",
          email: "gd@gmail.com",
          position: "COO",
          mobile: "12345678",
          birthdate: "18/08/1988",
          picture:
            "https://i1.sndcdn.com/artworks-000227430562-am04j1-t500x500.jpg",
        },
        {
          id: 1,
          name: "Kim Taehyung",
          email: "bts_v@gmail.com",
          position: "CMO",
          mobile: "12345678",
          birthdate: "30/12/1995",
          picture:
            "http://mimgnews1.naver.net/image/433/2018/06/21/0000046075_001_20180621082632801.jpg",
        },
        {
          id: 2,
          name: "Lee Taeyong",
          email: "nct@gmail.com",
          position: "CFO",
          mobile: "12345678",
          birthdate: "01/07/1995",
          picture: "https://kpopping.com/uploads/documents/A4_-01.jpeg",
        },
        {
          id: 3,
          name: "Seo Kangjoon",
          email: "skj@gmail.com",
          position: "CTO",
          mobile: "12345678",
          birthdate: "12/10/1993",
          picture:
            "https://6.vikiplatform.com/image/d499e35e12744fae82a10159a20259ef.jpg?x=b&a=0x0&s=780x436&q=h&e=t&f=t&cb=1",
        },
        {
          id: 4,
          name: "Lee Dongwook",
          email: "ldk@gmail.com",
          position: "CEO",
          mobile: "12345678",
          birthdate: "06/11/1981",
          picture:
            "https://0.soompi.io/wp-content/uploads/2018/10/18113028/lee-dong-wook-3.jpg",
        },
        {
          id: 5,
          name: "Ji Changwook",
          email: "jcw@gmail.com",
          position: "COO",
          mobile: "12345678",
          birthdate: "05/07/1987",
          picture:
            "https://0.soompi.io/wp-content/uploads/2019/09/24200304/Ji-Chang-Wook-22.jpg",
        },
        {
          id: 6,
          name: "Cha Eunwoo",
          email: "cew@gmail.com",
          position: "CEO",
          mobile: "12345678",
          birthdate: "30/03/1997",
          picture:
            "https://i.pinimg.com/originals/31/3c/68/313c68f4d29d19b051a1519fca368f65.jpg",
        },
      ];
    },
  },
};
</script>

<style scoped>
#AllClasses {
  margin: 2em;
  margin-top: 2em;
}

.class-card {
  display: inline-block;
  margin-right: 2em;
  margin-bottom: 2em;
}

.class-image {
  max-width: 17em;
}
</style>
