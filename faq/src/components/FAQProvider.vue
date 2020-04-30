<template>
  <v-card>
    <v-tabs vertical>
      <!-- <v-tab v-for="content in faqContent" :key="content" :href="`#tab-${i}`"> -->
      <v-tab v-for="content in faqContent" :key="content.topicName">{{content.topicName}}</v-tab>
      <!-- <v-tab-item>
        <v-expansion-panels accordion v-for="topics in faqContent.questionAnswerSet" :key="topics">
          <v-expansion-panel>
            <v-expansion-panel-header>{{topic.question}}</v-expansion-panel-header>
            <v-expansion-panel-content>{{topic.answer}}</v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-tab-item>-->

      <v-tab-item v-for="faq in faqContent" :key="faq">
        <v-expansion-panels flat>
          <v-expansion-panel v-for="pair in faq.questionAnswerSet" :key="pair">
            <v-expansion-panel-header>{{pair.question}}</v-expansion-panel-header>
            <v-expansion-panel-content>{{pair.answer}}</v-expansion-panel-content>
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
export default {
  name: "faq-provider",
  data() {
    return {
      faqContent: [
        {
          topicName: "Application",
          questionAnswerSet: [
            {
              question: "Why is the user profile picture necessary?",
              answer: "It's for identification purposes by class providers."
            },
            {
              question: "What platforms is the app currently on?",
              answer: "It currently is only available in web browser format."
            }
          ]
        },
        {
          topicName: "Account",
          questionAnswerSet: [
            {
              question:
                "May I use the same credentials for both the user and partner portal?",
              answer:
                "Yes you may as they exist in seperate systems. However, it is not advised."
            },
            {
              question: "Will my credentials be secure? How is it so?",
              answer:
                "Yes it will. Our authentication system built upon accounts maintained by Google."
            }
          ]
        },
        {
          topicName: "General / Misc",
          questionAnswerSet: [
            {
              question: "What is a user?",
              answer:
                "It is defined as anyone that uses our application/service."
            },
            {
              question: "What is a partner?",
              answer:
                "It is defined as any business that provides our users with classes."
            },
            {
              question: "Why is my email in lowercase?",
              answer:
                "Emails are case insensitive, meaning lowercase and uppercase are treated equally. This also means that the displayed email address is always lower case even if you logged in with an uppercase email."
            },
            {
              question: "What is the SLA of the service?",
              answer:
                "None is guaranteed as of now. However, we do hope to bring it to you in the near future."
            }
          ]
        },
        {
          topicName: "Partner / Provider",
          questionAnswerSet: [
            {
              question: "How am I paid for providing my classes?",
              answer:
                "Upon completion of each class, you will receive a payment for each participant."
            },
            {
              question:
                "Could I add people other than myself as admins for the same business profile?",
              answer:
                "You can add up to 5 maximum. Do contact us if you need more."
            }
          ]
        },
        {
          topicName: "Billing",
          questionAnswerSet: [
            {
              question: "Will my card details be stored?",
              answer:
                "Yes, it will if you choose to opt for recurring payments."
            },
            {
              question: "How does recurring payments work at Class Express?",
              answer:
                "Every month end, your account will be credited based on your payment plan. Additional changes may occur based on the necessary exchange rates and/or transactional fees"
            },
            {
              question:
                "Which payment provider handles the billing for Class Express?",
              answer: "It is currently undecided."
            }
          ]
        }
      ]
    };
  }
};
</script>