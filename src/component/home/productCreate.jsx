import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Schedule from "./product/schedule";
import Plan from "./product/plan";
import { type, destination, formatDate, formatJsonToStr } from "./product/format";

export const ProductCreate = (props) => {
    const { match } = props;
    const history = useHistory();

    const today = formatDate(Date.now());

    const [isPending, setIsPending] = useState(false);
    const [productName, setProductName] = useState('');
    const [typeSelect, setTypeSelect] = useState(0);
    const [locationSelect, setLocationSelect] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [brief, setBrief] = useState('');


    const handleProductNameChange = (event) => {
        setProductName(event.target.value);
    }
    const handleTypeSelectChange = (event) => {
        setTypeSelect(event.target.value);
    }
    const handleLocationSelectChange = (event) => {
        setLocationSelect(event.target.value);
    }
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    }
    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    }
    const handleBriefChange = (event) => {
        setBrief(event.target.value);
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsPending(true);

        let currentUrl = match.url;
        let aheadUrl = currentUrl.replace('p1', 'p2');

        // 提交新增第一頁
        const BASE_URL = "http://localhost:8000";
        // 連線資料庫
        fetch(`${BASE_URL}/admin/product/create/init`, {
            method: "POST",
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
                match.params.productId = res.data[0]['product_id'];
                history.push(`${aheadUrl}/${res.data[0]['product_id']+1}`);
            } else if (res.code === 2 ) {
                // 失敗
                alert('新增失敗 - 格式錯誤 (超過字數)');
                setIsPending(false);
            } else if (res.code === 3) {
                // 失敗
                alert('新增失敗 - 格式錯誤 (資料格式錯誤)');
                setIsPending(false);
            } else  {
                // 失敗
                alert('新增失敗');
                console.log(res);
                setIsPending(false);
            }
        })
        .catch((err) => {
            alert('新增失敗 - 連線錯誤');
            setIsPending(false);
        })
    }

    return (
        <div>
            <h3 className='rowSpace p-3'>商品管理 / 新增商品</h3>
            <form action="" onSubmit={handleFormSubmit} className="memberTable productForm mr-3">
                <div className="mx-auto px-5 py-4">
                    <div className="form-group">
                        <label htmlFor="productName">商品名稱（限 100 字）</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" value={productName} onChange={handleProductNameChange} aria-label="productName" aria-describedby="addon-productName" required />
                            <div className="input-group-append">
                                <span className="input-group-text" id="basic-addon2"> {productName.length} / 100</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="mr-3" htmlFor="typeSelect">商品類別</label>
                        <select className="form-control" id="typeSelect" name="typeSelect" onClick={handleTypeSelectChange} aria-label="type select" required >
                            <option disabled>選擇商品類別</option>
                            { type.map((opt, index) => {
                                return (
                                    (index === 0)
                                    ? <option value={index+1} key={index+1} defaultValue>{opt}</option>
                                    : <option value={index+1} key={index+1}>{opt}</option>
                                ) })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="mr-3" htmlFor="locationSelect">行程地點</label>
                        <select className="form-control" id="locationSelect" name="locationSelect" onChange={handleLocationSelectChange} aria-label="location select" required >
                        <option disabled>選擇地點</option>
                        { destination.map((opt, index) => {
                            return (
                                (index === 0)
                                ? <option value={index+1} key={index+1} defaultValue>{opt}</option>
                                : <option value={index+1} key={index+1}>{opt}</option>
                            )
                        }) }
                        </select>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col">
                                <label htmlFor="startDate">最早可預訂日</label>
                                <input type="date" className="form-control" id="startDate" name="startDate" value={startDate} min={today} onChange={handleStartDateChange} />

                            </div>
                            <div className="col">
                                <label htmlFor="endDate">最終可預訂日</label>
                                <input type="date" className="form-control" id="endDate" name="endDate" value={endDate} min={startDate} onChange={handleEndDateChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="brief">商品簡述</label>
                        <textarea className="form-control" id="brief" name="brief" value={brief} onChange={handleBriefChange} rows="5" required ></textarea>
                    </div>

                    <div className="form-group d-flex justify-content-center ">
                        <Link to="/admin/product"><button type="button" className="btn cancelBtn mr-2">取消</button></Link>
                        {!isPending && <button type="submit" className="btn mysubmitBtn">下一步</button>}
                        {isPending && <button type="submit" className="btn mysubmitBtn" disabled>儲存中</button>}
                    </div>
                </div>
                
            </form>
        </div>
    )
}

export const ProductCreatePageTwo = (props) => {
    const { match } = props;

    // 路徑
    let currentUrl = match.url;
    let aheadUrl = currentUrl.replace('p2', 'p3');

    const [isPending, setIsPending] = useState(false);

    // scheduleNum 控制 scheduleInput 顯示欄位 (最多5欄)
    const [scheduleNum, setScheduleNum] = useState(0);
    const [scheduleInput, setScheduleInput] = useState([]);

    // schedule 元件 上傳檔案資料
    const [imgFile, setImgFile] = useState([null, null, null, null, null]);   // 影像

    // 控制 +鍵 顯示
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    const [productId, setProductId] = useState(match.params.id);
    const [description, setDescription] = useState('');
    const [meetPlace, setMeetPlace] = useState('');

    const history = useHistory();

    // 行程說明 + 鍵控制 // scheduleNum < 5 可以按 + 鍵，到 5 button 改 disabled
    const addScheduleNum = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (scheduleNum < 4) {
            setScheduleNum(scheduleNum + 1);
            addScheduleInput(scheduleInput);
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
        // newInputs 存放資料：[行程說明, 上傳檔案資料]
        newInputs.push(['', null]);
        setScheduleInput(newInputs);
    }

    // + 鍵 button 改 disabled
    const changeDisabled = () => {
        setIsBtnDisabled(true);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    }

    const handleMeetPlaceChange = (event) => {
        setMeetPlace(event.target.value);
    }

    // 當 Schedule 元件 text input 更改，觸發更改 scheduleInput["text", 後端回傳 imageBase64]
    const handleScheduleInputChange = (val, scheId) => {
        scheduleInput[scheId] = val;
    }

    const BASE_URL = "http://localhost:8000";
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsPending(true);

        // 提交新增第二頁
        // 連線資料庫
        fetch(`${BASE_URL}/admin/product/create/detail`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                product_id: productId,
                description: description,
                meet_place: meetPlace,
                schedule: scheduleInput,
            }),
        })
        .then( (res) => res.json())
        .then( (res) => {
            if (res.code === 1) {
                // 成功
                setIsPending(false);
                history.push(aheadUrl);
            } else {
                // 失敗
                alert('新增失敗');
                setIsPending(false);
                console.log(res);
            }
        })
        .catch((err) => {
            alert('新增失敗 - 連線錯誤');
            setIsPending(false);
        })
    }

    return (
        <div>
            <h3 className='rowSpace p-3'>商品管理 / 新增商品 / 商品說明</h3>
            <form action="" onSubmit={handleFormSubmit} className="memberTable productForm mr-3">
                <div className="mx-auto px-5 py-4">
                    <div className="form-group">
                        <strong>商品編號：# { productId }</strong>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">商品說明</label>
                        <textarea className="form-control" id="description" name="description" value={description} onChange={handleDescriptionChange} rows="5"></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="meetPlace">兌換地點</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" id={meetPlace} value={meetPlace} onChange={handleMeetPlaceChange} aria-label="meetPlace" aria-describedby="addon-meetPlace" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="schedule" className="mr-3">行程說明</label>
                        {/* 以前叫 + 鍵  */}
                        {!isBtnDisabled && <button type="button" className="btn myaddBtn btn-sm" onClick={addScheduleNum}>新增</button>}
                        {isBtnDisabled && <button type="button" className="btn myaddBtn btn-sm" disabled>新增</button>}

                        {scheduleInput && scheduleInput.map((elem , index) => <Schedule key={index} productId={productId} scheId={index} val={elem} handleChange={handleScheduleInputChange} />)}
                    </div>

                    <div className="form-group d-flex justify-content-center mt-4">
                        {!isPending && <button type="submit" className="btn mysubmitBtn float-right">下一步</button>}
                        {isPending && <button type="submit" className="btn mysubmitBtn float-right" disabled>儲存中</button>}
                    </div>
                </div>
            </form>
        </div>
            
    )
}

