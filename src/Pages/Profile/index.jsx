import { useContext, useEffect, useState } from "react";
import { Mycontext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchData, uploadImage } from "../../utils/api";
import { MdCloudUpload } from "react-icons/md";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useNavigate } from "react-router";
import Button from "@mui/material/Button";
import { editData } from "../../utils/api";
import { Collapse } from "react-collapse";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";

import { postData } from "../../utils/api";

export default function Profile() {
  const [preview, setpreview] = useState([]);
  const [upload, setupload] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isLoading2, setisLoading2] = useState(false);
  const [isclick, setisclick] = useState(false);

  const [address, setaddress] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    // if (event.target.checked === true) {
    //   editData(`/api/address/update/${event.target.value} `, {
    //     Selected: true,
    //   });
    // } else {
    //   editData(`/api/address/update/${event.target.value} `, {
    //     Selected: false,
    //   });
    // }
  };

  const [phone, setPhone] = useState("");
  const [userId, setuserId] = useState("");
  const [formfield, setformfield] = useState({
    name: "",
    email: "",
    Mobile: "",
  });
  const [changePassword, setchangePassword] = useState({
    email: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const context = useContext(Mycontext);
  const history = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token === null) {
      history("/login");
    }
  }, [context?.islogin]);
  const validValue = Object.values(formfield).every((el) => el);
  const validValue2 = Object.values(changePassword).every((el) => el);

  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      setuserId(context?.userData?._id);
      fetchData(`/api/address/get?${context?.userData?._id}`, {
        withCredentials: true,
      }).then((res) => {
        console.log(res.data);
        setaddress(res.data);
        setSelectedValue(res.data);
      });
      setformfield({
        name: context?.userData?.name,
        email: context?.userData?.email,
        Mobile: context?.userData?.Mobile,
      });
      const ph = `"${context?.userData?.Mobile}"`;
      setPhone(ph);

      setchangePassword({
        email: context?.userData?.email,
      });
    }
  }, [context?.userData]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setformfield(() => {
      return {
        ...formfield,
        [name]: value,
      };
    });

    setchangePassword(() => {
      return {
        ...changePassword,
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
    if (formfield.name === "") {
      context.Alertbox("error", "Please Provide Your Password");
      return false;
    }
    if (formfield.Mobile === "") {
      context.Alertbox("error", "Please Provide Your Mobile Number");
      return false;
    }

    editData(`/api/user/${userId}`, formfield, { withCredentials: true }).then(
      (res) => {
        if (res.error !== true) {
          setisLoading(false);
          context.Alertbox("success", res.message);
          console.log(res);
          //   setformfield({
          //     name: "",
          //     email: "",
          //     Mobile: "",
          //   });
        } else {
          context.Alertbox("error", res.message);
          setisLoading(false);
        }
      }
    );
  };

  const handlesubmitChange = (e) => {
    setisLoading(true);
    e.preventDefault();

    if (changePassword.oldPassword === "") {
      context.Alertbox("error", "Please Provide Your Old Password");
      return false;
    }
    if (changePassword.password === "") {
      context.Alertbox("error", "Please Provide Your New Password");
      return false;
    }
    if (changePassword.confirmPassword === "") {
      context.Alertbox("error", "Please Confirm Your Password");
      return false;
    }
    if (changePassword.confirmPassword !== changePassword.password) {
      context.Alertbox("error", "Password Does Not Match");
      return false;
    }

    postData(`/api/user/reset-password`, changePassword, {
      withCredentials: true,
    }).then((res) => {
      console.log("Response:", res);
      if (res.error !== true) {
        setisLoading(false);
        context.Alertbox("success", res.message);

        console.log(res);
      } else {
        context.Alertbox("error", res.message);
        setisLoading(false);
      }
    });
  };

  useEffect(() => {
    const userAvatar = [];
    if (
      context?.userData?.Avatar !== "" &&
      context?.userData?.Avatar !== undefined
    ) {
      userAvatar.push(context?.userData?.Avatar);
      setpreview(userAvatar);
    }
  }, [context?.userData]);

  const onchangefile = async (e, apiEndPoint) => {
    try {
      setpreview([]);
      const files = e.target.files;
      setupload(true);
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        if (
          files[i] &&
          ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
            files[i].type
          )
        ) {
          formData.append("Avatar", files[i]);

          const res = await uploadImage("/api/user/user-avatar", formData);

          console.log("Response data:", res);

          if (res?.Avatar) {
            setupload(false);
            setpreview([res.Avatar]); // ✅ Set as array
            context.Alertbox("success", "Image Uploaded Successfully");
          }
        } else {
          context.Alertbox("error", "Please select only image file");
          setupload(false);
          return;
        }
      }
    } catch (error) {
      console.log(error);
      setupload(false);
    }
  };
  return (
    <>
      <div className="card my-4 w-[70%] shadow-md sm:rounded-lg bg-white pb-5 px-5">
        <div className="flex items-center w-full  justify-between pt-5 ">
          <h1 className="text-[20px]  font-[600]">User Profile</h1>
          <Button
            className="!ml-auto"
            onClick={() => {
              setisclick(!isclick);
            }}
          >
            Change Password
          </Button>
        </div>
        <br />
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden flex items-center justify-center mb-4 relative group">
          {upload ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              {preview.length > 0 ? (
                preview.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ))
              ) : (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSktcnWbHej5LP9gi_MAZXL1HvYlEpb9MLLsA&s" // Replace with your default image path
                  className="w-full h-full object-cover"
                />
              )}
            </>
          )}

          <div
            className="overlay w-full h-full absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.6)] flex
                                  items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100"
          >
            <MdCloudUpload className="text-white text-[25px]" />
            <input
              type="file"
              className="top-0 left-0 absolute w-full h-full opacity-0"
              accept="image/*"
              onChange={(e) => {
                onchangefile(e, "/api/user/user-avatar");
              }}
              name="Avatar"
            />
          </div>
        </div>

        <form className="pt-8 " onSubmit={handlesubmit}>
          <div className="flex items-center  gap-5 ">
            <div className="w-[50%]">
              <input
                type="text"
                disabled={isLoading}
                value={formfield.name}
                name="name"
                onChange={onChangeInput}
                className="w-full h-[35px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
            <div className="w-[50%] h-auto">
              <input
                type="email"
                value={formfield.email}
                disabled={true}
                name="email"
                onChange={onChangeInput}
                className="w-full h-[35px] rounded-md p-5  text-gray-400 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
          <div className="flex items-center mt-3 gap-5 ">
            <div className="w-[49%]">
              <PhoneInput
                type="text"
                disabled={isLoading}
                defaultCountry="lb"
                value={phone}
                name="Mobile"
                inputStyle={{
                  width: "100%",
                  border: "!3px !solid !rgba(0,0,0,0.7)",
                }}
                containerStyle={{
                  width: "100%",
                  border: "!3px !solid !rgba(0,0,0,0.7)",
                  borderRadius: "6px",
                }}
                onChange={(phone) => {
                  setPhone(phone);
                  setformfield((prev) => ({ ...prev, Mobile: phone }));
                }}
              />
            </div>
          </div>
          <div
            onClick={() =>
              context.setisOpenPanel({ open: true, model: "Add Address" })
            }
            className="flex items-center mt-3 p-5 cursor-pointer hover:bg-[#e7f3f9] justify-center border border-[rgba(0,0,0,0.2)] border-dashed bg-[#f1faff]"
          >
            <span className="text-[16px] font-[400]">Add Address</span>
          </div>
          <div className="gap-2 flex-col flex mt-4">
            {address?.length > 0 &&
              address?.map((address, index) => {
                return (
                  <>
                    <label className="addressBox p-3 border border-[rgba(0,0,0,0.2)] bg-[#f1f1f1] flex items-center w-full !pt-3 !pb-3 cursor-pointer">
                      <Radio
                        onChange={handleChange}
                        value={address._id}
                        checked={selectedValue === address._id}
                        name="address"
                      />
                      <span className="text-[12px] font-[400]">
                        {address?.Address_line}
                        <br />
                        {address?.City}, {address?.Country}
                        <br />
                        {address?.Pincode}
                        <br />
                        {address?.Mobile}
                        <br />
                        {address?.Status ? "true" : "false"}
                        <br />
                      </span>
                    </label>
                  </>
                );
              })}
          </div>

          <br />

          <div className="flex items-center gap-5">
            <Button
              type="submit"
              disabled={!validValue}
              className="!bg-gray-800 !text-white w-[100%]"
            >
              {" "}
              Update Profile
              {isLoading === true ? <CircularProgress color="inherit" /> : ""}
            </Button>
          </div>
        </form>
      </div>

      <Collapse isOpened={isclick}>
        <div className="card bg-white shadow-md w-[70%] rounded-md p-5 mt-5">
          <div className="flex items-center">
            <h1 className="text-[20px]  font-[600]"> Change Password</h1>
          </div>
          <form className="mt-8 " onSubmit={handlesubmitChange}>
            <div className="flex items-center  gap-5 ">
              <div className="w-[50%]">
                <TextField
                  label="oldPassword"
                  type="password"
                  variant="outlined"
                  disabled={isLoading2}
                  value={changePassword.oldPassword}
                  size="small"
                  className="w-full"
                  name="oldPassword"
                  onChange={onChangeInput}
                />
              </div>
              <div className="w-[50%] h-auto">
                <TextField
                  disabled={isLoading2}
                  value={changePassword.password}
                  label="password"
                  type="password"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  name="password"
                  onChange={onChangeInput}
                />
              </div>
            </div>
            <div className="flex items-center mt-3 gap-5 ">
              <div className="w-[50%]">
                <TextField
                  label="confirmPassword"
                  variant="outlined"
                  type="password"
                  disabled={isLoading2}
                  value={changePassword.confirmPassword}
                  size="small"
                  name="confirmPassword"
                  className="w-full"
                  onChange={onChangeInput}
                />
              </div>
            </div>

            <br />

            <div className="flex items-center gap-5">
              <Button
                type="submit"
                disabled={!validValue2}
                className="!bg-gray-800 !text-white w-full h-auto"
              >
                {" "}
                Change Password
                {isLoading === true ? <CircularProgress color="inherit" /> : ""}
              </Button>
            </div>
          </form>
        </div>
      </Collapse>
    </>
  );
}
