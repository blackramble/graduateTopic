import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";

const TypeSales = () => {
    const [chartData, setChartData] = useState({});
    const [interval, setInterval] = useState(0);
    const [info, setInfo] = useState([]);
    var allType = ['熱門票券', '一日/多日行', '住宿'];

    const chart = () => {
        let pType = [];
        let pSales = [];
        let pInfo = [];
        let startdate = formatDate(minusDays(interval));
        let enddate = new Date().toISOString().split('T', 1)[0];
        fetch(`http://localhost:8000/admin/data/type/?start=${startdate}&end=${enddate}`, { method: "GET" })
            .then(res => res.json())
            .then(result => {
                if (result.data) {
                    for (let dataObj in result.data) {
                        let id = result.data[dataObj]['type_id'];
                        pType.push(allType[id-1]);
                        pSales.push(result.data[dataObj]['sum']);
                        pInfo.push([allType[id-1], `$ ${ (result.data[dataObj]['sum']).toLocaleString() }` ]);
                    }
                    setChartData({
                        labels: pType,
                        datasets: [
                            {
                                label: 'sales',
                                data: pSales,
                                backgroundColor: [
                                '#e7c269',
                                '#269a8f',
                                '#f5a161'
                                ],
                                hoverBackgroundColor: [
                                '#e7c269',
                                '#269a8f',
                                '#f5a161'
                                ],
                                hoverOffset: 10,
                                borderRadius: 5
                            }
                        ]
                    })
                    // 右側資訊欄位
                    setInfo(pInfo);
                };
            })
            .catch(e => console.log(e))
    }

    const options = {
        plugins: {
            title: {
                display: true,
                text: '各類別商品銷售',
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
        <div className="d-flex flex-wrap flex-sm-column flex-md-row">
            <div className="graphBoxDonut graphBoxDonut-md">
                {
                    !chartData &&
                    <p>目前查無資料</p>
                }
                {
                    chartData &&
                    <Doughnut data={chartData} options={options} />
                }
            </div>
            <div className="d-flex flex-column">
                <div>
                    <select onChange={handleInterval} className="mt-2">
                        <option value="0">今日此刻</option>
                        <option value="1">昨日</option>
                        <option value="7">過去 7 日</option>
                        <option value="30">過去 30 日</option>
                    </select>
                </div>
                <div className="d-flex flex-column mt-5 dataCard p-3">
                    {
                        info &&
                        info.map((elem, index) => {
                            return (
                            <div key={index} className="d-flex justify-content-between m-2">
                                <strong className="mr-3">{elem[0]}</strong>
                                <span>{elem[1]}</span>
                            </div>
                            )
                        })
                    }
                </div>
                
                
            </div>
        </div>
        
    )
}

export default TypeSales;