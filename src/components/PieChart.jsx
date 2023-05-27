import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";


export const PieChart = ({ piData }) => {
    const piRef = useRef(null);
    const [piChartInstance, setPiChartInstance] = useState(null);


    useEffect(() => {
        let newChartInstancePie = null;

        if (Object.keys(piData).length > 0 && piRef.current) {
            if (piChartInstance) {
                piChartInstance.destroy();
            }

            const labels = Object.keys(piData);
            const data = Object.values(piData);

            const piDataPie = {
                labels: labels,
                datasets: [
                    {
                        label: "% stocks owned",
                        data: data,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.8)",
                            "rgba(54, 162, 235, 0.8)",
                            "rgba(255, 206, 86, 0.8)",
                            "rgba(75, 192, 192, 0.8)",
                            "rgba(153, 102, 255, 0.8)",
                            "rgba(230, 125, 34, 0.8)",
                        ],
                        borderWidth: 0,
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
        <div style={{ width: "500px", height: "500px" }}>
            <canvas id="pie-chart" ref={piRef} />
        </div>
    );
};