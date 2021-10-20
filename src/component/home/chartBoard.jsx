import { BrowserRouter, Route, Redirect, Link } from "react-router-dom";
import TypeSales from './charts/typeSales';
import TotalSales from './charts/totalSales';
import MemberGrowth from './charts/membergrowth';
import ProductCvr from './charts/productCvr';
import SalesDetails from './charts/salesdetails';
import { useState } from "react";

const ChartBoard = () => {
    const [active, setActive] = useState('typesales');
    const onChange = (page) => {
        setActive(page);
    }
    return (
        <div className='col-12'>
            <h3 className='rowSpace p-3'>數據中心</h3>
            <BrowserRouter>
                <div className="memberTable col-12">
                        <div className="d-flex flex-column align-items-center">
                                <div className="d-flex flex-sm-column flex-md-row justify-content-between">
                                    { (active === 'typesales')
                                       ? <Link to="/admin/chart/typesales"><div className="col rowSpace nav-link chart-link link-active" onClick={() => onChange('typesales')}>各類別商品銷售</div></Link>
                                       : <Link to="/admin/chart/typesales"><div className="col rowSpace nav-link chart-link" onClick={() => onChange('typesales')}>各類別商品銷售</div></Link>
                                    }
                                    { (active === 'totalsales')
                                       ? <Link to="/admin/chart/totalsales"><div className="col rowSpace nav-link chart-link link-active" onClick={() => onChange('totalsales')}>所有銷售</div></Link>
                                       : <Link to="/admin/chart/totalsales"><div className="col rowSpace nav-link chart-link" onClick={() => onChange('totalsales')}>所有銷售</div></Link>
                                    }
                                    { (active === 'membergrowth')
                                       ? <Link to="/admin/chart/membergrowth"><div className="col rowSpace nav-link chart-link link-active" onClick={() => onChange('membergrowth')}>會員成長</div></Link>
                                       : <Link to="/admin/chart/membergrowth"><div className="col rowSpace nav-link chart-link" onClick={() => onChange('membergrowth')}>會員成長</div></Link>
                                    }
                                    { (active === 'productcvr')
                                       ? <Link to="/admin/chart/productcvr"><div className="col rowSpace nav-link chart-link link-active" onClick={() => onChange('productcvr')}>商品轉換率</div></Link>
                                       : <Link to="/admin/chart/productcvr"><div className="col rowSpace nav-link chart-link" onClick={() => onChange('productcvr')}>商品轉換率</div></Link>
                                    }
                                    { (active === 'salesdetails')
                                       ? <Link to="/admin/chart/salesdetails"><div className="col rowSpace nav-link chart-link link-active" onClick={() => onChange('salesdetails')}>訂單數量</div></Link>
                                       : <Link to="/admin/chart/salesdetails"><div className="col rowSpace nav-link chart-link" onClick={() => onChange('salesdetails')}>訂單數量</div></Link>
                                    }
                                </div>
                            
                                {/* 進入此頁導向類別銷售 */}
                                <Redirect to="/admin/chart/typesales" />
                                <Route exact path="/admin/chart/typesales" component={TypeSales} />
                                <Route exact path="/admin/chart/totalsales" component={TotalSales} />
                                <Route exact path="/admin/chart/membergrowth" component={MemberGrowth} />
                                <Route exact path="/admin/chart/productcvr" component={ProductCvr} />
                                <Route exact path="/admin/chart/salesdetails" component={SalesDetails} />
                        </div>
                    </div>
                    
            </BrowserRouter>
        </div>
    )
    
}

export default ChartBoard;