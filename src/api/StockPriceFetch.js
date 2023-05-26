import axios from "axios";

export default function fetchStockPrice(stock, startDate, endDate) {
    return axios.get(`https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&limit=1000&apiKey=3zj_m9FpO_48a2FI19jcJbILz_1UpEpD`);
}