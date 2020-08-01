import firebase from "firebase/app";
import "firebase/auth";
import fetch from "fetch-with-fire";
import { billingApiEndpoint } from "@/config";
const api = new fetch(firebase.auth, billingApiEndpoint);

import apiError from "@/store/utils/apiError";

/**
 * Checks if this userID maps to an existing customerID with billing service and if they have a valid payment method
 * @param {*} userID
 * @returns {boolean}
 */
async function checkCustomerAndPaymentMethodStatus(userID) {
  const userExistsRes = await api.get(`/user/exists/${userID}`);

  if (!userExistsRes.success)
    return {
      customerExists: false,
      paymentMethodAvailable: false,
    };

  const paymentMethodRes = await api.get(`/paymentMethod/available/${userID}`);

  return {
    customerExists: true,
    paymentMethodAvailable: paymentMethodRes.available,
  };
}

/**
 * Creates a new customer with billing service
 * @returns Response object of an API call
 */
async function createBillingCustomer(userAccountID, userDetails) {
  return api.post("/user/create", {
    userAccountID,
    userDetails,
  });
}

// async function createCustomerAndPaymentMethodIfNotAvailable(userAccountID) {
//   // Check with billing service if user is a registered customer and if they have a valid payment method
//   const {
//     customerExists,
//     paymentMethodAvailable,
//   } = await checkCustomerAndPaymentMethodStatus(userAccountID);

//   // Call billing API to create a customer if does not exists yet
//   if (!customerExists) {
//     const customerCreation = await createBillingCustomer(userAccountID);
//     if (!customerCreation.success) return false;
//   }

//   // If no payment method, redirect to create payment method view to create a new payment method
//   if (!paymentMethodAvailable) {
//     //
//   }
// }

export { checkCustomerAndPaymentMethodStatus, createBillingCustomer };
