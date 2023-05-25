import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import fetchStockPrice from "../api/StockPriceFetch";

export const LineChart = ({ stock, startDate, endDate }) => {
    const chartRef = useRef(null);
    const [closePrice, setClosePrice] = useState([]);
    const [openPrice, setOpenPrice] = useState([]);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        const getData = async () => {
            fetchStockPrice(
                stock,
                startDate,
                endDate
                // startDate.toISOString().split("T")[0],
                // endDate.toISOString().split("T")[0]
            )
                .then((response) => {
                    setClosePrice([]);
                    setOpenPrice([]);
                    response.data.results.forEach((item) => {
                        setClosePrice((closePrice) => [...closePrice, item.c]);
                        setOpenPrice((openPrice) => [...openPrice, item.o]);
                    });
                });
        };
        getData();
    }, [stock, startDate, endDate]);

    useEffect(() => {
        if (closePrice.length > 0 && openPrice.length > 0 && chartRef.current) {
            if (chartInstance) {
                chartInstance.destroy();
            }

            const chartData = {
                labels: closePrice.map((_, index) => `Day ${index + 1}`),
                datasets: [
                    {
                        label: "Close Price",
                        data: closePrice,
                        borderColor: "rgba(75, 192, 192, 1)",
                        fill: false,
                    },
                    {
                        label: "Open Price",
                        data: openPrice,
                        borderColor: "rgba(255, 99, 132, 1)",
                        fill: false,
                    },
                ],
            };

            const ctx = chartRef.current.getContext("2d");
            const newChartInstance = new Chart(ctx, {
                type: "line",
                data: chartData,
            });
            setChartInstance(newChartInstance);
        }
    }, [closePrice, openPrice]);

    return (
        <div>
            <h1>Line Chart</h1>
            <canvas id="line-chart" ref={chartRef} />
        </div>
    );
};
