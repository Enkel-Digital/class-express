# Vuex store
Using vuex for state management. Where the store is the single source of truth for data with complimentary business logics implemented in the respective mutations and actions.  

## Patterns used
- Use flat storage as much as possible
    - For example, instead of storing all the class details in store, just store the class id
    - Then when I view that class, use the id to get more details from the API