import { useContext } from "react";
import { GlobalContext } from '../Context';


const Profile = () => {

    let { state, dispatch } = useContext(GlobalContext);





    return (
        <div>
            {

                (state.user === null) ?
                    <div> Loading... </div>
                    :
                    <div>
                        _id: {state.user?._id}
                        <br />
                        name: {state.user?.firstName} {state.user?.lastName}
                        <br />
                        email: {state.user?.email}
                        <br />
                    </div>
            }

        </div>
    );
}

export default Profile