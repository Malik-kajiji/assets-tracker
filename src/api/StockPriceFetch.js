import axios from "axios";

export default function fetchStockPrice(stock, startDate, endDate) {
    return axios.get(`https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&limit=1000&apiKey=WOLt5Sn9r0oJZOXcfRzp_ybEAnp6CFN9`);
}