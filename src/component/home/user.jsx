import React from "react";

export class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            sqldata: [],
            data: []

        }
        this.handleClick = this.handleClick.bind(this);
        this.updateSearch = this.updateSearch.bind(this);

    }
    componentDidMount() {
        this.handleClick();
    }

    // 呼叫後端call API
    handleClick() {
        fetch('http://localhost:8000/admin/frontmember/frontmembersearch', { method: "GET" })
            .then(res => res.json())
            .then(data => {
                /*接到request data後要做的事情*/
                this.setState({
                    sqldata: data,
                });
            })
            .catch(e => {
                /*發生錯誤時要做的事情*/
                console.log(e);
            })
    }
    //搜尋判斷
    updateSearch(event) {
        this.setState({
            data: this.state.data,
            search: event.target.value
        })
    }

    // map主體
    filterList() {
        let updatedList = this.state.sqldata.filter((item) => {
            return (
                item.member_id.toString().toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 ||
                item.account.toString().toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 ||
                item.email.toString().toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
            )
        })

        let data = updatedList.map((item, index, array) => {
            return (
                <Trshow deta={item} rerender={this.handleClick} />
            )
        })

        return data
    }


    // render
    render() {
        return (
            <div id='memberBody' className='col-12'>
                {/* <div className='modal-backdrop fade show'></div> */}
                <div className='row '>
                    <h3 className='rowSpace p-3 align-self-center'>會員列表</h3>
                    <input className="searchBar p-3" placeholder="請輸入會員編號，帳號或電子信箱" onChange={this.updateSearch} value={this.state.search} type="text" />
                </div>
                <table className="memberTable col-12">
                    <thead>
                        <tr>
                            <th className='h5' scope="col">#會員編號</th>
                            <th className='h5' scope="col">帳號</th>
                            <th className='h5' scope="col">姓名</th>
                            <th className='h5' scope="col">生日</th>
                            <th className='h5' scope="col">手機號碼</th>
                            <th className='h5' scope="col">電子信箱</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            (this.state.sqldata === [])
                                ? '載入資料中請稍等...'
                                : this.filterList()
                        }
                    </tbody>
                </table>

                &nbsp;
            </div>
        );
    }
}

// tbody元件內容
class Trshow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <tr className='tRowshow'>
                <th scope="row" className="cardHead">
                    {' # ' + this.props.deta.member_id}
                </th>
                <td className='cardBody'>{this.props.deta.account}</td>
                <td className='cardBody'>{this.props.deta.first_name}</td>
                <td className='cardBody'>{this.props.deta.birthday.toString().split("T")[0]}</td>
                <td className='cardBody'>{this.props.deta.phone}</td>
                <td className='cardTail'>{this.props.deta.email}</td>
            </tr>
        );
    }
}

// 連線後端URL
const BASE_URL = "http://localhost:8000"

