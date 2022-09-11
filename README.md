# cross-exchange-arbitrage-REST-API
Simple REST API on Express.js to fetch prices on all exchanges for provided currency

To run script node js must be installed on your server/pc
After you cloned this repo in CMD run following comands:
1. cd cross-exchange-arbitrage-REST-API
2. npm install
3. node index

After you can request such data:
1. http://localhost:5000/allExchanges?ticker=BTC&base=USDT =>  Get prices for currency on all exchanges
2. http://localhost:5000/minimum?ticker=BTC&base=USDT => Get exchange with the lowest price of currency
3. http://localhost:5000/maximum?ticker=BTC&base=USDT => Get exchange with the highest price of currency
4. http://localhost:5000/arbitrage?ticker=BTC&base=USDT => Check for arbitrage opportunity, and see possible profit in %
