import express from "express";
import fs from "fs";

const adsPageHtml = fs.readFileSync("./server_ads/html/ads.html").toString();
const adsFrameHtml = fs.readFileSync("./server_ads/html/ads_frame.html").toString();
const prebidAdsJs = fs.readFileSync("./server_ads/js/prebid-ads.js").toString();

const app = new express();

const requests = {};

app.use(express.json());
app.post("/add", async (req, res) => {
    requests[req.body.reqUUID] = await req.body;
    await res.send("OK");
});

app.use(express.urlencoded({extended: true}));
app.post("/settime/:requuid", (req, res) => {
    if(requests[req.params.requuid]) {
        requests[req.params.requuid].time = Date.now()/1000;
        if(requests[req.params.requuid].time + requests[req.params.requuid].waitSeconds < Date.now() / 1000) {
            res.send(requests[req.params.requuid].target);
        } else {
            res.status(200).send(Math.round(requests[req.params.requuid].time + requests[req.params.requuid].waitSeconds - (Date.now() / 1000)).toString());
        }
    } else {
        res.status(404).send();
    }
});


app.use(express.urlencoded({extended: true}));
app.get("/out/:requuid", (req, res) => {
    if(requests[req.params.requuid]) {
        if(requests[req.params.requuid].time + requests[req.params.requuid].waitSeconds < Date.now() / 1000) {
            res.send(requests[req.params.requuid].target);
        } else {
            res.status(200).send(Math.round(requests[req.params.requuid].time + requests[req.params.requuid].waitSeconds - (Date.now() / 1000)).toString());
        }
    } else {
        res.status(404).send();
    }
});

app.use(express.urlencoded({extended: true}));
app.get("/ads/:requuid", (req, res) => {
    let out = adsPageHtml;
    while (out.includes("{{requuid}}")) {
        out = out.replace("{{requuid}}", req.params.requuid);
    }
    res.type("html").send(out);
});

app.use(express.urlencoded({extended: true}));
app.get("/ads_frame.html", (req, res) => {
    res.type("html").send(adsFrameHtml);
});

app.get("/js/prebid-ads.js", (req, res) => {
    res.type("text/javascript").send(prebidAdsJs);
});

const PORT = 3011;

app.listen(PORT, "127.0.0.1", () => {
    console.log("listening on port "+PORT)
})