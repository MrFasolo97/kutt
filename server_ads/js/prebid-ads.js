window.blockingAdsIsFunnyAndDisabled = true;

fetch("//ad.a-ads.com/2233919?size=728x90", {mode: "no-cors"}).then((res) => {
    window.fetchAdResult = true;
}).catch((err) => {
    window.fetchAdResult = false;
    console.log(err);
});
