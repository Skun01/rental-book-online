import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BookOpen, EyeOff, Eye, Loader, LogIn, Home } from "lucide-react"
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  })

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset errors
    setErrors({
      email: "",
      password: "",
      general: "",
    })
    
    // Validate fields
    let hasErrors = false
    const newErrors = {
      email: "",
      password: "",
      general: "",
    }

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      newErrors.email = "Hãy nhập email"
      hasErrors = true
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = "Email không hợp lệ"
      hasErrors = true
    }

    if (!password) {
      newErrors.password = "Hãy nhập mật khẩu"
      hasErrors = true
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 kí tự"
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      console.log(trimmedEmail, password)
      await axios.post("http://localhost:8080/api/v1/auth/login", {
        email: trimmedEmail,
        password: password,
      })
      .then(res => {
        const { accessToken, user, message } = res.data.data;
        login(user, accessToken)
        console.log(message);
        user.role.name !== "USER" ? navigate("/admin") : navigate("/");
      })
      
    } catch (err) {
      console.log(err)
      setErrors({
        ...newErrors,
        general: "Email hoặc mật khẩu không chính xác",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <BookOpen size={40} strokeWidth={2} />
          </div>
          <h1 className="auth-title">Chào mừng trở lại</h1>
          <p className="auth-description">Nhập email và mật khẩu để sử dụng tài khoản của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && <div className="auth-error">{errors.general}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Mật khẩu</label>
              <Link to="/forgot-password" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "input-error" : ""}
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <span className="button-content">
                <Loader size={16} className="spinner" />
                Đang đăng nhập...
              </span>
            ) : (
              <span className="button-content">
                <LogIn size={16} />
                Đăng nhập
              </span>
            )}
          </button>

          <div className="auth-actions">
            <p className="auth-redirect">
              Không có tài khoản?{" "}
              <Link to="/register" className="auth-link">
                Đăng ký
              </Link>
            </p>
            <Link to="/" className="back-to-home">
              <Home size={16} />
              Trở về trang chủ
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login