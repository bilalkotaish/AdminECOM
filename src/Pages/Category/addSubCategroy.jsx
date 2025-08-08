import { IoMdCloudUpload } from "react-icons/io";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Mycontext } from "../../App";

import { fetchData, postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext } from "react";

export default function AddSubCategory() {
  const [Cat, setCat] = useState("");
  const [Cat2, setCat2] = useState("");

  const [isLoading, setisLoading] = useState(false);
  const [isLoading2, setisLoading2] = useState(false);

  const [formfields, setformfields] = useState({
    name: "",
    parentCatname: null,
    parentCatId: null,
  });
  const [formfields2, setformfields2] = useState({
    name: "",
    parentCatname: null,
    parentCatId: null,
  });

  const context = useContext(Mycontext);
  const handleChange = (event) => {
    const selectedId = event.target.value;
    setCat(selectedId);

    // Find the selected category to get its name
    const selectedCategory = context.catData.find(
      (item) => item._id === selectedId
    );

    setformfields((prev) => ({
      ...prev,
      parentCatId: selectedId,
      parentCatname: selectedCategory?.name || "",
    }));
  };
  const handleChange2 = (event) => {
    const selectedId2 = event.target.value;
    setCat2(selectedId2);

    let selectedName = "";
    let parentId = "";

    // Loop through top-level categories to find the child
    context.catData.forEach((cat) => {
      if (Array.isArray(cat.children)) {
        const match = cat.children.find((child) => child._id === selectedId2);
        if (match) {
          selectedName = match.name;
          parentId = cat._id; // in case you need the parent's ID too
        }
      }
    });

    setformfields2((prev) => ({
      ...prev,
      parentCatId: selectedId2,
      parentCatname: selectedName,
    }));

    console.log("Selected sub-category name:", selectedName);
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setformfields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onChangeInput2 = (e) => {
    const { name, value } = e.target;
    setformfields2((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    fetchData("/api/category/getcategory").then((res) => {
      console.log("Fetched category data:", res);
      context.setCatData(res.categories || []);
    });
  }, []);

  // const selectedcatFun = (name) => {
  //   setformfields({ parentCatname: name });
  // };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);

    if (formfields.name === "") {
      context.Alertbox("error", "Please Provide Category Name");
      setisLoading(false);
      return;
    }

    if (Cat === "") {
      context.Alertbox("error", "Please Select Parent Category");
      setisLoading(false);
      return;
    }

    try {
      const res = await postData("/api/category/create", formfields);
      if (res.error !== true) {
        context.Alertbox("success", res.message);
        // Reset form
        setformfields({
          name: "",
          parentCatname: "",
          parentCatId: "",
        });
        setCat("");
        context.setisOpenPanel(false);
      } else {
        context.Alertbox("error", res.message);
      }
    } catch (error) {
      context.Alertbox(
        "error",
        "An error occurred while creating the category"
      );
    } finally {
      setisLoading(false);
    }
  };

  const handlesubmitThird = async (e) => {
    e.preventDefault();
    setisLoading2(true);

    if (formfields2.name === "") {
      context.Alertbox("error", "Please Provide Category Name");
      setisLoading2(false);
      return;
    }

    if (Cat2 === "") {
      context.Alertbox("error", "Please Select Parent Category");
      setisLoading2(false);
      return;
    }
    postData("/api/category/create", formfields2).then((res) => {
      if (res.error !== true) {
        context.Alertbox("success", res.message);
        // Reset form
        setformfields2({
          name: "",
          parentCatname: "",
          parentCatId: "",
        });
        setCat2("");
        context.setisOpenPanel(false);
        setisLoading2(false);
      } else {
        context.Alertbox("error", res.message);
      }
    });
    setisLoading2(false);
  };
  return (
    <>
      <section className="p-4 sm:p-6 md:p-8 bg-gray-50 grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Add Sub Category Form */}
  <form className="bg-white rounded-lg shadow-md p-4 sm:p-6" onSubmit={handlesubmit}>
    <h4 className="mb-6 text-lg sm:text-xl font-semibold text-gray-800">Add Sub Category</h4>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {/* Category Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
        <Select
          id="ProductCat"
          value={Cat}
          onChange={handleChange}
          className="w-full bg-white rounded-full h-[43px]"
        >
          {context.catData.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Subcategory Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category Name</label>
        <input
          type="text"
          name="name"
          value={formfields.name}
          onChange={onChangeInput}
          placeholder="Enter subcategory name"
          className="w-full h-[43px] rounded-full px-4 border border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>

    <Button
      type="submit"
      className="w-full !bg-blue-600 hover:bg-blue-700 !text-white font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-2"
    >
      <IoMdCloudUpload className="text-xl" />
      Publish Sub Category
      {isLoading && <CircularProgress color="inherit" size={20} />}
    </Button>
  </form>

  {/* Add Third Level Category Form */}
  <form className="bg-white rounded-lg shadow-md p-4 sm:p-6" onSubmit={handlesubmitThird}>
    <h4 className="mb-6 text-lg sm:text-xl font-semibold text-gray-800">Add Third Level Category</h4>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {/* Subcategory Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Sub Category</label>
        <Select
          id="ProductSubCat"
          value={Cat2}
          onChange={handleChange2}
          className="w-full bg-white rounded-full h-[43px]"
        >
          {context.catData.flatMap((item) =>
            Array.isArray(item.children)
              ? item.children.map((child) => (
                  <MenuItem key={child._id} value={child._id}>
                    {child.name}
                  </MenuItem>
                ))
              : []
          )}
        </Select>
      </div>

      {/* Third Level Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Third Level Name</label>
        <input
          type="text"
          name="name"
          value={formfields2.name}
          onChange={onChangeInput2}
          placeholder="Enter third level name"
          className="w-full h-[43px] rounded-full px-4 border border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>

    <Button
      type="submit"
      className="w-full !bg-blue-600 hover:bg-blue-700 !text-white font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-2"
    >
      <IoMdCloudUpload className="text-xl" />
      Publish Third Level Category
      {isLoading2 && <CircularProgress color="inherit" size={20} />}
    </Button>
  </form>
</section>

    </>
  );
}
