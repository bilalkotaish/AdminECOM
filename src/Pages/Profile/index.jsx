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
  <div className="card my-4 w-full max-w-4xl mx-auto shadow-md sm:rounded-lg bg-white pb-6 px-4 sm:px-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row items-center justify-between pt-5 gap-3">
      <h1 className="text-xl font-semibold">User Profile</h1>
      <Button
        className="sm:ml-auto w-full sm:w-auto"
        onClick={() => setisclick(!isclick)}
      >
        Change Password
      </Button>
    </div>

    {/* Avatar Upload */}
    <div className="w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] rounded-full overflow-hidden flex items-center justify-center mb-4 relative group mx-auto mt-6">
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
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSktcnWbHej5LP9gi_MAZXL1HvYlEpb9MLLsA&s"
              className="w-full h-full object-cover"
            />
          )}
        </>
      )}
      <div className="overlay w-full h-full absolute top-0 left-0 z-50 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 transition-opacity group-hover:opacity-100">
        <MdCloudUpload className="text-white text-xl" />
        <input
          type="file"
          className="absolute w-full h-full opacity-0"
          accept="image/*"
          onChange={(e) => onchangefile(e, "/api/user/user-avatar")}
          name="Avatar"
        />
      </div>
    </div>

    {/* Profile Form */}
    <form className="pt-6" onSubmit={handlesubmit}>
      <div className="flex flex-col sm:flex-row gap-5">
        <input
          type="text"
          disabled={isLoading}
          value={formfield.name}
          name="name"
          onChange={onChangeInput}
          className="w-full h-10 rounded-md px-4 border border-gray-300 focus:outline-none focus:border-gray-500"
        />
        <input
          type="email"
          value={formfield.email}
          disabled
          name="email"
          onChange={onChangeInput}
          className="w-full h-10 rounded-md px-4 text-gray-400 border border-gray-300 focus:outline-none focus:border-gray-500"
        />
      </div>

      <div className="mt-4">
        <PhoneInput
          disabled={isLoading}
          defaultCountry="lb"
          value={phone}
          name="Mobile"
          inputStyle={{ width: "100%" }}
          containerStyle={{ width: "100%", borderRadius: "6px" }}
          onChange={(phone) => {
            setPhone(phone);
            setformfield((prev) => ({ ...prev, Mobile: phone }));
          }}
        />
      </div>

      <div
        onClick={() =>
          context.setisOpenPanel({ open: true, model: "Add Address" })
        }
        className="flex items-center mt-4 p-4 cursor-pointer hover:bg-blue-100 justify-center border border-dashed border-gray-300 bg-blue-50 rounded-md"
      >
        <span className="text-base font-medium">Add Address</span>
      </div>

      {/* Address List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {address?.length > 0 &&
          address.map((address, index) => (
            <label
              key={index}
              className="p-3 border border-gray-300 bg-gray-100 rounded-md flex flex-col cursor-pointer"
            >
              <Radio
                onChange={handleChange}
                value={address._id}
                checked={selectedValue === address._id}
                name="address"
              />
              <span className="text-sm font-normal mt-2">
                {address?.Address_line}
                <br />
                {address?.City}, {address?.Country}
                <br />
                {address?.Pincode}
                <br />
                {address?.Mobile}
                <br />
                {address?.Status ? "true" : "false"}
              </span>
            </label>
          ))}
      </div>

      <div className="flex items-center gap-5 mt-6">
        <Button
          type="submit"
          disabled={!validValue}
          className="w-full sm:w-auto !bg-gray-800 !text-white px-6 py-2"
        >
          Update Profile
          {isLoading && <CircularProgress color="inherit" className="ml-2" />}
        </Button>
      </div>
    </form>
  </div>

  {/* Change Password Section */}
  <Collapse isOpened={isclick}>
    <div className="card bg-white shadow-md w-full max-w-4xl mx-auto rounded-md p-4 sm:p-6 mt-6">
      <h1 className="text-xl font-semibold mb-4">Change Password</h1>
      <form onSubmit={handlesubmitChange}>
        <div className="flex flex-col sm:flex-row gap-5">
          <TextField
            label="Old Password"
            type="password"
            variant="outlined"
            disabled={isLoading2}
            value={changePassword.oldPassword}
            size="small"
            name="oldPassword"
            className="w-full"
            onChange={onChangeInput}
          />
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            disabled={isLoading2}
            value={changePassword.password}
            size="small"
            name="password"
            className="w-full"
            onChange={onChangeInput}
          />
        </div>

        <div className="mt-4">
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            disabled={isLoading2}
            value={changePassword.confirmPassword}
            size="small"
            name="confirmPassword"
            className="w-full"
            onChange={onChangeInput}
          />
        </div>

        <div className="flex items-center gap-5 mt-6">
          <Button
            type="submit"
            disabled={!validValue2}
            className="w-full sm:w-auto !bg-gray-800 !text-white px-6 py-2"
          >
            Change Password
            {isLoading2 && <CircularProgress color="inherit" className="ml-2" />}
          </Button>
        </div>
      </form>
    </div>
  </Collapse>
</>

  );
}
