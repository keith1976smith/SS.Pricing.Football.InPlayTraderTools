
export default (stores, eventStreams, pricingApi) => ({
  getUsers () {
    return pricingApi.getUsers().then((users)=>{
      eventStreams.gotUsers.onNext(users);
    });
  }
});
