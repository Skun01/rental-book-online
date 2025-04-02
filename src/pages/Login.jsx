import {Link} from 'react-router-dom'
function Login(){
    return(
        <div>
            Hello from Login!
            <div className="">Back to <Link to="/user">home</Link></div>
        </div>
    )
}

export default Login;