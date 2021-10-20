import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sqldata: null
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleClick();
    }

    // 呼叫後端call API
    handleClick() {
        fetch('http://localhost:8000/admin/orderlist/mainlist/status0', { method: "GET" })
            .then(res => res.json())
            .then(data => {
                /*接到request data後要做的事情*/
                this.setState({
                    sqldata: data
                });
            })
            .catch(e => {
                /*發生錯誤時要做的事情*/
                console.log(e);
            })
    }

    render() {
        return (
            <div id='memberBody' className='col-12'>
                {/* <div className='modal-backdrop fade show'></div> */}
                <div className='row'>
                    <h3 className='rowSpace p-3'>訂單管理</h3>

                    {/* 狀態按鈕 */}
                    <div className=" btn-group btn-group-toggle m-3" data-toggle="buttons">
                        <label className="btn statusBtnsact">
                            <Link to='/admin/order'>
                                <div className='statusBtnsact'>
                                    <input type="radio" name='options' id='option1' />
                                    已付款
                                </div>

                            </Link>
                        </label>

                        <label className="btn statusBtns">
                            <Link to='/admin/orderstatus1'>
                                <div className='statusBtns'>
                                    <input type="radio" name='options' id='option1' />
                                    已使用
                                </div>

                            </Link>

                        </label><label className="btn statusBtns">
                            <Link to='/admin/orderstatus2'>
                                <div className='statusBtns'>
                                    <input type="radio" name='options' id='option1' />
                                    待取消
                                </div>
                            </Link>

                        </label><label className="btn statusBtns">
                            <Link to='/admin/orderstatus3'>
                                <div className='statusBtns'>
                                    <input type="radio" name='options' id='option1' checked />
                                    已取消
                                </div>
                            </Link>
                        </label>
                    </div>
                </div>
                <table className="memberTable col-12">
                    <thead>
                        <tr>
                            <th className='h5' scope="col">#訂單編號</th>
                            <th className='h5' scope="col">訂購人姓名</th>
                            <th className='h5' scope="col">商品名稱</th>
                            <th className='h5' scope="col">總金額</th>
                            <th className='h5' scope="col">訂購日期</th>
                            <th className='h5' scope="col">訂單狀態</th>
                        </tr>
                    </thead>
                    {
                        (this.state.sqldata === null)
                            ? '載入資料中請稍等...'
                            : <NumberList deta={this.state.sqldata} />
                    }
                </table>

                &nbsp;
            </div>
        );
    }
}

//會員table主體
function NumberList(props) {
    const numbers = props.deta;
    const listItems = numbers.map((number) =>
        <Trshow deta={number} />
    );
    if (numbers.length === 0) {
        return (
            <h3 className='nodata'>
                查無資料...
            </h3>
        )
    }
    return (
        <tbody>
            {listItems}
        </tbody>
    );
}

//判斷狀態
function statusSet(status) {
    if (status === 0) {
        return '已付款'
    }
    if (status === 1) {
        return '已使用'
    }
    if (status === 2) {
        return '待取消'
    }
    if (status === 3) {
        return '已取消'
    }
}

// table內容
class Trshow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <tr className='tRowshow'>
                <th scope="row" className="cardHead">
                    {' # ' + this.props.deta.orderlist_id}
                </th>
                <td className='cardBody'>{this.props.deta.first_name}</td>
                <td className='cardBody'>{this.props.deta.product_name}</td>
                <td className='cardBody'>{this.props.deta.total_price}</td>
                <td className='cardBody'>{this.props.deta.bdate.toString().split("T")[0]}</td>
                <td className='cardBody'>{statusSet(this.props.deta.status)}</td>
                <td className='cardlastBody'>
                    <button type="button" className="btn mydeleteBtn" data-toggle="modal" data-target={'#edit' + this.props.deta.orderlist_id}>查看訂單詳情</button>
                </td>
                {/* <td className='cardTail'>{<Memberdelete adminid={this.props.deta.orderlist_id} rerender={this.props.rerender} />}
                </td> */}
                <Editbtn data={this.props.deta} />
            </tr>
        );
    }
}

// 方案mpa邏輯
function Planlist(props) {
    const orderdetail = props.detaildata;
    const orderdetaillist = orderdetail.map((number) =>
        <Planrender detaildata={number} />
    );
    return (
        <tbody>
            {orderdetaillist}
        </tbody>
    );
}

// 方案render
function Planrender(props) {
    const [planName, setplanName] = useState('載入中');
    const [planMoney, setplanMoney] = useState('0');

    useEffect(() => {
        callDetail(props.detaildata.plan_id)
    })

    async function callDetail(comeinplan_id) {
        let plan_id = comeinplan_id
        await fetch(`${BASE_URL}/admin/orderlist/detailplan/${plan_id}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        })
            .then(
                (res) => res.json()
            )
            .then(
                (data) => {
                    setplanName(data[0].plan_name);
                    setplanMoney(data[0].price)
                }
            )
            .catch(e => {
                /*發生錯誤時要做的事情*/
                console.log(e);
            });
    }

    return (
        <div className="modal-body dialogPlan">
            <form action="">
                <div className='row container mb-2'>
                    <h5 className='mr-auto orderDtitle'>方案名稱 :</h5>
                    <h5>{planName}</h5>
                </div>
                <div className='row container mb-2'>
                    <h5 className='mr-auto orderDtitle'>方案金額 :</h5>
                    <h5>{planMoney}</h5>
                </div>
                <div className='row container mb-2'>
                    <h5 className='mr-auto orderDtitle'>數量 :</h5>
                    <h5>{props.detaildata.plan_count + ' 個'}</h5>
                </div>
            </form>
        </div>
    );
}

//訂單詳情
class Editbtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detaildata: null,
        }
        this.callDetail = this.callDetail.bind(this);
    }
    async callDetail() {
        let orderlist_id = this.props.data.orderlist_id
        await fetch(`http://localhost:8000/admin/orderlist/detail/${orderlist_id}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        })
            .then(
                (res) => res.json()
            )
            .then(
                (data) => {
                    this.setState({
                        detaildata: data
                    })
                }
            )
            .catch(e => {
                /*發生錯誤時要做的事情*/
                console.log(e);
            });


    }
    componentDidMount() {
        this.callDetail();
    }

    render() {
        return (
            <div>
                <div className="modal fade" id={'edit' + this.props.data.orderlist_id}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title font-weight-bold orderDtitle" id="exampleModalLabel">訂單編號 </h3>
                                <h3 className="modal-title font-weight-bold orderDtitle" id="exampleModalLabel">{'#' + this.props.data.orderlist_id}</h3>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>


                            {
                                (this.state.detaildata === null)
                                    ? '載入資料中請稍等...'
                                    : <Planlist detaildata={this.state.detaildata} />
                            }

                            <div className="modal-footer">
                                <button type="button" className="btn mysubmitBtn" data-dismiss="modal" >確認</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



// 連線後端URL
const BASE_URL = "http://localhost:8000"