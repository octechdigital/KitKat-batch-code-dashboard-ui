import "./Login.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Logo } from "../../lib/images";
import API from "../../api";
import { useNavigate } from "react-router";
import { ROUTES } from "../../lib/consts";
import { RootState, store } from "../../store/store";
import { setAccessToken } from "../../store/slices/authSlice";
import { showToast } from "../../lib/utils";
import { useSelector } from "react-redux";
import { useEffect } from "react";

// Form inputs type
interface FormInputs {
  email: string;
  password: string;
}

// Yup Validation Schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  console.log(accessToken);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = (data: FormInputs) => {
    API.login(data.email, data.password)
      .then((resp) => {
        showToast("success", "You have been logged in successfully!");
        store.dispatch(setAccessToken(resp.data.token));
        navigate(ROUTES.PENDING);
      })
      .catch((err) => {
        console.log("err", err);
      });
    console.log("Form Data:", data);
  };

  useEffect(() => {
    if (accessToken) {
      navigate(ROUTES.PENDING);
    }
  }, [accessToken, navigate]);

  return (
    <div className="login-container">
      <section className="login-l">
        <img src={Logo} alt="logo" />
        <p className="heading">Effortless Approvals, Smarter Decisions!</p>
        <p className="sub-heading">
          Seamlessly review, approve, or reject requests with ease. Stay in
          control with real-time insights, streamlined workflows, and a
          hassle-free approval process.
        </p>
      </section>

      <section className="login-r">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <p className="title">Login</p>
          <p className="content">Please enter your credentials to login.</p>

          <div className="form-group">
            <input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "error" : ""}
              placeholder="Email"
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div className="form-group">
            <input
              id="password"
              type="password"
              {...register("password")}
              className={!errors.email && errors.password ? "error" : ""}
              placeholder="Password"
            />
            {!errors.email && errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
