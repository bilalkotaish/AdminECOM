import { Button } from "@mui/material";
import { CgLogIn } from "react-icons/cg";
import { MdOutlineFollowTheSigns } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";

import { useState, useContext } from "react";
import { Mycontext } from "../../App";
import { FaFacebookSquare } from "react-icons/fa";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";

import { postData } from "../../utils/api";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseapp } from "../../firebase";
const auth = getAuth(firebaseapp);
const Googleprovider = new GoogleAuthProvider();

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [loadingfb, setLoadingfb] = useState(false);
  const [isShowPass, setisShowPass] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const context = useContext(Mycontext);

  const [formfield, setformfield] = useState({
    email: "",
    password: "",
  });
  const history = useNavigate();
  const validValue = Object.values(formfield).every((el) => el);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setformfield(() => {
      return {
        ...formfield,
        [name]: value,
      };
    });
  };
  const handlesubmit = (e) => {
    setisLoading(true);
    e.preventDefault();

    if (formfield.email === "") {
      context.Alertbox("error", "Please Provide Your Email");
      return false;
    }
    if (formfield.password === "") {
      context.Alertbox("error", "Please Provide Your Password");
      return false;
    }

    postData("/api/user/login", formfield, { withCredentials: true }).then(
      (res) => {
        if (res.error !== true) {
          setisLoading(false);
          context.Alertbox("success", res.message);
          localStorage.setItem("userEmail", formfield.email);
          console.log(res);
          setformfield({
            email: "",
            password: "",
          });
          localStorage.setItem("accesstoken", res.data.accesstoken);
          localStorage.setItem("refreshtoken", res.data.refreshToken);
          context.setisLogin(true);

          history("/");
        } else {
          context.Alertbox("error", res.message);
          setisLoading(false);
          context.setisLogin(false);
        }
      }
    );
  };
  const authWithGoogle = () => {
    signInWithPopup(auth, Googleprovider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log("Logged in user:", user);

        const field = {
          name: user.displayName,
          email: user.email,
          password: null,
          Avatar: user.photoURL,
          Mobile: user.phoneNumber,
          Role: "Admin",
        };

        postData("/api/user/googleauth", field).then((res) => {
          if (!res.error) {
            localStorage.setItem("userEmail", field.email);
            localStorage.setItem("accesstoken", res.data.accesstoken);
            localStorage.setItem("refreshtoken", res.data.refreshToken);
            context.setisLogin(true);

            context.Alertbox("success", res.message);

            history("/");
          } else {
            context.Alertbox("error", res.message);
          }
        });
      })
      .catch((error) => {
        console.error("Google Auth Error:", error);
      });
  };
  const forgetPassword = () => {
    if (formfield.email === "") {
      context.Alertbox("error", "Please Provide Your Email");
      return false;
    } else {
      context.Alertbox(
        "success",
        `The verification code is sent to ${formfield.email}`
      );
      localStorage.setItem("userEmail", formfield.email);
      localStorage.setItem("action-type", "forgetPassword");
      postData("/api/user/forgetpassword", {
        email: localStorage.getItem("userEmail"),
      }).then((res) => {
        console.log(res);
        if (res.success) {
          context.Alertbox("success", res.message);

          //localStorage.removeItem("userEmail"),
          history("/verify");
        } else {
          context.Alertbox("error", res.message);
        }
      });
    }
  };

  function handleClick() {
    setLoading(true);
  }
  function handleClickfb() {
    setLoadingfb(true);
  }
  return (
    <section className="relative bg-white loginsection min-h-screen">
    {/* Header */}
    <header className="w-full lg:fixed z-50 top-0 left-0 px-4 py-2 flex flex-wrap items-center justify-center md:justify-between">
      <Link to="/" className="mb-2 md:mb-0">
        <svg
          width="150"
          height="60"
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
          className="max-w-full h-auto"
        >
          <rect width="100%" height="100%" fill="white" />
          <text
            x="50%"
            y="50%"
            fontFamily="Arial, sans-serif"
            fontSize="24"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black"
          >
            Billy Ecommerce
          </text>
        </svg>
      </Link>
  
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        <NavLink to="/login" exact="true" activeClassName="isActive">
          <Button className="rounded-full text-[rgba(0,0,0,0.8)] px-5 gap-2">
            <CgLogIn className="text-[20px]" /> Login
          </Button>
        </NavLink>
        <NavLink to="/signup">
          <Button className="rounded-full text-[rgba(0,0,0,0.8)] px-4 gap-2">
            <MdOutlineFollowTheSigns className="text-[20px]" /> Sign Up
          </Button>
        </NavLink>
      </div>
    </header>
  
    {/* Background */}
    <img
      src="https://www.ledr.com/colours/white.jpg"
      className="absolute w-full h-full top-0 left-0 object-cover opacity-30 z-10"
      alt="Background"
    />
  
    {/* Login Box */}
    <div className="loginbox card w-[90%] max-w-[550px] pt-0 lg:pt-56 pb-2 lg:pb-20 mx-auto relative z-50">
      <h1 className="text-center text-[18px] sm:text-[28px] lg:text-[35px] font-[700]">
        Welcome Back!!
        <br />
        Sign in With Your Credentials
      </h1>
  
      {/* Google Sign-In */}
      <div className="flex justify-center mt-5 gap-4 flex-wrap">
        <Button
          size="small"
          onClick={authWithGoogle}
          endIcon={<FcGoogle />}
          loading={loading}
          loadingPosition="end"
          variant="outlined"
          className="bg-none text-[14px] capitalize hover:bg-red-600 hover:text-white w-full sm:w-auto"
        >
          Sign In With Google
        </Button>
      </div>
  
      {/* Divider */}
      <div className="w-full flex items-center justify-center gap-3 mt-4 flex-wrap text-center">
        <span className="flex items-center w-[60px] sm:w-[100px] h-[2px] bg-slate-300"></span>
        <span className="text-[10px] md:text-[13px]">
          Or Sign In With Your Email
        </span>
        <span className="flex items-center w-[60px] sm:w-[100px] h-[2px] bg-slate-300"></span>
      </div>
  
      {/* Login Form */}
      <form className="w-full px-3 sm:px-8 mt-4" onSubmit={handlesubmit}>
        {/* Email */}
        <div className="w-full form-group mb-4">
          <h4 className="text-sm sm:text-base">Email</h4>
          <input
            type="email"
            disabled={isLoading}
            value={formfield.email}
            onChange={onChangeInput}
            name="email"
            className="w-full h-[40px] sm:h-[45px] border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
          />
        </div>
  
        {/* Password */}
        <div className="w-full form-group mb-4">
          <h4 className="text-sm sm:text-base">Password</h4>
          <div className="relative w-full">
            <input
              disabled={isLoading}
              name="password"
              value={formfield.password}
              onChange={onChangeInput}
              type={isShowPass ? "text" : "password"}
              className="w-full h-[40px] sm:h-[45px] border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
            />
            <Button
              className="!absolute top-[5px] sm:top-[7px] right-[7px] z-50 rounded-full w-[30px] sm:w-[35px] h-[30px] sm:h-[35px] min-w-[30px] sm:min-w-[35px]"
              onClick={() => setisShowPass(!isShowPass)}
            >
              {isShowPass ? (
                <FaEyeSlash className="text-[16px] sm:text-[18px]" />
              ) : (
                <FaEye className="text-[16px] sm:text-[18px]" />
              )}
            </Button>
          </div>
        </div>
  
        {/* Remember Me / Forgot Password */}
        <div className="w-full form-group mb-4 flex flex-wrap items-center justify-between gap-2">
          <FormControlLabel control={<Checkbox defaultChecked />} label="Remember Me" />
          <a
            className="link cursor-pointer text-[12px] sm:text-[14px] font-[500]"
            onClick={forgetPassword}
          >
            Forgot Password?
          </a>
        </div>
  
        {/* Submit */}
        <Button
          type="submit"
          disabled={!validValue}
          className="!bg-black !text-white w-full gap-3"
        >
          Login
          {isLoading && <CircularProgress color="inherit" />}
        </Button>
  
        {/* Signup Link */}
        <h2 className="text-[12px] sm:text-[13px] flex flex-wrap justify-between items-center text-gray-700 cursor-pointer pt-3">
          Don't have an account?
          <Link
            to="/signup"
            className="link text-[12px] sm:text-[14px] text-black !font-bold underline cursor-pointer"
          >
            Sign Up
          </Link>
        </h2>
      </form>
  
      <div className="h-3 sm:h-5 lg:h-5 !bg-white"></div>
    </div>
  </section>
  
  
  );
}
