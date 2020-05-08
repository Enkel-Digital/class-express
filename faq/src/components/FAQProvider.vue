<template>
  <v-card>
    <!-- <v-tabs vertical> -->
    <v-tabs>
      <!-- <v-tab v-for="content in faqContent" :key="content" :href="`#tab-${i}`"> -->
      <v-tab v-for="(item, idx) in faqContent" :key="idx">{{item.topicName}}</v-tab>
      <!-- <v-tab-item>
        <v-expansion-panels accordion v-for="topics in faqContent.questionAnswerSet" :key="topics">
          <v-expansion-panel>
            <v-expansion-panel-header>{{topic.question}}</v-expansion-panel-header>
            <v-expansion-panel-content>{{topic.answer}}</v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-tab-item>-->

      <v-tab-item v-for="(item, idx) in faqContent" :key="idx">
        <v-expansion-panels flat>
          <v-expansion-panel v-for="(item2, idx2) in item.questionAnswerSet" :key="idx2">
            <v-expansion-panel-header>{{item2.question}}</v-expansion-panel-header>
            <v-expansion-panel-content>{{item2.answer}}</v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-tab-item>

      <!-- <v-tab-item>
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>{{"Insert Item Question Here"}}</v-expansion-panel-header>
            <v-expansion-panel-content>{{"Insert Item Answer Here"}}</v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-tab-item>-->
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
      faqContent: faqData
    };
  }
};
</script>