import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BookOpen, EyeOff, Eye, Loader, UserPlus, Home } from "lucide-react"

import axios from "axios"
const Register = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    age: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    gender: "",
    age: "",
    password: "",
    confirmPassword: "",
    general: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // clear error message when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset all errors
    const newErrors = {
      fullName: "",
      email: "",
      gender: "",
      age: "",
      password: "",
      confirmPassword: "",
      general: "",
    }

    let hasErrors = false

    // Validate all fields
    if (!formData.fullName) {
      newErrors.fullName = "Hãy nhập họ và tên"
      hasErrors = true
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Họ và tên phải ít nhất 2 kí tự"
      hasErrors = true
    }

    if (!formData.email) {
      newErrors.email = "Hãy nhập email"
      hasErrors = true
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ"
      hasErrors = true
    }

    if (!formData.gender) {
      newErrors.gender = "Hãy chọn giới tính"
      hasErrors = true
    }

    if (!formData.age) {
      newErrors.age = "Hãy nhập tuổi"
      hasErrors = true
    } else if (!validateAge(formData.age)) {
      newErrors.age = "Tuổi phải lớn hơn hoặc bằng 18"
      hasErrors = true
    }

    if (!formData.password) {
      newErrors.password = "Hãy nhập mật khẩu"
      hasErrors = true
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải ít nhất 6 kí tự"
      hasErrors = true
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Hãy nhập lại mật khẩu"
      hasErrors = true
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp"
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      // get api to register to server here:
      const url = "http://localhost:8080/api/v1/auth/register";
      await axios
        .post(url, {
          fullName: formData.fullName,
          email: formData.email,
          gender: formData.gender,
          age: formData.age,
          password: formData.password,
          }
        ).then(res=>console.log(res))
      navigate("/login")
    } catch (err) {
      console.log(err);
      setErrors({
        ...newErrors,
        general: "Đăng nhập thất bại, vui lòng thử lại.",
      })
    } finally {
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
          <h1 className="auth-title">Tạo tài khoản</h1>
          <p className="auth-description">Nhập thông tin các nhân để tạo tài khoản</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && <div className="auth-error">{errors.general}</div>}

          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              id="fullName"
              name="fullName"
              placeholder="Thái Trường"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? "input-error" : ""}
            />
            {errors.fullName && <div className="field-error">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? "input-error" : ""}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Gay</option>
              </select>
              {errors.gender && <div className="field-error">{errors.gender}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="age">Tuổi</label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className={errors.age ? "input-error" : ""}
              />
              {errors.age && <div className="field-error">{errors.age}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
            <div className="password-input">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <span className="button-content">
                <Loader size={16} className="spinner" />
                Đang tạo tài khoản...
              </span>
            ) : (
              <span className="button-content">
                <UserPlus size={16} />
                Tạo tài khoản
              </span>
            )}
          </button>

          <div className="auth-actions">
            <p className="auth-redirect">
              Đã có tài khoản?{" "}
              <Link to="/login" className="auth-link">
                Đăng nhập
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

// Helper functions moved to the bottom
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateAge(age) {
  return +age >= 18 && +age < 150
}

export default Register