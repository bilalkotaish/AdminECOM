import Button from "@mui/material/Button";
import { AiTwotoneEdit } from "react-icons/ai";
import { useContext, useState, useEffect } from "react";
import { Mycontext } from "../../App";
import { MdOutlineDeleteOutline } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";

import { IoMdCloudUpload } from "react-icons/io";
import { fetchData, postData, editData, deleteData } from "../../utils/api";

export default function EditSubcat(props) {
  const [edit, setEdit] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const context = useContext(Mycontext);
  const [formFields, setFormFields] = useState({
    name: "",
    parentCatname: null,
    parentCatId: null,
  });
  useEffect(() => {
    (formFields.parentCatname = props.selectedCatname),
      (formFields.parentCatId = props.selectedCat),
      (formFields.name = props.name),
      setSelectedValue(props.selectedCat);
  }, []);
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    const catId = selectedValue;
    setSelectedValue(catId);
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlechange = (e) => {
    setSelectedValue(e.target.value);
    formFields.parentCatId = e.target.value;
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);

    if (formFields.name.trim() === "") {
      context.Alertbox("error", "Please Provide Subcategory Name");
      setisLoading(false);
      return;
    }

    try {
      const res = await editData(`/api/category/${props.id}`, formFields);

      if (res.error !== true) {
        context.Alertbox("success", res.message);
        console.log("Subcategory updated:", res);

        // Reset form
        setFormFields({
          name: "",
          parentCatname: null,
          parentCatId: null,
        });

        context.setisOpenPanel(false);

        // Refresh category data
        const fetchRes = await fetchData("/api/category/getcategory");
        context.setCatData(fetchRes.categories || []);
      } else {
        context.Alertbox("error", res.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      context.Alertbox("error", "Something went wrong while updating.");
    } finally {
      setisLoading(false);
    }
    const fetchRes = await fetchData("/api/category/getcategory");
    context.setCatData(fetchRes.categories || []);
  };
  const deleteCat = (id) => {
    deleteData(`/api/category/${props.id}`).then((res) => {
      console.log(res.data);
      fetchData("/api/category/getcategory").then((res) => {
        console.log("Fetched category data:", res);
        context.setCatData(res.categories || []);
      });
    });
  };

  return (
    <>
      <form
        onSubmit={handlesubmit}
        className="w-full flex items-center justify-between px-4 py-3 bg-white shadow-sm rounded-md border border-gray-200"
      >
        {edit === true && (
          <div className="flex flex-col gap-4 w-full bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
            {/* Subcategory Select */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="subcat"
                className="text-sm font-medium text-gray-700"
              >
                Select Subcategory
              </label>
              <select
                id="subcat"
                name="subcat"
                value={selectedValue}
                onChange={handlechange}
                className="w-full bg-white border border-gray-300 text-sm text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                <option value="" disabled>
                  -- Select a Subcategory --
                </option>
                {props.subcat?.length > 0 &&
                  props.subcat.map((subcat, index) => (
                    <option
                      key={index}
                      value={subcat._id}
                      onClick={() => (formFields.parentCatname = subcat.name)}
                    >
                      {subcat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Subcategory Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formFields.name}
                onChange={onChangeInput}
                className="w-full bg-white border border-gray-300 text-sm text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter name"
              />
            </div>

            <div className="flex justify-end pt-2 gap-3">
              <Button
                type="submit"
                className="!bg-blue-600 hover:!bg-blue-700 !text-white flex items-center justify-center gap-2 px-5 py-2 rounded-md"
              >
                <IoMdCloudUpload className="text-[20px]" />
                <span className="text-sm font-medium">Publish Product</span>
                {isLoading && <CircularProgress color="inherit" size={20} />}
              </Button>

              <Button
                type="button"
                onClick={() => setEdit(false)} // or a custom cancel handler
                className="!bg-gray-200 hover:!bg-gray-300 !text-gray-800 px-5 py-2 rounded-md"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {edit === false && (
          <>
            {/* Left: Category Name */}
            <span className="text-[15px] font-medium text-gray-800">
              {props.name}
            </span>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                className="!min-w-[32px] !h-8 !p-0 !bg-green-50 hover:!bg-green-100 !rounded-md"
                variant="text"
                onClick={() => setEdit(true)}
              >
                <AiTwotoneEdit className="text-green-600 text-lg" />
              </Button>
              <Button
                className="!min-w-[32px] !h-8 !p-0 !bg-red-50 hover:!bg-red-100 !rounded-md"
                variant="text"
                onClick={() => {
                  deleteCat(props.id);
                }}
              >
                <MdOutlineDeleteOutline className="text-red-600 text-lg" />
              </Button>
            </div>
          </>
        )}
      </form>
    </>
  );
}
