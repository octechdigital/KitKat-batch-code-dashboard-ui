import "./GLogin.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Logo } from "../../lib/images";
import API from "../../api";
import { useNavigate } from "react-router";
import { ROUTES } from "../../lib/consts";
import { RootState, store } from "../../store/store";
import { setAccessToken } from "../../store/slices/authSlice";
import { showToast } from "../../lib/utils";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface FormInputs {
  email: string;
  password: string;
  otp?: string;
  key?:string;
}

// Validation schemas
const credentialsSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "At least 6 characters")
    .required("Password is required"),
});

const otpSchema = Yup.object({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const GLogin = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [tempKey, setTempKey] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (accessToken) {
      navigate(ROUTES.PENDING);
    }
  }, [accessToken, navigate]);

  // Step 1: Login with email & password
  const handleCredentialsSubmit = (values: FormInputs) => {
    API.login(values.email, values.password)
      .then((resp) => {
        const key = resp?.data?.key;
        if (key) {
          showToast("success", "OTP sent to your email!");
          setEmail(values.email);
          setTempKey(key);
          setStep("otp");
        } else {
          showToast("error", "Failed to get OTP key");
        }
      })
      .catch(() => showToast("error", "Invalid email or password"));
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = (values: FormInputs) => {
    API.verifyOtp(values.otp!, tempKey)
      .then((resp) => {
        const finalToken = resp?.data?.token;
        if (finalToken) {
          store.dispatch(setAccessToken(finalToken));
          showToast("success", "Login successful!");
          navigate(ROUTES.PENDING);
        } else {
          showToast("error", "Failed to retrieve access token");
        }
      })
      .catch(() => showToast("error", "Invalid OTP"));
  };

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
        {step === "credentials" ? (
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={credentialsSchema}
            onSubmit={handleCredentialsSubmit}
          >
            {() => (
              <Form className="login-form">
                <p className="title">Login</p>
                <p className="content">
                  Enter your email and password to receive OTP.
                </p>

                <div className="form-group">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="username"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="error-message"
                  />
                </div>

                <button type="submit" className="submit-button">
                  Get OTP
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{ email: "", password: "", otp: "" }}
            validationSchema={otpSchema}
            onSubmit={handleOtpSubmit}
          >
            {() => (
              <Form className="login-form">
                <p className="title">Enter OTP</p>
                <p className="content">
                  Please enter the 6-digit OTP sent to <b>{email}</b>.
                </p>

                <div className="form-group">
                  <Field
                    type="text"
                    name="otp"
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="Enter 6-digit OTP"
                    autoComplete="one-time-code"
                    autoCorrect="off"
                    autoCapitalize="none"
                    id="otp"
                    data-lpignore="true" // LastPass & password managers ignore
                    data-form-type="otp" // Tells browser it's an OTP
                  />

                  <ErrorMessage
                    name="otp"
                    component="p"
                    className="error-message"
                  />
                </div>

                <button type="submit" className="submit-button">
                  Verify OTP
                </button>
              </Form>
            )}
          </Formik>
        )}
      </section>
    </div>
  );
};

export default GLogin;
