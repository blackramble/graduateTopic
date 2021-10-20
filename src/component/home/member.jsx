import React from "react";

export class Member extends React.Component {
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
        fetch('http://localhost:8000/admin/account/administrator', { method: "GET" })
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
                    <h3 className='rowSpace p-3'>管理員列表</h3>
                </div>
                <table className="memberTable col-12">
                    <thead>
                        <tr>
                            <th className='h5' scope="col">#員工編號</th>
                            <th className='h5' scope="col">帳號</th>
                            <th className='h5' scope="col">暱稱</th>
                            <th className='h5' scope="col">最近修改日期</th>
                            <th className='h5' scope="col">
                                <button id='myaddBtn' type="button" className="btn" data-toggle="modal" data-target="#addModal">新增員工</button>
                            </th>
                            <th scope="col">
                                {/* <button type="button" className="btn btn-success" onClick={this.handleClick}>test</button> */}
                            </th>
                        </tr>
                    </thead>
                    {
                        (this.state.sqldata === null)
                            ? '載入資料中請稍等...'
                            : <NumberList deta={this.state.sqldata} rerender={this.handleClick} />
                    }
                </table>

                <Addbtn data={this.handleClick} />
                &nbsp;
            </div>
        );
    }
}

//會員table主體
function NumberList(props) {
    const numbers = props.deta;
    const listItems = numbers.map((number) =>
        <Trshow deta={number} rerender={props.rerender} />
    );
    return (
        <tbody>
            {listItems}
        </tbody>
    );
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
                    {' # ' + this.props.deta.admin_id}
                </th>
                <td className='cardBody'>{this.props.deta.account}</td>
                <td className='cardBody'>{this.props.deta.nickname}</td>
                <td className='cardBody'>{this.props.deta.bdate.toString().split("T")[0]}</td>
                <td className='cardlastBody'>
                    <button type="button" className="btn myeditBtn" data-toggle="modal" data-target={'#edit' + this.props.deta.admin_id}>修改資料</button>
                </td>
                <td className='cardTail'>{<Memberdelete adminid={this.props.deta.admin_id} rerender={this.props.rerender} />}
                </td>
                <Editbtn data={this.props.deta} rerender={this.props.rerender} />
            </tr>
        );
    }
}

//刪除員工
class Memberdelete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.deleteMember = this.deleteMember.bind(this);
    }
    //呼叫刪除api
    async deleteMember() {
        let deleteid = this.props.adminid
        await fetch(`${BASE_URL}/admin/account/delete`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                deleteid
            }),
        })
            .then(
                (res) => res.json()
            )
            .catch(e => {
                /*發生錯誤時要做的事情*/
                console.log(e);
            });
        this.props.rerender();
    }
    render() {
        return (
            <button className='btn mydeleteBtn' onClick={this.deleteMember}>刪除帳號</button>
        );
    }
}

function Deletecheck(props) {

}


//以下彈窗

