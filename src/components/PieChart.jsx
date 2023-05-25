import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";


// Pass the % of stocks owned for each stock as an array
// Order: AAPL, MSFT, GOOG, AMZN, TSLA
export const PieChart = ({ piData }) => {
    const piRef = useRef(null);
    const [piChartInstance, setPiChartInstance] = useState(null);

    useEffect(() => {
        let newChartInstancePie = null;

        if (piData.length > 0 && piRef.current) {
            if (piChartInstance) {
                piChartInstance.destroy();
            }

            const piDataPie = {
                labels: ["AAPL", "MSFT", "GOOG", "AMZN", "TSLA"],
                datasets: [
                    {
                        label: "% stocks owned",
                        data: piData,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                        ],
                        borderColor: [
                            "rgb(255, 99, 132)",
                            "rgb(54, 162, 235)",
                            "rgb(255, 206, 86)",
                            "rgb(75, 192, 192)",
                            "rgb(153, 102, 255)",
                        ],
                        borderWidth: 1,
                    },
                ],
            };

            const chartOptions = {
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                    title: {
                        display: true,
                        text: "Stocks Distribution",
                    },
                },
            };

            const ctxPie = piRef.current.getContext("2d");
            newChartInstancePie = new Chart(ctxPie, {
                type: "pie",
                data: piDataPie,
                options: chartOptions,
            });
        }

        setPiChartInstance(newChartInstancePie);

        return () => {
            if (newChartInstancePie) {
                newChartInstancePie.destroy();
            }
        };
    }, [piData]);

    return (
        // Change the width and height attributes as desired
        <div style={{ width: "30%", height: "30%" }}>
            <canvas id="pie-chart" ref={piRef} />
        </div>
    );
};
