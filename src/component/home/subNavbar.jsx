import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressBook, faUser, faScroll, faStore, faChartLine } from '@fortawesome/free-solid-svg-icons'

const SubNavbar = (props) => {
    return (
        <div >
            <h3 className='p-3'>&nbsp;</h3>
            <div className='subNavbar'>
                <ul className="nav flex-column">
                    <li className="nav-item mt-2">
                        <div className="nav-link">
                            <Link to='/admin/chart'>
                                <div className='row justify-content-center'>
                                    <FontAwesomeIcon icon={faChartLine} color="#269a8f" size='lg' />
                                    <h5 className='bartext'>
                                        數據中心
                                    </h5>
                                </div>
                            </Link>
                        </div>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link">
                            <Link to='/admin/product'>
                                <div className='row justify-content-center'>
                                    <FontAwesomeIcon icon={faStore} color="#269a8f" size='lg' />
                                    <h5 className='bartext'>
                                        商品管理
                                    </h5>
                                </div>
                            </Link>
                        </div>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link">
                            <Link to='/admin/order'>
                                <div className='row justify-content-center'>
                                    <FontAwesomeIcon icon={faScroll} color="#269a8f" size='lg' />
                                    <h5 className='bartext'>
                                        訂單管理
                                    </h5>
                                </div>
                            </Link>
                        </div>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link">
                            <Link to='/admin/user'>
                                <div className='row justify-content-center'>
                                    <FontAwesomeIcon icon={faUser} color="#269a8f" size='lg' />
                                    <h5 className='bartext'>
                                        會員列表
                                    </h5>
                                </div>

                            </Link>
                        </div>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link">
                            <Link to='/admin/member'>
                                <div className='row justify-content-center'>
                                    <FontAwesomeIcon icon={faAddressBook} color="#269a8f" size='lg' />
                                    <h5 className='bartext'>
                                        管理員列表
                                    </h5>
                                </div>
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default SubNavbar;