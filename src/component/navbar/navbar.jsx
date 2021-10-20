import { Link } from "react-router-dom";
import logo from '../../img/SVG/logo.svg';

const Navbar = (props) => {
  const { handleLogin } = props;

  const handleLogout = () => {
    handleLogin(false);
  }


  return (
    <nav className="navbar">
      <Link to="/">
        <div className='row justify-content-center'>
        <img src={logo} className="logo" alt="logo" />
        </div>
      </Link>
      <button className="btn mydeleteBtn" onClick={handleLogout}>
        <Link to="/admin"><div className="logoutBtn">登出</div></Link>
      </button>

    </nav>
  );
}

export default Navbar;