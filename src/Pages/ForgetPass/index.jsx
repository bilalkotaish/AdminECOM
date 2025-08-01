import { Button } from "@mui/material";
import { CgLogIn } from "react-icons/cg";
import { MdOutlineFollowTheSigns } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function ForgetPassword() {
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

      <div className="loginbox card w-[550px] h-[auto] pb-20 mx-auto pt-2 relative z-50   ">
        <div className="text-center ">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa-W8dn-tap14EaxWD27PkQcQVMzdoxozotA&s"
            className=" mx-auto"
            alt="Logo"
          />
        </div>
        <h1 className="text-center text-[35px] font-[700]">
          {" "}
          Having Trouble To Sign In
          <br />
          Reset Your Password
        </h1>

        <form className="w-full px-8">
          <div className="w-full form-group mb-4">
            <h4>Email</h4>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full h-[45px] border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] 
              focus:outline-none px-3"
            />
          </div>
          <Link to="/verify">
            <Button className=" !bg-black !text-white w-full">
              {" "}
              Reset Password
            </Button>
          </Link>
          <h2 className="text-[13px]  text-gray-700 cursor-pointer pt-3">
            Don't Want To Reset ?
            <Link
              to="/login"
              className="link text-[14px]  text-red-700 cursor-pointer"
            >
              Login Now!
            </Link>
          </h2>
        </form>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </section>
  );
}
