import { Button } from "@mui/material";
import { CgLogIn } from "react-icons/cg";
import { MdOutlineFollowTheSigns } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import { useState } from "react";
import { FaFacebookSquare } from "react-icons/fa";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import OtpBox from "../../Components/OtpBox";
export default function Verify() {
  const userEmail = localStorage.getItem("userEmail");
  return (
    <section className="relative bg-white loginsection">
      <header className="w-full fixed z-50 !top-0 !left-0 px-4 py-2 flex !items-center !justify-between">
        <Link to="/">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa-W8dn-tap14EaxWD27PkQcQVMzdoxozotA&s"
            className="w-[200px]"
            alt="Logo"
          />
        </Link>

        <div className="flex items-center gap-0">
          <NavLink to="/login" exact={true} activeClassName="isActive">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 gap-2">
              <CgLogIn className="!text-[20px]" /> Login
            </Button>
          </NavLink>
          <NavLink to="/signup">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] px-4 gap-2">
              <MdOutlineFollowTheSigns className="!text-[20px]" /> Sign Up
            </Button>
          </NavLink>
        </div>
      </header>
      <img
        src="https://www.ledr.com/colours/white.jpg"
        className="absolute w-full h-full top-0 left-0 object-cover opacity-30 z-10"
      />

      <div className="loginbox card w-[550px] h-[auto] pb-20 mx-auto pt-20 relative z-50   ">
        <div className="text-center ">
          <img
            src="src\assets\Otp verify.png"
            className="w-[100px] m-auto mx-auto h-[100px]"
          />
        </div>
        <h1 className="text-center text-[35px] font-[700]">
          {" "}
          Welcome Back!!
          <br />
          Please Verfiy Your Email
        </h1>
        <p className="text-center mt-3">
          {" "}
          Otp send to{" "}
          <span className="text-red-700 pb-4 font-[600]">{userEmail}</span>
        </p>
        <div className="text-center">
          <OtpBox />
        </div>
        <br />

        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </section>
  );
}
