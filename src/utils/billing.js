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

  if (!userExistsRes.exists)
    return {
      customerDoesNotExists: true,
      paymentMethodNotAvailable: true,
    };

  const paymentMethodRes = await api.get(`/paymentMethod/available/${userID}`);

  return {
    customerDoesNotExists: false,
    paymentMethodNotAvailable: !paymentMethodRes.available,
  };
}

export { api, checkCustomerAndPaymentMethodStatus };
