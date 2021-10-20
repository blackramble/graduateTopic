import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
const { useState, useRef } = require("react");

const Schedule = (props) => {
    const { val, productId, scheId, base64, handleChange } = props;
    const [valArr, setValArr] = useState(val);
    const [filename, setFilename] = useState('');
    const [img, setImg] = useState(null);
    const fileInput = useRef({});

    // console.log(base64);
    // 更改 行程說明(文字)
    const handleTextChange = (event) => {
      setValArr([event.target.value, null]);
    }
    // 更改 行程說明(檔案)
    const handleImgChanege = () => {
        setFilename(fileInput.current.files[0].name);
        sendImage();

        // 預覽圖片
        const file = fileInput.current.files[0]; // 取得檔案
        const fileReader = new FileReader(); // FileReader為瀏覽器內建類別，用途為讀取瀏覽器選中的檔案
        fileReader.addEventListener("load", fileLoad);
        fileReader.readAsDataURL(file); // 讀取完檔案後，變成URL

    }
    const fileLoad = e => {
        setImg(e.target.result); // 讀取到DataURL後，儲存在result裡面，指定為img
    };

    const sendImage = () => {
        let formData = new FormData();
        formData.append('scheImg', fileInput.current.files[0]);
        fetch(`http://localhost:8000/admin/product/create/upload/${productId}/${scheId+1}`, {
            method: 'post',
            body: formData,
        }).then(res => res.json())
          .then(result => {
            console.log(result);
          })
          .catch(error => console.log(error))
        
    }

    // 刪除圖片
    const deleteImg = () => {
        setFilename('');
        fileInput.current.value = '';
        fetch(`http://localhost:8000/admin/product/create/upload/${productId}/${scheId+1}`, {
            method: 'delete',
        }).then(res => res.json())
          .then(result => {
            console.log(result);
          })
          .catch(error => console.log(error))
        setImg('');
    }

    return (
        <div className="input-group row mt-2">
            <div className="col-10">
                <div className="d-flex flex-column">
                    <div>
                        <input type="text" className="form-control" defaultValue={val[0]}
                        onChange={handleTextChange}
                        onBlur={() => handleChange(valArr, scheId) }
                        aria-label="schedule" aria-describedby="addon-schedule"
                        />
                    </div>
                    <div className="col-6 d-flex justify-content-between mt-2">
                        <label htmlFor={`img${scheId}`} className="custom-file-upload btn-upload"><FontAwesomeIcon icon={faUpload} /> Image Upload</label>
                        <input type="file" id={`img${scheId}`} name={`sche${scheId}`} accept="image/jpeg"
                        ref={fileInput}
                        onChange={handleImgChanege}
                        />

                        <p>{filename}</p>
                        
                        { filename &&
                        <div className="deleteImg" onClick={deleteImg}>刪除</div>
                        }
                    </div>
                </div>

            </div>
            <div className="col-2">
                {/* 編輯視窗圖片 */}
                {
                  base64 && !img &&
                  <div className="card scheduleImg"><img src={base64.replace(/=+$/,'')} className="d-flex align-self-center" /></div>
                }


                { !base64 && !img && 
                  <div className="card scheduleImg"></div>
                }
                { !base64 && img &&
                  <div className="card scheduleImg"><img src={img} className="d-flex align-self-center" /></div>
                }

            </div>
            
        </div>
    )
};

export default Schedule;

