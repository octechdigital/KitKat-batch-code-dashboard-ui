import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import API from "../../api";
import { ROUTES } from "../../lib/consts";
import { Logo } from "../../lib/images";
import { showToast } from "../../lib/utils";
import { setAccessToken } from "../../store/slices/authSlice";
import { RootState, store } from "../../store/store";
import "./GLogin.scss";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const turnstile: any;

interface FormInputs {
  email: string;
  password: string;
  otp?: string;
  key?: string;
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

  const [cloudFlareToken, setCloudFareToken] = useState("");
  const [reset, setReset] = useState(false);
  const widgetId = useRef<string | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const initializeTurnstileWidget = () => {
    if (typeof turnstile !== "undefined") {
      turnstile.ready(() => {
        if (!widgetId.current) {
          widgetId.current = turnstile.render("#cf-turnstile-otp", {
            sitekey: import.meta.env.VITE_API_CLOUDFARE_SITE_KEY,
            theme: "light",
            callback: (token: string) => {
              setCloudFareToken(token);
            },
          });
        }
      });
    } else {
      console.error("Turnstile script not loaded. Retrying...");
      timer.current = setTimeout(() => {
        setReset((p) => !p);
      }, 3000);
    }
  };

  useEffect(() => {
    initializeTurnstileWidget();
    if (timer.current) clearTimeout(timer.current);
  }, [reset]);

  useEffect(() => {
    if (accessToken) {
      navigate(ROUTES.PENDING);
    }
  }, [accessToken, navigate]);

  // Step 1: Login with email & password
  const handleCredentialsSubmit = (values: FormInputs) => {
    if (!cloudFlareToken) {
      return showToast("error", "Verification failed");
    }
    API.login(values.email, values.password, cloudFlareToken)
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
      .catch((e) => showToast("error", e.message));
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
      .catch((e) => showToast("error", e.message));
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
            initialValues={{ email: "", password: "", otp: "" }}
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
                    placeholder="Enter your Email"
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
                    placeholder="Enter your Password"
                    autoComplete="current-password"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="error-message"
                  />
                </div>
                <div id={"cf-turnstile-otp"} />
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
