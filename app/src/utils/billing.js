import firebase from "firebase/app";
import "firebase/auth";
import fetch from "fetch-with-fire";
import { billingApiEndpoint } from "@/config";
import { createApiWithLoader } from "@/store/utils/apiWithLoader";
const apiWithLoader = createApiWithLoader(
  new fetch(firebase.auth, billingApiEndpoint)
);

/**
 * Checks if this userID maps to an existing customerID with billing service and if they have a valid payment method
 * @param {*} userID
 * @returns {boolean}
 */
async function checkCustomerAndPaymentMethodStatus(userID) {
  const userExistsRes = await apiWithLoader.get(`/user/exists/${userID}`);

  if (!userExistsRes.exists)
    return {
      customerDoesNotExists: true,
      paymentMethodNotAvailable: true,
    };

  const paymentMethodRes = await apiWithLoader.get(
    `/paymentMethod/available/${userID}`
  );

  return {
    customerDoesNotExists: false,
    paymentMethodNotAvailable: !paymentMethodRes.available,
  };
}

export { apiWithLoader, checkCustomerAndPaymentMethodStatus };
