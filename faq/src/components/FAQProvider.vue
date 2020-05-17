<template>
  <v-card>
    <v-tabs>
      <!--FAQ Category: Tabs-->
      <v-tab v-for="(topic, topicIndex) in faq" :key="topicIndex">{{topic.topicName}}</v-tab>
      <!--FAQ Category accessed to get nested question answer pairs-->
      <v-tab-item v-for="(topic, topicIndex) in faq" :key="topicIndex">
        <v-expansion-panels flat>
          <!-- FAQ Question Answer Pair: Expansion Panel -->
          <v-expansion-panel v-for="(pairs, pairIndex) in topic.questionAnswerSet" :key="pairIndex">
            <v-expansion-panel-header>{{pairs.question}}</v-expansion-panel-header>
            <v-expansion-panel-content>{{pairs.answer}}</v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
// @ is an alias to /src
import faq from "@/data/faq.json";

export default {
  name: "faq-provider",
  data() {
    return {
      //data is removed to a local json file to reduce clutter
      faq: faq
    };
  }
};
</script>