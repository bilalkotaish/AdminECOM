import Button from "@mui/material/Button";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdCloudUpload } from "react-icons/io";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import Select from "@mui/material/Select";
import { postData } from "../../utils/api";
import { useContext } from "react";
import { Mycontext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";

export default function Addadress() {
  const [phone, setPhone] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const context = useContext(Mycontext);

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setformfield({ ...formfield, Status: event.target.value });
  };
  const [formfield, setformfield] = useState({
    Address_line: "",
    City: "",
    State: "",
    Pincode: "",
    Country: "",
    Status: false,
    Mobile: "",
    Selected: false,
  });
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

    if (formfield.Address_line === "") {
      context.Alertbox("error", "Please Provide Your Address");
      return;
    }
    if (formfield.City === "") {
      context.Alertbox("error", "Please Provide Your City");
      return;
    }
    if (formfield.Mobile === "") {
      context.Alertbox("error", "Please Provide Your Mobile Number");
      return;
    }
    if (formfield.State === "") {
      context.Alertbox("error", "Please Provide Your state");
      return;
    }
    if (formfield.Pincode === "") {
      context.Alertbox("error", "Please Provide Your Pincode");
      return;
    }
    if (formfield.Country === "") {
      context.Alertbox("error", "Please Provide Your Country");
      return;
    }
    if (formfield.Status === false) {
      context.Alertbox("error", "Please Provide Your Status");
      return;
    }

    postData(`/api/address/add`, formfield, { withCredentials: true }).then(
      (res) => {
        setisLoading(false);
        if (res.error !== true) {
          context.Alertbox("success", res.message);
          console.log(res);
          // setformfield({
          //   Address_line: "",
          //   City: "",
          //   State: "",
          //   Pincode: "",
          //   Country: "",
          //   Status: false,
          //   Mobile: "",
          // });
          context.setisOpenPanel({ open: false });
        } else {
          context.Alertbox("error", res.message);
        }
      }
    );
  };
  return (
    <>
      <section className="p-5 bg-gray-50">
        <form className="p-8 py-3 " onSubmit={handlesubmit}>
          <div className="grid grid-cols-2 mb-3 gap-4">
            <div className="col w-[100%]">
              <h3 className="text-[16px] font-[600] mb-2">Address Line</h3>
              <input
                type="text"
                name="Address_line"
                value={formfield.Address_line}
                onChange={onChangeInput}
                className="w-full h-[35px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
            <div className="col w-[100%]">
              <h3 className="text-[16px] font-[600] mb-2">City</h3>
              <input
                type="text"
                name="City"
                value={formfield.City}
                onChange={onChangeInput}
                className="w-full h-[35px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
            <div className="col w-[100%]">
              <h3 className="text-[16px] font-[600] mb-2">State</h3>
              <input
                type="text"
                name="State"
                value={formfield.State}
                onChange={onChangeInput}
                className="w-full h-[35px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>{" "}
            <div className="col w-[100%]">
              <h3 className="text-[16px] font-[600] mb-2">Country</h3>
              <input
                type="text"
                name="Country"
                value={formfield.Country}
                onChange={onChangeInput}
                className="w-full h-[35px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
            <div className="col w-[100%]">
              <h3 className="text-[16px] font-[600] mb-2">Pincode</h3>
              <input
                type="text"
                name="Pincode"
                value={formfield.Pincode}
                onChange={onChangeInput}
                className="w-full h-[35px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
            <div className="col w-[100%]">
              <h3 className="text-[16px] font-[600] mb-2">Mobile</h3>
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
                  setformfield({ ...formfield, Mobile: phone });
                }}
              />
            </div>
            <div className="col w-[100%]">
              <h3 className="text-[16px] font-[600] mb-2">Status</h3>
              <Select
                value={status}
                className="w-full bg-white !rounded-md h-[43px]"
                onChange={handleChangeStatus}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={false}>False</MenuItem>
                <MenuItem value={true}>True</MenuItem>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="!bg-primary !text-white items-center mt-4 w-full !pr-2 gap-2 !pl-12"
          >
            <IoMdCloudUpload className="text-[25px] " /> Publish Address
            <CircularProgress />
          </Button>
        </form>
      </section>
    </>
  );
}
