The Account service allows you to authenticate and manage a user account. You can use the account service to update user information, retrieve the user sessions across different devices, and fetch the user security logs with his or her recent activity.

You can authenticate the user account by using multiple sign-in methods available. Once the user is authenticated, a new session object will be created to allow the user to access his or her private data and settings.

This service also exposes an endpoint to save and read the [user preferences](/docs/client/account#updatePrefs) as a key-value object. This feature is handy if you want to allow extra customization in your app. Common usage for this feature may include saving the user preferred locale, timezone, or custom app theme.