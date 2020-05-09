<template>
  <v-card>
    <v-tabs>
      <!--FAQ Category: Tabs-->
      <v-tab v-for="(item, idx) in faqContent" :key="idx">{{item.topicName}}</v-tab>
      <!--FAQ Category accessed to get nested question answer pairs-->
      <v-tab-item v-for="(item, idx) in faqContent" :key="idx">
        <v-expansion-panels flat>
          <!-- FAQ Question Answer Pair: Expansion Panel -->
          <v-expansion-panel v-for="(item2, idx2) in item.questionAnswerSet" :key="idx2">
            <v-expansion-panel-header>{{item2.question}}</v-expansion-panel-header>
            <v-expansion-panel-content>{{item2.answer}}</v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
// @ is an alias to /src
import faqData from "@/data/faq.json";

export default {
  name: "faq-provider",
  data() {
    return {
      //faqData is removed to a local json file to reduce clutter
      faqContent: faqData
    };
  }
};
</script>