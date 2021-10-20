import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const TotalSales = () => {
    const [chartData, setChartData] = useState({});
    const [interval, setInterval] = useState(7);
    const [todaySale, setTodaySale] = useState(0);
    const [yesterdaySale, setYesterdaySale] = useState(0);

    const chart = () => {
        let pDate = [];
        let pSales = [];
        fetch(`http://localhost:8000/admin/data/totalsales/?interval=${interval}`, { method: "GET" })
            .then(res => res.json())
            .then(result => {
                for (let dataObj in result.data) {
                    pDate.push(result.data[dataObj]['bdate']);
                    pSales.push(result.data[dataObj]['sum']);
                }
                setChartData({
                    labels: pDate,
                    datasets: [
                        {
                            label: '銷售額',
                            data: pSales,
                            backgroundColor: 'rgb(245, 161, 97)',
                            borderColor: 'rgba(245, 161, 97, 0.2)',
                            tension: 0.3,
                            fill: false
                        }
                    ],
                })
                // 設定今日、昨日銷售
                setTodaySale(`$ ${ (result.data[result.data.length-1]['sum']).toLocaleString() }`);
                setYesterdaySale(`$ ${ (result.data[result.data.length-2]['sum']).toLocaleString() }`);
            })
            .catch(e => console.log(e))
    }

    const options = {
        scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
        },
        plugins: {
            title: {
                display: true,
                text: '所有銷售',
                font: {weight: 'bold', size: 14}
            },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 12
                    }
                }
            }
        }
    }

    useEffect(() => {
        chart();
    }, [interval]);

    // select value 不同時改變日期區間
    const handleInterval = (event) => {
        console.log(event.target.value);
        setInterval(event.target.value);
    }

    return (
        <div className="d-flex">
            <div className="graphBox graphBox-md">
                <Line
                    data = {chartData}
                    options = {options}
                />
            </div>
                
            <div className="">
                <select onChange={handleInterval} className="mt-2 ml-1">
                    <option value="7">過去 7 日</option>
                    <option value="30">過去 30 日</option>
                </select>
                <div className="mt-4 d-flex flex-column dataCard p-3">
                    <div className="m-2">
                        <strong className="mr-3">今日銷售額</strong>
                        <span>{todaySale}</span>
                    </div>
                    <div className="m-2">
                        <strong className="mr-3">昨日銷售額</strong>
                        <span>{yesterdaySale}</span>
                    </div>
                </div>
            </div>
        </div>
    )   
}

export default TotalSales;