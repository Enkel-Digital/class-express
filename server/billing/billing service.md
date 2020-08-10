# Billing Service notes

- Key idea is for user to register with Billing Service first to create a customer and paymentMethod entry with Stripe service so from here on, whenever user purchases anything or updates their subscription plan, it will automatically get charged instead of doing the payment process everytime.
- on frontend payment view, MAKE IT CLEAR that the user is not charged until they select a plan or topup.

## Testing the service
- When using stripe dashboard to look at test data, make sure "view test data" toggle switch is enabled in order to see testing data
- When testing cards, always prefer to test with the card type with the most requirements like 3DS or 2FA stuff
    - 4000002500003155  (3DS required)
    - more test reference: https://stripe.com/docs/testing#cards-responses
    

## Use case flow for frontend Subscription plan update and Points topups
If first time user, steps 1 - 4
If second time user, step 4 only.

1. On any payment related action triggered (new/change sub plan or topup points), check if customer object and payment method exists using billing API
    - AS LONG AS user does not have a stripe customer object or no stripe paymentMethod
    - return false and continue with creation process.
2. redirect user to payment.vue to create a new paymentMethod
    - frontend calls stripe or billing service to create customer object
    - frontned calls stripe or billing service to create setupIntent after creating customer object
    - frontned calls stripe to create paymentMethod with (type / card / billing_details..)
    - frontend sends payment method to billing service to store.
    - once all is complete, redirect user back to where they came from.
3. redirect user back to subscription plan vue or whereever they came from after paymentMethod is created
4. user selects new subscription plan again,
    - this time since user already have stripe details,
    - call core API directly,
    - then core API update plan directly and update billing service on how to change user's billing invoice
        - call BS with (user or customer ID / planID)
            - BS takes customer object and customer paymentMethod from BS DB
            - BS takes priceID using planID from DB
    - core API responds with success indicator


## Billing Service API for Core serivce / App users
Legend:
- userID: user ID in core database, NOT the stripe customer object ID

- GET /user/exists/:userID --> Boolean
    - Checks if customer object exists for this userID
    - Can be called by both frontend and backend.
- GET /user/paymentMethod/available/:userID --> Boolean
    - Checks if customer have a payment method object and check if it is valid
    - Can be called by both frontend and backend.s
- POST /user/create/customer --> Boolean
    - Create a new stripe customer object for user and save the customer id into database
    - Called by frontend directly
    - req.body
        - userAccountID
        - userDetails
            - email
            - name
            - phone
            - address
            - ... as needed
- POST /user/create/paymentMethod --> Boolean
    - Create a new paymentMethod for a customer
    - Called by frontend directly
    - req.body
        - userAccountID
        - type
        - card    
            - number: '4242424242424242',
            - exp_month: 7,
            - exp_year: 2021,
            - cvc: '314',
        - billing_details... can be expanded (meta data)
- GET /card-wallet/:userAccountID --> Boolean
    - get client secret when creating setupIntent
    - Called by frontend directly after creating the stripe Customer
    - https://stripe.com/docs/payments/setup-intents
    - https://stripe.com/docs/payments/save-and-reuse
- POST /plans/update --> Boolean
    - Called only by CORE API
    - Update the user's plans
        - set a cancel_at time stamp for the existing plan
        - create a new plan at the end of the existing plan
        - *need to handle user changing back to the same plan after changing it once in the same period
            - use List Subscription stripe API to see all of user's current subscription.


        - if the user is new registered customer
            - create new subscription
        - if user change the subscription plan 
            - get the current active subscription plan
                - set cancel_at_period_end: true
            - create a subscription with schedule
                - set end_behavior with relase
                - set start date at the end of the existing plan
    - req.body
        - userID
        - planID --> planID is used to retrieve priceID from database
- POST /stripe-webhook
    - Webhook handler for asynchronous events
        - invoice.paid
        - invoice.payment_failed
        - customer.subscription.deleted
        - customer.subscription.trial_will_end
        - more: https://stripe.com/docs/api/events/types
- todo:
    - Update payment method if user wishes to change, or if the previous payment method becomes invalid.
    - points topup APIs.


## Billing Service API for partner serivce
Legend:
- partnerID: partner ID in core database, NOT the stripe payout ID


## Billing Service DB schema
- key: userAccount.id
    - value: stripe customer ID
    - value: stripe paymentMethod ID
- key: priceID or planID
    - value: planID or priceID
    - This basically acts as a key value map to convert priceID to planID and vice versa.
    - Can use something else other than firestore.
    - Else if using firestore, instead of reading on every use, read all at once on start up and cache the values in memory.


## Retrievable values with ID
- stripe customer object using customer ID
- stripe customer payment method object using paymentMethod ID
- stripe subscription object using subscription ID using customer ID