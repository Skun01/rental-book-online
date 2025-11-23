import { useState } from "react" 
import { BookOpen, EyeOff, Eye, Loader, LogIn, Home } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Login({ onClose, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const navigate = useNavigate()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      email: "",
      password: "",
      general: "",
    });
    
    // Validate fields
    let hasErrors = false;
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Hãy nhập email";
      hasErrors = true;
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = "Email không hợp lệ";
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = "Hãy nhập mật khẩu";
      hasErrors = true;
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 kí tự";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("http://localhost:8080/api/v1/auth/login", {
        email: trimmedEmail,
        password: password,
      })
      .then(res => {
        const { accessToken, user } = res.data.data;
        
        console.log("User Data:", user);
        console.log("Role Name:", user?.role?.name); 

        login(user, accessToken);

        if(user?.role?.name === "SUPER_ADMIN"){
          setTimeout(() => {
            navigate('/admin');
          }, 100);
        } else {
          onClose();
        }
      });
      
    } catch (err) {
      console.log(err);
      setErrors({
        ...newErrors,
        general: "Email hoặc mật khẩu không chính xác",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal-container">
        {/* Left Side - Cover Image */}
        <div className="auth-cover">
          <div className="logo-container">
            <div className="logo">
              <div className="logo-icon">
                <BookOpen size={40} strokeWidth={2} />
              </div>
              <div className="logo-text">
                <span>Thuê sách</span>
                <span className="logo-subtitle">Xin kính chào bạn!</span>
              </div>
            </div>
          </div>
          <div className="cover-image">
            <img src="/auth1.jpg" alt="Books" />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-container">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>

          <div className="auth-content auth-login">
            <h1 className="auth-title">Đăng nhập</h1>
            <p className="auth-subtitle">
              Nếu bạn chưa có tài khoản, <a href="#" onClick={(e) => { e.preventDefault(); switchToRegister(); }} className="text-link">đăng ký ngay</a>
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              {errors.general && <div className="auth-error">{errors.general}</div>}

              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "input-error" : ""}
                  />
                  <button 
                    type="button" 
                    className="toggle-password" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>
              
              <div className="form-options">
                <a href="#" className="forgot-link">
                  Quên mật khẩu?
                </a>
              </div>

              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? (
                  <span className="button-content">
                    <Loader size={16} className="spinner" />
                    Đang đăng nhập...
                  </span>
                ) : (
                  <span className="button-content">
                    Đăng nhập
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;