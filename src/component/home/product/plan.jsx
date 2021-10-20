const { useState } = require("react");

const Plan = (props) => {
    const {planIndex, productId, planId, name, brief, price, updatePlanInput} = props;

    // 方案名稱
    const [planName, setPlanName] = useState(name);
    const [planBrief, setPlanBrief] = useState(brief);
    const [planPrice, setPlanPrice] = useState(price);

    // 更改方案名稱
    const handlePlanNameChange = (event) => {
        setPlanName(event.target.value);
    }
    // 更改方案簡述
    const handlePlanBriefChange = (event) => {
        setPlanBrief(event.target.value);
    }
    // 更改方案價格
    const handlePlanPriceChange = (event) => {
        setPlanPrice(event.target.value);
    }

    // onblur 輸入欄位時，觸發更新 planInput 整個方案的資料
    const handleThisPlanChange = (planIndex, planName, planBrief, planPrice) => {
        updatePlanInput(planIndex, planName, planBrief, planPrice);
    }

    return (
        <div className="mx-3 mt-5 p-3 tRowshow">
            <div className="">
                <p><strong>方案 <span>{planIndex+1}</span></strong></p>
                <input type="hidden" name="productId" value={productId} />
                <input type="hidden" name="planId" value={planId} />
            </div>
            
            <div className="form-group">
                <label htmlFor="planName">方案名稱</label>
                <div className="input-group">
                    <input type="text" className="form-control" id="planName" name="planName"
                     value={planName}
                     onChange={handlePlanNameChange}
                     onBlur={ () => handleThisPlanChange(planIndex, planName, planBrief, planPrice) }
                     placeholder="請輸入方案名稱" 
                     aria-label="planName" aria-describedby="addon-planName" />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="brief">方案簡述</label>
                <textarea className="form-control" id="planBrief" name="planBrief"
                value={planBrief}
                onChange={handlePlanBriefChange}
                onBlur={ () => handleThisPlanChange(planIndex, planName, planBrief, planPrice) }
                placeholder="範例：
                此票券為水陸樂園通票
                每組包含：入園門票 1 張＋博覽館門票折價券"
                rows="5" required >
                </textarea>
            </div>

            <div className="form-group">
                <label htmlFor="price">方案價格</label>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">TWD $</span>
                    </div>
                    <input type="number" className="form-control" id="price" name="planPrice"
                    min="1" aria-label="amount"
                    value={planPrice}
                    onChange={handlePlanPriceChange}
                    onBlur={ () => handleThisPlanChange(planIndex, planName, planBrief, planPrice) }
                    placeholder="1000"
                    />
                </div>
            </div>
        </div>
    )
};

export default Plan;
