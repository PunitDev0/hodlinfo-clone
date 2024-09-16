import express from 'express'
import mongoose from 'mongoose'
import axios from 'axios'
import path from 'path'
const app = express();

app.use(express.static('../public'));
app.set('view engine', 'ejs');
app.set('views', '../views'); 

mongoose.connect('mongodb://localhost:27017/hodlinfo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  // Define schema and model for the tickers
  const tickerSchema = new mongoose.Schema({
    name: String,
    last: String,
    buy: String,
    sell: String,
    volume: String,
    base_unit: String,
  });
  
  const Ticker = mongoose.model('Ticker', tickerSchema);

app.get('/fetch', async (req, res) => {
    try{
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers')
        const tickers = Object.values(response.data).slice(0,10);
        console.log(tickers);
        
        for (let ticker of tickers) {
            const newTicker = new Ticker({
              name: ticker.name,
              last: ticker.last,
              buy: ticker.buy,
              sell: ticker.sell,
              volume: ticker.volume,
              base_unit: ticker.base_unit,
            });
            await newTicker.save();
          }

    }catch(error){
        console.error(error);
        return res.status(500).send('Error fetching data from API');
    }
})

const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});
app.get('/', async (req, res) => {
    try {
      const tickers = await Ticker.find();
      console.log(tickers)
      res.render('index', { tickers });
    } catch (error) {
      console.error('Error rendering data:', error);
      res.status(500).send('Error rendering data');
    }
  });

