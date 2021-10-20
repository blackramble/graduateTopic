import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

const ProductCvr = () => {
  const [chartData, setChartData] = useState({});
  const [productInfo, setProductInfo] = useState([]);
  const chart = () => {
    let pId = [];
    let pCvr = [];
    let pName = [];
    let pInfo = [];
    fetch(`http://localhost:8000/admin/data/totalcvr`, { method: "GET" })
        .then(res => res.json())
        .then(result => {
          if (result.data) {
            for (let dataObj in result.data) {
              pId.push('# ' + result.data[dataObj]['product_id']);
              pCvr.push(result.data[dataObj]['cvr']);
              pName.push(result.data[dataObj]['product_name']);
              pInfo.push({
                id: result.data[dataObj]['product_id'],
                cvr: result.data[dataObj]['cvr'],
                name: result.data[dataObj]['product_name']
              })
            }
            setProductInfo(pInfo);
            setChartData({
                labels: pId,
                datasets: [
                    {
                      label: 'CVR',
                      data: pCvr,
                      backgroundColor: 'rgb(231, 193, 106)',
                      borderColor: 'rgba(231, 193, 106, 0.2)',
                      tension: 0.3,
                      fill: false
                    }
                ],
            })
          }
        })
        .catch(e => console.log(e))
  }
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 0.1
          },
        },
      ],
    },
    plugins: {
        title: {
            display: true,
            text: '商品轉換率',
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
  }, []);

  return (
    <div>
        <div className="d-flex flex-column">
          <div className="graphBox graphBox-md d-flex align-self-center">
            {
              !chartData &&
              <p>目前查無資料</p>
            }

            {
              chartData && 
              <Bar
                data = {chartData}
                options = {options}
              />
            }
          </div>

          <div className="d-flex flex-column align-self-center mt-3 dataCard p-3">
            <div className="table-responsive">
              <table className="ml-1">
                <thead className="cvrTable">
                  <th className="text-center py-1">排名</th>
                  <th className="text-center py-1">編號</th>
                  <th className="text-center py-1">商品</th>
                  <th className="text-center py-1">CVR</th>
                </thead>
                <tbody>
                  {
                    productInfo && 
                    productInfo.map((elem, index) => {
                      return <Item key={elem.id} rank={index+1} id={elem.id} cvr={elem.cvr*100 +' %'} name={elem.name} />
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
  )   
}

class Item extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <tr>
          <td className="text-center">{this.props.rank}</td>
          <td className="px-1 text-right px-3">{this.props.id}</td>
          <td className="px-3">{this.props.name}</td>
          <td className="text-right">{this.props.cvr}</td>
        </tr>
    )
  }
}


export default ProductCvr;

