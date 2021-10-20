import { Link } from "react-router-dom";
import { formatType, formatDestination } from './product/format';

const ProductItem = (props) => {
    const { product, productMatch } = props;

    let { product_id, product_name, type_id, destination_id, sales, start_date, end_date } = product;

    // 轉換商品類型
    let itemType = formatType(type_id);

    // 轉換地點
    let destination = formatDestination(destination_id);

    return (
        <tr className='tRowshow'>
            <th className="cardHead pl-4 pr-2" scope="row">#{product_id}</th>
            <td className="cardBody col-1">
                <span className="d-inline-block text-truncate" style={{maxWidth: '350px'}}>{product_name}</span><br/>
                <span className="badge badge-pill badge-mainColor">{destination}</span>
            </td>
            <td className="cardBody text-center">{itemType}</td>
            <td className="cardBody text-center">{start_date}</td>
            <td className="cardBody text-center">{end_date}</td>
            <td className="cardBody text-center">{sales}</td>
            <td className="cardTail text-center">
                <Link to={`${productMatch.url}/edit/${product_id}/p1`}>
                    <button className="p-2 btn myeditBtn">編輯</button>
                </Link>
            </td>
        </tr>
    )
}

export default ProductItem;