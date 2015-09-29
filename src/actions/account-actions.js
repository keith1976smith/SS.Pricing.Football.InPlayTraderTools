
export default (stores, eventStreams, pricingApi) => ({
  login (username, password) {
    return pricingApi.login(username, password).then(({authToken, userManagementUrl}) => {
      eventStreams.loggedIn.onNext({username, authToken, userManagementUrl, password});
    });
  },

  logout () {
    eventStreams.loggedOut.onNext();
  },

  restoreLogin (username, password, authToken, userManagementUrl) {
    eventStreams.loggedIn.onNext({username, password, authToken, userManagementUrl});
  },
});
