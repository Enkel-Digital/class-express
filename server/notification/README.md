# Notification Service
This service takes care of all notifications to the user.
Can use either email via sendgrid or via teletif

Allow scheduling of notifications, either using teletif or using some custom method with sendgrid?

Types of notifications:
- Billing
    - When monthly payment is charged to the user's card
- Class booked (optional)
- Class cancelled (optional)
- Class cancelled by partner
- Service Maintenance, like service down for migration or smth
    - service disruptions and stuff like that
    - when we wanna do data migration?
- Password reset
- promos