export const ProductCreatePageThree = (props) => {
    const { match } = props;
    // 路徑
    const history = useHistory();
    let currentUrl = match.url;
    let lastUrl = currentUrl.replace('p3', 'p2');
    let aheadUrl = '/admin/product';

    const [isPending, setIsPending] = useState(false);
    const [productId, setProductId] = useState(match.params.id);

    // planNum 控制 planInput 顯示欄位 (最多5欄)
    const [planNum, setPlanNum] = useState(1);
    const [planInput, setPlanInput] = useState([{
                                        product_id: productId,
                                        plan_index: 1,
                                        plan_name: '',
                                        brief: '',
                                        price: 1,
                                    }]);
    // 控制 新增方案按鈕 顯示
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

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
        console.log(inputs);
        const insertContent = {
            product_id: inputs[0].product_id,
            plan_index: inputs.length+1,
            // plan_id: undefined,
            plan_name: '',
            brief: '',
            price: 1,
        };
        const newInputs = [...inputs, insertContent];
        setPlanInput(newInputs);
    }

    // button 新增方案 改 disabled
    const changeDisabled = () => {
        setIsBtnDisabled(true);
    }

    // 更新 planInput 資料
    const updatePlanInput = (planIndex, planName, planBrief, planPrice) => {
        // console.log('planIndex: ', planIndex);
        let tempArr = planInput[planIndex];
        tempArr.plan_name = planName;
        tempArr.brief = planBrief;
        tempArr.price = planPrice;
        setPlanInput(planInput);
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsPending(true);
        changeDisabled();

        // post 五個方案
        // 去掉 key plan_id, plan_index
        // planInput[i] 沒有資料放 null
        let plans = [];
        for (let i = 0; i < 5; i++) {
            if (planInput[i]) {
                delete planInput[i].plan_id;
                delete planInput[i].plan_index;
                plans[i] = planInput[i];
            } else {
                plans[i] = null;
            }
        }

        // 提交新增第三頁
        const BASE_URL = "http://localhost:8000";
        // 連線資料庫
        fetch(`${BASE_URL}/admin/product/create/plan`, {
            method: "POST",
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
                alert('新增成功');
                history.push(aheadUrl);
            } else {
                // 失敗
                alert('新增失敗');
                setIsPending(false);
                console.log(res.msg);
            }
        })
        .catch((err) => {
            alert('修改失敗 - 連線錯誤');
            setIsPending(false);
        })
    }

    return (
        <div>
            <div className="d-flex">
                <h3 className='rowSpace p-3'>商品管理 / 新增商品 / 商品說明 / 方案</h3>
                <div className="d-flex align-items-center">
                    {!isBtnDisabled && <button type="button" className="btn myaddBtn btn-sm" onClick={addPlanNum}>新增方案</button>}
                    {isBtnDisabled && <button type="button" className="btn myaddBtn btn-sm" disabled>新增方案</button>}
                </div>
            </div>
            <div className="memberTable productForm mr-3">
                { !planInput && <p>資料載入中...</p> }
                { planInput &&
                    <form action="" onSubmit={handleFormSubmit}>
                        {planInput && planInput.map((elem, index) => 
                            <Plan key={index}
                                planIndex={index}
                                productId={elem.product_id}
                                name={elem.plan_name}
                                brief={elem.brief}
                                price={elem.price}
                                updatePlanInput={updatePlanInput}
                            />
                       )}

                        <div className="form-group d-flex justify-content-center mt-4">
                            {!isPending && <button type="submit" className="btn mysubmitBtn">儲存</button>}
                            {isPending && <button type="submit" className="btn mysubmitBtn" disabled>儲存中</button>}
                        </div>

                    </form>
                }
            </div>
        </div>
    )
}