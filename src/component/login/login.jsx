import { useState } from "react";
import { useHistory } from "react-router-dom";
import logo from '../../img/SVG/logo.svg';

const Login = (props) => {
    const {handleLogin, handleSetLoginUser} = props;
    const history = useHistory();

    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsPending(true);

        // 連線資料庫
        const abortCont = new AbortController();
        fetch('http://localhost:8000/admin/login', {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                account,
                password,
            }),
            // signal: abortCont.signal
        })
        .then( (res) => res.json())
        .catch((err) => {
            console.log(err);
        })
        .then( (res) => {
            if (!res) {
                setErrorMsg('伺服器連線錯誤')
                setIsPending(false);
            } else if (res.code === 5) {
                setErrorMsg('請完整填寫帳號密碼');
                setIsPending(false);
            } else if (res.code === 60) {
                setErrorMsg('帳號尚未註冊');
                setIsPending(false);
            } else if (res.code === 61) {
                setErrorMsg('密碼錯誤');
                setIsPending(false);
            }  else if (res.code === 1) {
                handleLogin(true);
                
                // ---- 之後再新增 ----
                // handleSetLoginUser(res.nickname)
                // ---- 之後再新增 ----
                
                history.push('/');
            } else {
                setErrorMsg('系統錯誤');
                setIsPending(false);
            }
        })
    }

    return (
        <div className="loginPage">
            <div className="d-flex justify-content-center mt-5">
                <div className="d-flex align-items-center">
                    <div className="card frame" style={{width: '18rem'}}>
                        <img src={logo} className="card-img-top p-4" alt="Tway Logo" />
                        <div className="card-body">
                            <h3 className="text-center">後台登入</h3>
                            <form action="" onSubmit={ handleSubmit } className="mt-3">
                                <div className="form-group">
                                    <label className="card-text">帳號</label>&nbsp;&nbsp;
                                    <input type="text" required
                                    onChange={ (e) => setAccount(e.target.value) }
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label className="card-text">密碼 </label>&nbsp;&nbsp;
                                    <input type="password" required
                                    onChange={ (e) => setPassword(e.target.value) }
                                    />
                                </div>
                                <div className="form-group text-center">
                                    {!isPending && <button className="btn mysubmitBtn">登入</button>}
                                    {isPending && <button className="btn mysubmitBtn" disabled>登入中</button>}
                                </div>

                                <div className="form-group text-center">
                                    {errorMsg && <small style={{color: '#e86d4e'}}>{errorMsg}</small>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    
    
    );
};
export default Login;