import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

const SalesDetails = () => {
  const [chartData, setChartData] = useState({});
  const [interval, setInterval] = useState(7);
  const [todaySale, setTodaySale] = useState(0);
  const [yesterdaySale, setYesterdaySale] = useState(0);

  const chart = () => {
    let pDate = [];
    let pOrders = [];
    fetch(`http://localhost:8000/admin/data/totalorders/?interval=${interval}`, { method: "GET" })
        .then(res => res.json())
        .then(result => {
          for (let dataObj in result.data) {
              pDate.push(result.data[dataObj]['bdate']);
              pOrders.push(result.data[dataObj]['count']);
          }
          setChartData({
              labels: pDate,
              datasets: [
                  {
                    label: '訂單數',
                    data: pOrders,
                    backgroundColor: 'rgb(245, 161, 97)',
                    borderColor: 'rgba(245, 161, 97, 0.2)',
                    tension: 0.3,
                    fill: false
                  }
              ],
          })
          // 設定今日、昨日銷售
          setTodaySale(result.data[result.data.length-1]['count'])
          setYesterdaySale(result.data[result.data.length-2]['count'])
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
            text: '所有訂單數',
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
        <Bar
          data = {chartData}
          options = {options}
        />
      </div>
      
      <div className="ml-3 mt-2">
        <select onChange={handleInterval}>
            <option value="7">過去 7 日</option>
            <option value="30">過去 30 日</option>
        </select>
        <div className="mt-4 d-flex flex-column dataCard p-3">
          <div className="m-2">
            <strong className="mr-3">今日訂單數</strong>
            <span>{todaySale}</span>
          </div>
          <div className="m-2">
            <strong className="mr-3">昨日訂單數</strong>
            <span>{yesterdaySale}</span>
          </div>
        </div>


      </div>
      
    </div>
  )   
}

export default SalesDetails;