import createStoreClass from "./create-store-class";

export default createStoreClass({
  defaultValue: {
    loggedIn: false,
    username: null,
    password: null,
    authToken: null,
    userManagementUrl: null
  },
  eventHandlers: {
    account: {
      loggedIn (current, {username, authToken, userManagementUrl, password}) {
        return current.merge({
          loggedIn: true,
          username,
          authToken,
          userManagementUrl,
          password
        })
      },
      loggedOut (current)  {
        return current.merge({
          loggedIn: false,
          username: null,
          authToken: null,
          userManagementUrl: null,
          password: null
        })
      }
    }
  }
});
