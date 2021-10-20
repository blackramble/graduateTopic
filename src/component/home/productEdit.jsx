import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Schedule from "./product/schedule";
import Plan from "./product/plan";
import { type, destination, formatDate, formatJsonToStr } from "./product/format";

export const ProductEdit = (props) => {
    const { match } = props;
    const today = formatDate(Date.now());

    const [isPending, setIsPending] = useState(true);
    const [isRemoving, setIsRemoving] = useState(false);
    
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [productName, setProductName] = useState('');
    const [typeSelect, setTypeSelect] = useState(0);
    const [locationSelect, setLocationSelect] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [brief, setBrief] = useState('');
    const [enable, setEnable] = useState(1);

    // 表單更改狀態
    const [isModified, setIsModified] = useState(false);
    const handleStatus = () => {
        if (!isModified) {
            setIsModified(true);
        } else {
            return;
        }
    }

    const history = useHistory();
    const setAllInput = (data) => {
        setProductName(data.product_name);
        setTypeSelect(data.type_id);
        setLocationSelect(data.destination_id);
        setStartDate(data.start_date);
        setEndDate(data.end_date);
        setBrief(data.brief);
        setEnable(data.enable);
    }

    useEffect(() => {
        const abortCont = new AbortController();
        let url = `http://localhost:8000/admin/product/${match.params.productId}`;
        fetch(url, { signal: abortCont.signal })
            .then((res) => {
                if(!res.ok) {
                throw Error('Could not fetch the data for that research');
                }
                return res.json();
            })
            .then((result) => {
                setData(result.data);
                setAllInput(result.data);
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
    }, []);

    const handleProductNameChange = (event) => {
        setProductName(event.target.value);
        handleStatus();
    }
    const handleTypeSelectChange = (event) => {
        setTypeSelect(event.target.value);
        handleStatus();
    }
    const handleLocationSelectChange = (event) => {
        setLocationSelect(event.target.value);
        handleStatus();
    }
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        handleStatus();
    }
    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        handleStatus();
    }
    const handleBriefChange = (event) => {
        setBrief(event.target.value);
        handleStatus();
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsPending(true);

        let currentUrl = match.url;
        let aheadUrl = currentUrl.replace('p1', 'p2');

        if (isModified) {
            // 提交修改第一頁
            const BASE_URL = "http://localhost:8000";
            // 連線資料庫
            fetch(`${BASE_URL}/admin/product/edit/${match.params.productId}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    productName,
                    typeSelect,
                    locationSelect,
                    startDate,
                    endDate,
                    brief
                }),
            })
            .then( (res) => res.json())
            .then( (res) => {
                if (res.code === 1) {
                    // 成功
                    alert('修改成功');
                    history.push(aheadUrl);
                } else {
                    // 失敗
                    alert('修改失敗');
                    setIsPending(false);
                }
            })
            .catch((err) => {
                alert('修改失敗 - 連線錯誤');
                setIsPending(false);
            })
        } else {
            // 直接前往第二頁
            history.push(aheadUrl);
        }
    }

    const archiveItem = async (event) => {
        event.preventDefault();
        setIsRemoving(true);
        
        const BASE_URL = "http://localhost:8000";
        fetch(`${BASE_URL}/admin/product/edit/status/${match.params.productId}/0`, {
            method: "PUT",
        })
        .then( (res) => res.json())
        .then( (res) => {
            if (res.code === 1) {
                // 成功
                alert('商品已下架');
                history.push('/admin/product');
            } else {
                // 失敗
                alert('下架失敗');
                setIsPending(false);
            }
        })
        .catch((err) => {
            alert('下架失敗 - 連線錯誤');
            setIsPending(false);
        })
    }

    const launchItem = async (event) => {
        event.preventDefault();
        setIsRemoving(true);
        
        const BASE_URL = "http://localhost:8000";
        fetch(`${BASE_URL}/admin/product/edit/status/${match.params.productId}/1`, {
            method: "PUT",
        })
        .then( (res) => res.json())
        .then( (res) => {
            if (res.code === 1) {
                // 成功
                alert('商品已上架');
                history.push('/admin/product');
            } else {
                // 失敗
                alert('上架失敗');
                setIsPending(false);
            }
        })
        .catch((err) => {
            alert('上架失敗 - 連線錯誤');
            setIsPending(false);
        })
    }


    return (
        <div>
            <h3 className="rowSpace p-3">商品管理 / 編輯商品</h3>
            <div className="memberTable productForm mr-3">
                <div className="mx-auto px-5 py-4">
                    {error && 
                        <div className="mx-auto">
                            <p>載入發生錯誤了，要回商品頁嗎？</p>
                            <Link to="/admin/product">回到商品頁</Link>
                        </div>
                    }

                    {!data && <p>資料載入中...</p>}
                    {data &&
                        <form action="" onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="productName">商品名稱（限 100 字）</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" value={productName} onChange={handleProductNameChange} aria-label="productName" aria-describedby="addon-productName" required />
                                    <div className="input-group-append">
                                        <span className="input-group-text" id="basic-addon2"> {productName.length} / 100</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="mr-3" htmlFor="typeSelect">商品類別</label>
                                {
                                    (data.sales === 0)
                                    ? <select className="form-control" id="typeSelect" name="typeSelect" onClick={handleTypeSelectChange} aria-label="type select" required >
                                        <option disabled>選擇商品類別</option>
                                        { type.map((opt, index) => {
                                            return (
                                                (typeSelect === index+1)
                                                ? <option value={index+1} key={index+1} selected>{opt}</option>
                                                : <option value={index+1} key={index+1}>{opt}</option>
                                            ) })
                                        }
                                      </select>
                                    : <select className="form-control" id="typeSelect" name="typeSelect" onClick={handleTypeSelectChange} aria-label="type select" required disabled="disabled" >
                                        <option disabled>選擇商品類別</option>
                                        { type.map((opt, index) => {
                                            return (
                                                (typeSelect === index+1)
                                                ? <option value={index+1} key={index+1} selected>{opt}</option>
                                                : <option value={index+1} key={index+1}>{opt}</option>
                                            ) })
                                        }
                                      </select>
                                }
                            </div>

                            <div className="form-group">
                                <label className="mr-3" htmlFor="locationSelect">行程地點</label>
                                {
                                    (data.sales === 0)
                                    ? <select className="form-control" id="locationSelect" name="locationSelect" onChange={handleLocationSelectChange} aria-label="location select" required >
                                        <option disabled>選擇地點</option>
                                        { destination.map((opt, index) => {
                                            return (
                                                (locationSelect === index+1)
                                                ? <option value={index+1} key={index+1} selected>{opt}</option>
                                                : <option value={index+1} key={index+1}>{opt}</option>
                                            )
                                        }) }
                                      </select>
                                    : <select className="form-control" id="locationSelect" name="locationSelect" onChange={handleLocationSelectChange} aria-label="location select" required disabled="disabled" >
                                        <option disabled>選擇地點</option>
                                        { destination.map((opt, index) => {
                                            return (
                                                (locationSelect === index+1)
                                                ? <option value={index+1} key={index+1} selected>{opt}</option>
                                                : <option value={index+1} key={index+1}>{opt}</option>
                                            )
                                        }) }
                                      </select>
                                }
                                
                                
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor="startDate">最早可預訂日</label>
                                        {(data.sales === 0)
                                        ? <input type="date" className="form-control" id="startDate" name="startDate" value={startDate} onChange={handleStartDateChange} />
                                        : <input type="date" className="form-control" id="startDate" name="startDate" value={startDate} disabled onChange={handleStartDateChange} />
                                        }
                                        
                                    </div>
                                    <div className="col">
                                        <label htmlFor="endDate">最終可預訂日</label>
                                        {(data.sales === 0)
                                        ? <input type="date" className="form-control" id="endDate" name="endDate" value={endDate} min={startDate} onChange={handleEndDateChange} required />
                                        : <input type="date" className="form-control" id="endDate" name="endDate" value={endDate} min={startDate} disabled onChange={handleEndDateChange} required />
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="form-group">
                                    <label htmlFor="brief">商品簡述</label>
                                    <textarea className="form-control" id="brief" name="brief" value={brief} onChange={handleBriefChange} rows="5" required ></textarea>
                                </div>
                            </div>

                            <div className="form-group mt-4 d-flex justify-content-center">
                                {/* 下架按鈕 */}
                                { (enable === 1) && !isRemoving &&
                                  <button type="button" onClick={archiveItem} className="btn mydeleteBtn mr-2">下架</button>
                                }
                                { (enable === 1) && isRemoving &&
                                  <button type="button" className="btn mydeleteBtn mr-2" disabled>處理中</button>
                                }
                                {/* 上架按鈕 */}
                                { (enable === 0) && !isRemoving &&
                                  <button type="button" onClick={launchItem} className="btn mydeleteBtn mr-2">上架</button>
                                }
                                { (enable === 0) && isRemoving &&
                                  <button type="button" className="btn mydeleteBtn mr-2" disabled>處理中</button>
                                }

                                {isPending && isRemoving && <button type="submit" className="btn mysubmitBtn" disabled>下一步</button>}
                                {!isPending && isRemoving && <button type="submit" className="btn mysubmitBtn" disabled>下一步</button>}
                                {!isPending && !isRemoving && <button type="submit" className="btn mysubmitBtn">下一步</button>}
                                {isPending && !isRemoving && <button type="submit" className="btn mysubmitBtn" disabled>載入中</button>}
                            </div>
                        </form>
                    }
                </div>
            </div>
        </div>
    )
}

export const ProductEditPageTwo = (props) => {
    const { match } = props;

    // 路徑
    let currentUrl = match.url;
    let lastUrl = currentUrl.replace('p2', 'p1');
    let aheadUrl = currentUrl.replace('p2', 'p3');

    const [isPending, setIsPending] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    // scheduleNum 控制 scheduleInput 顯示欄位 (最多5欄)
    const [scheduleNum, setScheduleNum] = useState(0);
    const [scheduleInput, setScheduleInput] = useState(null);
    const [imgbase64, setImgbase64] = useState(null);

    // 控制 +鍵 顯示
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    const [description, setDescription] = useState('');
    const [meetPlace, setMeetPlace] = useState('');

    // 表單更改狀態
    const [isModified, setIsModified] = useState(false);
    const handleStatus = () => {
        if (!isModified) {
            setIsModified(true);
        } else {
            return;
        }
    }

    const history = useHistory();

    // 資料庫資料放進 state
    const handleAllInput = (data) => {
        // 商品說明欄
        setDescription(data.description);
        // 兌換地點欄
        setMeetPlace(data.meet_place);
        // 行程說明欄
        const inputArr = handleScheduleInput(data.schedule);
        setScheduleInput(inputArr);
        // 根據拿到的行程說明資料筆數，設定 scheduleNum
        setScheduleNum(inputArr.length);
    }

    // fetch 到的行程說明資料轉成陣列
    const handleScheduleInput = (scheduleData) => {
        let inputArr = [];
        for (let data in scheduleData) {
            inputArr[data] = scheduleData[data];
        }
        return inputArr;
    }

    useEffect(() => {
        const abortCont = new AbortController();
        let url = `http://localhost:8000/admin/product/detail/${match.params.productId}`;
        fetch(url, { signal: abortCont.signal })
            .then((res) => {
                if(!res.ok) {
                throw Error('Could not fetch the data for that research');
                }
                return res.json();
            })
            .then((result) => {
                // console.log(result.data.schedule[0][1]);
                result.data.description = formatJsonToStr(result.data.description);
                handleAllInput(result.data);
                setData(result.data);
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
    }, []);

    // 行程說明 + 鍵控制 // scheduleNum < 5 可以按 + 鍵，到 5 button 改 disabled
    const addScheduleNum = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (scheduleNum < 4) {
            setScheduleNum(scheduleNum + 1);
            addScheduleInput(scheduleInput);
            console.log(scheduleInput);
        } else if (scheduleNum === 4) {
            addScheduleInput(scheduleInput);
            changeDisabled();
        } else {
            return;
        }
    }

    // 新增 scheduleInput 的輸入欄位
    const addScheduleInput = (inputs) => {
        const newInputs = inputs;
        newInputs.push(['', null]);
        setScheduleInput(newInputs);
    }

    // + 鍵 button 改 disabled
    const changeDisabled = () => {
        setIsBtnDisabled(true);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        handleStatus();
    }

    const handleMeetPlaceChange = (event) => {
        setMeetPlace(event.target.value);
        handleStatus();
    }

    // 當 Schedule 元件 text 更改，觸發更改 scheduleInput["text", image]
    const handleScheduleInputChange = (val, scheId) => {
        let tempVal = scheduleInput;
        tempVal[scheId][0] = val;
        setScheduleInput(tempVal);
        handleStatus();
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsPending(true);

        // scheduleInput
        console.log(scheduleInput);

        if (isModified) {
            // 提交修改第二頁
            const BASE_URL = "http://localhost:8000";
            // 連線資料庫
            fetch(`${BASE_URL}/admin/product/edit/detail/${match.params.productId}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    description,
                    meetPlace,
                    scheduleInput,
                }),
            })
            .then( (res) => res.json())
            .then( (res) => {
                if (res.code === 1) {
                    // 成功
                    alert('修改成功');
                    history.push(aheadUrl);
                } else {
                    // 失敗
                    alert('修改失敗');
                    setIsPending(false);
                }
            })
            .catch((err) => {
                alert('修改失敗 - 連線錯誤');
                setIsPending(false);
            })
        } else {
            history.push(aheadUrl);
        }
    }


    return (
        <div>
            <h3 className="rowSpace p-3">商品管理 / 編輯商品 / 商品說明</h3>
            <div className="memberTable productForm mr-3">
                <div className="mx-auto px-5 py-4">
                    {error && 
                        <div>
                            <p>載入發生錯誤了，要回商品頁嗎？</p>
                            <Link to="/admin/product">回到商品頁</Link>
                        </div>
                    }

                    {!data && <p>資料載入中...</p>}
                    {data &&
                        <form action="" onSubmit={handleFormSubmit}>
                            <input type="hidden" value={data.product_id}/>

                            <div className="form-group">
                                <label htmlFor="description">商品說明</label>
                                <textarea className="form-control" id="description" name="description" value={description} onChange={handleDescriptionChange} rows="5"></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="meetPlace">兌換地點</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" id={meetPlace} value={meetPlace} onChange={handleMeetPlaceChange} aria-label="meetPlace" aria-describedby="addon-meetPlace" required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="schedule" className="mr-3">行程說明</label>
                                {/* 以前叫 + 鍵  */}
                                {!isBtnDisabled && <button type="button" className="btn myaddBtn btn-sm" onClick={addScheduleNum}>新增</button>}
                                {isBtnDisabled && <button type="button" className="btn myaddBtn btn-sm" disabled>新增</button>}

                                {scheduleInput && scheduleInput.map((elem , index) => <Schedule key={index} scheId={index} val={elem} base64={elem[1]} handleChange={handleScheduleInputChange} />)}
                            </div>

                            <div className="form-group mt-4 d-flex justify-content-center">
                                <Link to={lastUrl}><button type="button" className="btn btnLastStep">上一步</button></Link>
                                {!isPending && <button type="submit" className="btn mysubmitBtn float-right">下一步</button>}
                                {isPending && <button type="submit" className="btn mysubmitBtn float-right" disabled>載入中</button>}
                            </div>
                        </form>
                    }
                </div>
            </div>
    </div>
    )
}

export const ProductEditPageThree = (props) => {
    const { match } = props;
    // 路徑
    const history = useHistory();
    let currentUrl = match.url;
    let lastUrl = currentUrl.replace('p3', 'p2');
    let aheadUrl = '/admin/product';

    const [isPending, setIsPending] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    // planNum 控制 planInput 顯示欄位 (最多5欄)
    const [planNum, setPlanNum] = useState(0);
    const [planInput, setPlanInput] = useState(null);
    // 控制 新增方案鍵 顯示
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    // 表單更改狀態
    const [isModified, setIsModified] = useState(false);
    const handleStatus = () => {
        if (!isModified) {
            setIsModified(true);
        } else {
            return;
        }
    }

    // 資料庫資料放進 state
    const handleAllInput = (data) => {
        setPlanInput(data);
        setPlanNum(Object.keys(data).length);
    }

    useEffect(() => {
        const abortCont = new AbortController();
        let url = `http://localhost:8000/admin/product/plan/${match.params.productId}`;
        fetch(url, { signal: abortCont.signal })
            .then((res) => {
                if(!res.ok) {
                throw Error('Could not fetch the data for that research');
                }
                return res.json();
            })
            .then((result) => {
                handleAllInput(result.data);
                setData(result.data);
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
    }, []);

    // 新增方案 鍵控制 // planNum < 5 可以按 + 鍵，到 5 button 改 disabled
    const addPlanNum = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (planNum < 4) {
            setPlanNum(planNum + 1);
            addPlanInput(planInput);
        } else if (planNum === 4) {
            addPlanInput(planInput);
            changeDisabled();
        } else {
            return;
        }
    }

    // 新增 planInput 的輸入欄位
    const addPlanInput = (inputs) => {
        const newInputs = inputs;
        const productId = inputs[0].product_id;
        const newPlanId = undefined;
        const insertContent = {
            product_id: productId,
            plan_id: newPlanId,
            plan_name: '',
            brief: '',
            price: 1,
        };
        newInputs.push(insertContent);
        setPlanInput(newInputs);
    }

    // button 新增方案 改 disabled
    const changeDisabled = () => {
        setIsBtnDisabled(true);
    }

    // 更新 planInput 資料
    const updatePlanInput = (planIndex, planName, planBrief, planPrice) => {
        console.log('planIndex: ', planIndex);
        let tempArr = planInput[planIndex];
        tempArr.plan_name = planName;
        tempArr.brief = planBrief;
        tempArr.price = planPrice;
        setPlanInput(planInput);
        handleStatus();
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsPending(true);

        // put 五個方案，沒有放 null
        let plans = [];
        for (let i = 0; i < 5; i++) {
            if (planInput[i]) {
                plans[i] = planInput[i];
            } else {
                plans[i] = null;
            }
        }

        console.log(plans);

        if (isModified) {
            // 提交修改第三頁
            const BASE_URL = "http://localhost:8000";
            // 連線資料庫
            fetch(`${BASE_URL}/admin/product/edit/plan/${match.params.productId}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    plans
                }),
            })
            .then( (res) => res.json())
            .then( (res) => {
                if (res.code === 1) {
                    // 成功
                    alert('修改成功');
                    history.push(aheadUrl);
                } else {
                    // 失敗
                    alert('修改失敗');
                    setIsPending(false);
                    console.log(res.msg);
                }
            })
            .catch((err) => {
                alert('修改失敗 - 連線錯誤');
                setIsPending(false);
            })
        } else {
            history.push(aheadUrl);
        }
    }

    return (
        <div>
            <div className="d-flex">
                <h3 className='rowSpace p-3'>商品管理 / 修改商品 / 商品說明 / 方案</h3>
                <div className="d-flex align-items-center">
                    {!isBtnDisabled && <button type="button" className="btn myaddBtn btn-sm" onClick={addPlanNum}>新增方案</button>}
                    {isBtnDisabled && <button type="button" className="btn myaddBtn btn-sm" disabled>新增方案</button>}
                </div>

            </div>
            <div className="memberTable productForm mr-3">
                {error && 
                    <div>
                        <p>資料載入錯誤</p>
                        <Link to="/admin/product">回到商品頁</Link>
                    </div>
                }

                {!data && <p>Loading...</p>}
                {data &&
                <form action="" onSubmit={handleFormSubmit}>

                    {planInput && planInput.map((elem, index) => <Plan key={index}
                    planIndex={index}
                    productId={elem.product_id}
                    planId={elem.plan_id}
                    name={elem.plan_name}
                    brief={elem.brief}
                    price={elem.price}
                    updatePlanInput={updatePlanInput}
                    />)}

                    <div className="form-group mt-4 d-flex justify-content-center">
                        <Link to={lastUrl}><button type="button" className="btn btnLastStep">上一步</button></Link>
                        {!isPending && <button type="submit" className="btn mysubmitBtn">儲存</button>}
                        {isPending && <button type="submit" className="btn mysubmitBtn" disabled>儲存中...</button>}
                    </div>

                </form>
                }
            </div>
        </div>
    )
}