//dialog新增
class Addbtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountvalue: '',
            nicknamevalue: '',
            passwordvalue: '',
        }

        this.accountChange = this.accountChange.bind(this);
        this.nicknameChange = this.nicknameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.cnacelChange = this.cnacelChange.bind(this);
        this.newMember = this.newMember.bind(this);
    }
    cnacelChange() {
        this.setState({
            accountvalue: '',
            nicknamevalue: '',
            passwordvalue: '',
        })
    }
    accountChange(event) {
        this.setState({
            accountvalue: event.target.value,
        });
    }
    nicknameChange(event) {
        this.setState({
            nicknamevalue: event.target.value
        });
    }
    passwordChange(event) {
        this.setState({
            passwordvalue: event.target.value
        });
    }

    // 新增會員api
    newMember = async () => {
        var account = this.state.accountvalue;
        var nickname = this.state.nicknamevalue;
        var password = this.state.passwordvalue;

        await fetch(`${BASE_URL}/admin/account/create`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                account,
                nickname,
                password
            }),
        })
            .then(
                (res) => res.json()
            )
            .catch(e => {
                /*發生錯誤時要做的事情*/
                console.log(e);
            })
        await this.props.data();
        this.setState({
            accountvalue: '',
            nicknamevalue: '',
            passwordvalue: '',
        })
    };

    handleSubmit() {
        this.newMember()
    }

    render() {
        return (
            <div>
                <div className="modal fade" id="addModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title font-weight-bold orderDtitle" id="exampleModalLabel">新增員工</h3>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form action="">
                                    <div className='row container mb-2'>
                                        <h5 className='mr-auto orderDtitle'>帳號 :</h5>
                                        <input type="text"
                                            placeholder='請輸入帳號'
                                            value={this.state.accountvalue}
                                            onChange={this.accountChange} />
                                    </div>
                                    <div className='row container mb-2'>
                                        <h5 className='mr-auto orderDtitle'>暱稱 :</h5>
                                        <input type="text"
                                            placeholder='請輸入暱稱'
                                            value={this.state.nicknamevalue}
                                            onChange={this.nicknameChange} />
                                    </div>
                                    <div className='row container mb-2'>
                                        <h5 className='mr-auto orderDtitle'>密碼 :</h5>
                                        <input type="password"
                                            placeholder='請輸入密碼'
                                            value={this.state.passwordvalue}
                                            onChange={this.passwordChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn cancelBtn" data-dismiss="modal" onClick={this.cnacelChange}>取消</button>
                                <button type="button" className="btn mysubmitBtn" data-dismiss="modal" onClick={this.handleSubmit} >確認新增</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

//dialog 修改
class Editbtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adminidValue: this.props.data.admin_id,
            nicknameValue: this.props.data.nickname,
            newpasswordValue: ''
        }
        this.cnacelChange = this.cnacelChange.bind(this);
        this.nicknameChange = this.nicknameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    cnacelChange() {
        this.setState({
            adminidValue: this.props.data.admin_id,
            nicknameValue: this.props.data.nickname,
            newpasswordValue: ''
        })
    }
    nicknameChange(event) {
        this.setState({
            nicknameValue: event.target.value
        });
    }
    passwordChange(event) {
        this.setState({
            newpasswordValue: event.target.value
        });
    }
    async handleSubmit() {
        var admin_id = this.state.adminidValue;
        var nickname = this.state.nicknameValue;
        var password = this.state.newpasswordValue;

        if (password === '') {
            await fetch(`${BASE_URL}/admin/account/editnicknameonly`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    nickname,
                    admin_id
                }),
            })
                .then(
                    (res) => res.json()
                )
                .catch(e => {
                    /*發生錯誤時要做的事情*/
                    console.log(e);
                })
        } else {
            await fetch(`${BASE_URL}/admin/account/editaccount`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    nickname,
                    password,
                    admin_id
                }),
            })
                .then(
                    (res) => res.json()
                )
                .catch(e => {
                    /*發生錯誤時要做的事情*/
                    console.log(e);
                })
        }

        await this.props.rerender()

        this.setState({
            adminidValue: this.props.data.admin_id,
            nicknameValue: this.state.nicknameValue,
            newpasswordValue: ''
        })
    }
    render() {
        return (
            <div>
                <div className="modal fade" id={'edit' + this.props.data.admin_id}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title font-weight-bold orderDtitle" id="exampleModalLabel">修改資料</h3>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form action="">
                                    <div className='row container mb-2'>
                                        <h5 className='mr-auto orderDtitle'>管理員編號 :</h5>
                                        <h5>{'#' + this.props.data.admin_id}</h5>
                                    </div>
                                    <div className='row container mb-2'>
                                        <h5 className='mr-auto orderDtitle'>暱稱 :</h5>
                                        <input type="text"
                                            placeholder='請輸入暱稱'
                                            value={this.state.nicknameValue}
                                            onChange={this.nicknameChange} />
                                    </div><div className='row container mb-2'>
                                        <h5 className='mr-auto orderDtitle'>新密碼 :</h5>
                                        <input type="password" placeholder='請輸入新密碼'
                                            value={this.state.newpasswordValue}
                                            onChange={this.passwordChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn cancelBtn" data-dismiss="modal" onClick={this.cnacelChange}>取消</button>
                                <button type="button" className="btn mysubmitBtn" data-dismiss="modal" onClick={this.handleSubmit}>確認修改</button>
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

