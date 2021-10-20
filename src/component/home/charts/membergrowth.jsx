import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const MemberGrowth = () => {
    const [chartData, setChartData] = useState({});
    const [interval, setInterval] = useState(7);
    const [todayJoin, setTodayJoin] = useState(0);
    const [yesterdayJoin, setYesterdayJoin] = useState(0);

    const chart = () => {
        let mDate = [];
        let mJoin = [];
        fetch(`http://localhost:8000/admin/data/member/?interval=${interval}`, { method: "GET" })
        .then(res => res.json())
        .then(result => {
            for (let dataObj in result.data) {
                mDate.push(result.data[dataObj]['bdate']);
                mJoin.push(result.data[dataObj]['sum']);
            }
            setChartData({
                labels: mDate,
                datasets: [
                    {
                        label: '會員數',
                        data: mJoin,
                        backgroundColor: 'rgb(38, 154, 143)',
                        borderColor: 'rgba(38, 154, 143, 0.2)',
                        tension: 0.3,
                        fill: false
                    }
                ],
            })
            // 設定今日、昨日人數
            setTodayJoin(result.data[result.data.length-1]['sum'])
            setYesterdayJoin(result.data[result.data.length-2]['sum'])
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
                text: '期間會員加入數',
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

    // 根據查詢區間(天數)，算出區間開始日
    function minusDays(searchInterval) {
        // 區間最後日 (今天)
        var ed = Date.now();
        // 區間開始日
        var sd = ed - searchInterval * 24*3600*1000;
        return sd;
    }

    // 格式化日期
    function formatDate(timestamp) {
        var d = new Date(timestamp);
        var month = (d.getMonth() + 1).toString().padStart(2, '0');
        var day = (d.getDate()).toString().padStart(2, '0');
        var year = d.getFullYear();
        month.padStart(2, '0');
        day.padStart(2, '0');
        return [year, month, day].join('-');
    }

    return (
        <div className="d-flex">
            <div className="graphBox graphBox-md">
                <Line
                    data = {chartData}
                    options = {options}
                />
            </div>

            <div>
                <select onChange={handleInterval} className="mt-2 ml-1">
                    <option value="7">過去 7 日</option>
                    <option value="30">過去 30 日</option>
                </select>
                <div className="mt-4 d-flex flex-column dataCard p-3">
                    <div className="m-2">
                        <strong className="mr-3">今日成長</strong>
                        <span>{todayJoin}</span>
                    </div>
                    <div className="m-2">
                        <strong className="mr-3">昨日成長</strong>
                        <span>{yesterdayJoin}</span>
                    </div>
                </div>
            </div>
        </div>
    ) 
}
export default MemberGrowth;