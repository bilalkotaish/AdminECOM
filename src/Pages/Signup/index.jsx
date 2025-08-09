import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { CgLogIn } from "react-icons/cg";
import { MdOutlineFollowTheSigns } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { FaFacebookSquare } from "react-icons/fa";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Mycontext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "../../utils/api.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseapp } from "../../firebase";
const auth = getAuth(firebaseapp);
const Googleprovider = new GoogleAuthProvider();

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [loadingfb, setLoadingfb] = useState(false);
  const [isShowPass, setisShowPass] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [formFields, setformFields] = useState({
    name: "",
    email: "",
    password: "",
  });
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setformFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };
  const context = useContext(Mycontext);
  const history = useNavigate();
  const validValue = Object.values(formFields).every((el) => el);

  function handleClick() {
    setLoading(true);
  }
  function handleClickfb() {
    setLoadingfb(true);
  }
  const handlesubmit = (e) => {
    setisLoading(true);
    e.preventDefault();
    if (formFields.name === "") {
      context.Alertbox("error", "Please Provide Your Name");
      return false;
    }
    if (formFields.email === "") {
      context.Alertbox("error", "Please Provide Your Email");
      return false;
    }
    if (formFields.password === "") {
      context.Alertbox("error", "Please Provide Your Password");
      return false;
    }

    postData("/api/user/register", formFields).then((res) => {
      if (res.error !== true) {
        setisLoading(false);
        context.Alertbox("success", res.message);
        localStorage.setItem("userEmail", formFields.email);
        console.log(res);
        setformFields({
          name: "",
          email: "",
          password: "",
        });

        history("/verify");
      } else {
        context.Alertbox("error", res.message);
        setisLoading(false);
      }
    });
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
  return (
    <section className="relative bg-white pb-2 loginsection">
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
  
      <div className="hidden md:flex items-center gap-4 flex-wrap">
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
  
    {/* Background Image */}
    <img
      src="https://www.ledr.com/colours/white.jpg"
      className="absolute w-full h-full top-0 left-0 object-cover opacity-30 z-10"
      alt="Background"
    />
  
    {/* Sign-Up Box */}
    <div className="loginbox card w-[90%] max-w-[550px] pt-0 lg:pt-56 pb-20 mx-auto pt-2 relative z-50">
      <h1 className="text-center text-[18px] sm:text-[28px] lg:text-[35px] font-[700]">
        Join Us Now!
        <br />
        Get Special Benifits Bundle
      </h1>
  
      {/* Google Sign-Up */}
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
          Sign Up With Google
        </Button>
      </div>
  
      {/* Divider */}
      <div className="w-full flex items-center justify-center gap-3 mt-4 flex-wrap text-center">
        <span className="flex items-center w-[60px] sm:w-[100px] h-[2px] bg-slate-300"></span>
        <span className="text-[10px] sm:text-[13px]">
          Or Sign Up With Your Email
        </span>
        <span className="flex items-center w-[60px] sm:w-[100px] h-[2px] bg-slate-300"></span>
      </div>
  
      {/* Sign-Up Form */}
      <form
        className="w-full px-3 sm:px-8 mt-4"
        onSubmit={handlesubmit}
      >
        {/* Full Name */}
        <div className="w-full form-group mb-4">
          <h4 className="text-sm sm:text-base">FullName</h4>
          <input
            type="text"
            className="w-full h-[40px] sm:h-[45px] border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
            name="name"
            value={formFields.name}
            disabled={isLoading}
            onChange={onChangeInput}
          />
        </div>
  
        {/* Email */}
        <div className="w-full form-group mb-4">
          <h4 className="text-sm sm:text-base">Email</h4>
          <input
            type="email"
            className="w-full h-[40px] sm:h-[45px] border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
            disabled={isLoading}
            value={formFields.email}
            name="email"
            onChange={onChangeInput}
          />
        </div>
  
        {/* Password */}
        <div className="w-full form-group mb-4">
          <h4 className="text-sm sm:text-base">Password</h4>
          <div className="relative w-full">
            <input
              type={isShowPass ? "text" : "password"}
              className="w-full h-[40px] sm:h-[45px] border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
              name="password"
              disabled={isLoading}
              value={formFields.password}
              onChange={onChangeInput}
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
  
        {/* Remember Me */}
        <div className="w-full form-group mb-4 flex items-center justify-between flex-wrap">
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Remember Me"
          />
        </div>
  
        {/* Submit Button */}
        <div className="flex items-center mt-3 mb-3">
          <Button
            type="submit"
            disabled={!validValue}
            className="!bg-black !text-white w-full gap-3"
          >
            Sign Up
            {isLoading && <CircularProgress color="inherit" />}
          </Button>
        </div>
  
        {/* Login Link */}
        <h2 className="text-[12px] sm:text-[13px] flex flex-wrap justify-between text-gray-700 cursor-pointer pt-3">
          Already Have An Account?
          <Link
            to="/login"
            className="link text-[12px] sm:text-[14px] text-black !font-bold underline cursor-pointer"          >
            Login Now
          </Link>
        </h2>
      </form>
    </div>
  </section>
  
  );
}
