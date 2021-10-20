import { BrowserRouter, Route, Redirect } from "react-router-dom";

import SubNavbar from './subNavbar';
import ChartBoard from './chartBoard';
import ProductList from './productList';
import { ProductCreate, ProductCreatePageTwo, ProductCreatePageThree } from './productCreate';
import { ProductEdit, ProductEditPageTwo, ProductEditPageThree } from './productEdit';
import { Order } from './order';
import { Orderst1 } from './orderst1';
import { Orderst2 } from './orderst2';
import { Orderst3 } from './orderst3';
import { User } from './user';
import { Member } from './member';

const Home = (props) => {

    const { isLogin, loginUser, handleLogin } = props;
    return (
        <div className="home">
            <BrowserRouter>
                <div className="container-fluid">
                    <div className='row'>
                        <div className="col-sm-3 col-md-2 col-md-2">
                            <SubNavbar loginUser={loginUser} />
                        </div>
                        <div className="col-sm-9 col-md-10">
                            <Route exact path="/admin/chart" component={ChartBoard} />
                            <Route exact path="/admin/product" component={ProductList} />
                            <Route exact path="/admin/product/create/p1" component={ProductCreate} />
                            <Route exact path="/admin/product/create/p2/:id" component={ProductCreatePageTwo} />
                            <Route exact path="/admin/product/create/p3/:id" component={ProductCreatePageThree} />
                            <Route path="/admin/product/edit/:productId/p1" component={ProductEdit} />
                            <Route path="/admin/product/edit/:productId/p2" component={ProductEditPageTwo} />
                            <Route path="/admin/product/edit/:productId/p3" component={ProductEditPageThree} />

                            <Route exact path="/admin/order" component={Order} />
                            <Route exact path="/admin/orderstatus1" component={Orderst1} />
                            <Route exact path="/admin/orderstatus2" component={Orderst2} />
                            <Route exact path="/admin/orderstatus3" component={Orderst3} />
                            <Route exact path="/admin/user" component={User} />
                            <Route exact path="/admin/member" component={Member} />
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        </div>
    )
};

export default Home;