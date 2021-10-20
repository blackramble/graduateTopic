import { useState, useEffect, useQuery } from "react";
import { Link } from "react-router-dom";
import ProductItem from './productItem';

const ProductList = (props) => {
    const { match, location } = props;
    // console.log(match);
    // console.log(location);

    const [product, setProduct] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState('http://localhost:8000/admin/product/');

    useEffect(() => {
        const abortCont = new AbortController();
        
        fetch(url, { signal: abortCont.signal })
            .then((res) => {
                if(!res.ok) {
                throw Error('Could not fetch the data for that research');
                }
                return res.json();
            })
            .then((result) => {
                setProduct(result.data);
                setIsPending(false);
                setError(null);
            })
            .catch((err) => {
                if (err.name === "AbortError") {
                console.log('fetch aborted');
                } else {
                setIsPending(false);
                setError(err.message);
                }
            })
    }, [url]);

    const searchStatus = (status) => {
        if ( status === 1 ) {
            setUrl('http://localhost:8000/admin/product/status/active');
        } else if ( status === 0 ) {
            setUrl('http://localhost:8000/admin/product/status/deactive');
        }
    }

    return (
        <div>
            <div className="d-flex">
                <div className="d-flex align-items-center">
                    <h3 className='rowSpace p-3'>商品管理</h3>
                </div>
                <div className="d-flex align-items-center">
                    <Link to={`${match.url}?q=active`}>
                        { (url === 'http://localhost:8000/admin/product/status/active')
                          ? <button className="btn myaddBtn mr-1" onClick={ () => searchStatus(1) }>已上架</button>
                          : <button className="btn mysubmitBtn mr-1" onClick={ () => searchStatus(1) }>已上架</button>
                        }
                    </Link>
                    <Link to={`${match.url}?q=deactive`}>
                        { (url === 'http://localhost:8000/admin/product/status/deactive')
                          ? <button className="btn myaddBtn" style={{}} onClick={ () => searchStatus(0) }>未上架</button>
                          : <button className="btn mysubmitBtn" style={{}} onClick={ () => searchStatus(0) }>未上架</button>
                        }
                    </Link> 
                </div>
            </div>
            
            <table className="memberTable col-12">
                <thead>
                    <tr>
                        <th className='h5 text-center' scope="col">編號</th>
                        <th className='h5 text-center' scope="col">商品名稱</th>
                        <th className='h5 text-center' scope="col">商品類型</th>
                        <th className='h5 text-center' scope="col">最早預訂日</th>
                        <th className='h5 text-center' scope="col">最終預訂日</th>
                        <th className='h5 text-center' scope="col">已售出</th>
                        <th className='h5 text-center' scope="col">
                            <Link to={`${match.url}/create/p1`}>
                            {/* 這裡暫時改掉 */}
                            {/* <Link to={`${match.url}/create/p2/13`}> */}
                                <button className="btn myaddBtn">新增</button>
                            </Link>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isPending && 
                    <td colSpan="6">
                        <p>載入資料中請稍等...</p>
                    </td>
                    }
                    {error && 
                    <td colSpan="6" className="text-center">
                        <p>資料載入錯誤了，要回首頁嗎</p>
                        <Link to="/admin/">
                            <p style={{
                                        color: '#14877a', 
                                        textDecoration: 'underline',

                            }}>回到首頁
                        </p>
                        </Link>
                    </td>
                    }
                    { product && 
                        product.map(elem => <ProductItem product={elem} productMatch={match} key={elem.product_id} />)
                    }
                </tbody>
            </table>
            

        </div>

    )
};

export default ProductList;