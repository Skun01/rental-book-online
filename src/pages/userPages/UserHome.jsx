import {Link} from 'react-router-dom';
function UserHome(){
    return(
        <div>
            Hello from user home!
            <ul>
                <li>Move to <Link to="/login">Login</Link></li>
                <li>Move to <Link to="/register">Register</Link></li>
            </ul>
        </div>
    )
}

export default UserHome;