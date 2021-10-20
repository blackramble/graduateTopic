// 轉換日期格式
export const formatDate = (date) => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = ((newDate.getMonth()+1).toString()).padStart(2, 0);
    let day = (newDate.getDate().toString()).padStart(2, 0);
    newDate = year + '-' + month + '-' + day;
    return newDate;
}

// 轉換商品類型
export const formatType = (type_id) => {
    switch (type_id) {
        case 1:
            return '熱門票券';
        case 2:
            return '一日/多日行';
        case 3:
            return '住宿';
        default:
            return '其他';
    }
}

// 轉換地點
export const formatDestination = (destination_id) => {
    switch (destination_id) {
        case 1:
            return '台北';
        case 2:
            return '新北';
        case 3:
            return '桃園';
        case 4:
            return '台中';
        case 5:
            return '台南';
        case 6:
            return '高雄';
        case 7:
            return '基隆';
        case 8:
            return '新竹';
        case 9:
            return '苗栗';
        case 10:
            return '彰化';
        case 11:
            return '南投';
        case 12:
            return '雲林';
        case 13:
            return '嘉義';
        case 14:
            return '屏東';
        case 15:
            return '宜蘭';
        case 16:
            return '花蓮';
        case 17:
            return '台東';
        case 18:
            return '澎湖';
        case 19:
            return '金門';
        case 20:
            return '馬祖';
        default:
            return '其他地區';
    }
}

export const type = ['景點門票', '一日/多日行', '住宿'];

export const destination = [
   '台北',
   '新北',
   '桃園',
   '台中',
   '台南',
   '高雄',
   '基隆',
   '新竹',
   '苗栗',
   '彰化',
   '南投',
   '雲林',
   '嘉義',
   '屏東',
   '宜蘭',
   '花蓮',
   '台東',
   '澎湖',
   '金門',
   '馬祖',
];

export const formatJsonToStr = (json) => {
    let str = '';
    let jsonLength = Object.keys(json).length - 1;
    for (let item in json) {
        if ( item == jsonLength ) {
            str += (json[item]);
        } else {
            str += (json[item] + '\r\n');
        }
    }
    return str;
};