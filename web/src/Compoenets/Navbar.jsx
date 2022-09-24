import { Link } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from '../Context';
import axios from "axios"


const Navbar = () => {

    let { state, dispatch } = useContext(GlobalContext);


    const logouthandler = async () => {
        let baseUrl = "http://localhost:3000";
        try {
            let response = await axios.post(`${baseUrl}/logout`, {},

                {
                    withCredentials: true
                })
            console.log("response", response.data);

            dispatch({ type: "USER_LOGOUT", })


        } catch (e) {
            console.log("Error in api", e);

        }

    }


    return (
        <nav className='nav_2'>
            <div className="userName"> {state?.user?.firstName} {state?.user?.lastName}</div>
            <ul>

                {(state.isLogin === true) ?

                    <>
                        <li> <Link to="/">Home</Link> </li>
                        <li><Link to="/Profile">Profile</Link> </li>
                        <li><Link to="/login" onClick={logouthandler}>Logout</Link></li>
                    </>
                    :
                    null
                }

                {(state.isLogin === false) ?

                    <>
                        <li><Link to="/Signup">Signup</Link></li>
                        <li><Link to="/Login">Login</Link></li>
                    </>
                    :
                    null
                }

            </ul>
        </nav>
    )
}

export default Navbar