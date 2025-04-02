import {Link} from 'react-router-dom';
function Register(){
    return(
        <div>
            Hello from register!;
            <div className="">Back to <Link to="/user">home</Link></div>
        </div>
    )
}

export default Register;