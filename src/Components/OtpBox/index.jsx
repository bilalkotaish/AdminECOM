import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Mycontext } from "../../App";
import { postData } from "../../utils/api";

const OtpBox = () => {
  const [otp, setOtp] = useState(new Array(6).fill("")); // ['','','','','','']
  const inputRefs = useRef([]);
  const histroy = useNavigate();
  const context = useContext(Mycontext);
  const actiontype = localStorage.getItem("action-type");

  // Handle single input change
  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // allow only digits
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if exists
    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace (move to previous if empty)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle full OTP paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      newOtp.forEach((digit, idx) => {
        inputRefs.current[idx].value = digit;
      });
      inputRefs.current[5].focus();
    }
  };

  const verifyOtp = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      alert("Please enter all 6 digits");
      return;
    }
    if (actiontype !== "forgetPassword") {
      postData("/api/user/verify", {
        email: localStorage.getItem("userEmail"),
        otp: fullOtp,
      }).then((res) => {
        console.log(res);
        if (res.success) {
          context.Alertbox("success", res.message);
          localStorage.removeItem("userEmail"), histroy("/login");
          // redirect or next action
        } else {
          context.Alertbox("error", res.message);
        }
      });
    } else {
      postData("/api/user/verify-forgetpassword", {
        email: localStorage.getItem("userEmail"),
        otp: fullOtp,
      }).then((res) => {
        console.log(res);

        if (res.success) {
          context.Alertbox("success", res.message);
          histroy("/changepassword");
          // redirect or next action
        } else {
          context.Alertbox("error", res.message);
        }
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center   p-4">
        <div className="flex gap-3 mb-4" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center text-lg border border-gray-400 rounded-md focus:outline-primary"
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button
          onClick={verifyOtp}
          className="!bg-black text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          Submit OTP
        </button>
      </div>
    </>
  );
};

export default OtpBox;
