require("dotenv").config();
const express = require("express");
const ccxt = require("ccxt");

const PORT = process.env.PORT || 5000;
const app = express();

const getPrices = async (ticker, base) => {
  const exchanges = ccxt.exchanges;
  const prices = await Promise.all(
    exchanges.map((item) => {
      const price = new ccxt[item]().fetchTicker(`${ticker}/${base}`).catch((e) => e);
      return price;
    })
  );
  const obj = {};
  exchanges.forEach((element, index) => {
    if (!(prices[index] instanceof Error && prices[index].last)) {
      obj[element] = prices[index].last;
    }
  });
  return obj;
};

app.get('/health', (req, res) => {
  res.status(200).send('Ok');
});
app.get("/allExchanges", async (req, res) => {
  if(!(req.query.ticker && req.query.base)) {
    res.status(400).json({message: "You forgot to specify ticker and base currencies (e.g. http://localhost:5000/arbitrage?ticker=BTC&base=USDT)"});
  }
  const result = await getPrices(req.query.ticker, req.query.base);
  res.status(200).json(result);
});
app.get("/minimum", async (req, res) => {
  if(!(req.query.ticker && req.query.base)) {
    res.status(400).json({message: "You forgot to specify ticker and base currencies (e.g. http://localhost:5000/arbitrage?ticker=BTC&base=USDT)"});
  }
  const result = await getPrices(req.query.ticker, req.query.base);
  const min = Object.entries(result).sort(([, v1], [, v2]) => v1 - v2);
  res.status(200).json({ exchange: min[0][0], price: min[0][1] });
});
app.get("/maximum", async (req, res) => {
  if(!(req.query.ticker && req.query.base)) {
    res.status(400).json({message: "You forgot to specify ticker and base currencies (e.g. http://localhost:5000/arbitrage?ticker=BTC&base=USDT)"});
  }
  const result = await getPrices(req.query.ticker, req.query.base);
  const max = Object.entries(result).sort(([, v1], [, v2]) => v2 - v1);
  res.status(200).json({ exchange: max[0][0], price: max[0][1] });
});
app.get("/arbitrage", async (req, res) => {
  if(!(req.query.ticker && req.query.base)) {
    res.status(400).json({message: "You forgot to specify ticker and base currencies (e.g. http://localhost:5000/arbitrage?ticker=BTC&base=USDT)"});
  }
  const result = await getPrices(req.query.ticker, req.query.base);
  const min = Object.entries(result).sort(([, v1], [, v2]) => v1 - v2)[0];
  const max = Object.entries(result).sort(([, v1], [, v2]) => v2 - v1)[0];
  const profit = max[1] / min[1] - 1;
  res.status(200).json({ buyPrice: min[1], sellPrice: max[1], buyExchange: min[0], sellExchange: max[0], profit: profit });
});

app.listen(PORT);
