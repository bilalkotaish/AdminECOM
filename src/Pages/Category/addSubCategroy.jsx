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
      <section className="p-5 bg-gray-50 grid grid-cols-2 gap-10">
        <form className="p-8 py-3 " onSubmit={handlesubmit}>
          <h4 className="mb-5 font-[600] text-[20px]">Add Sub Category</h4>
          <div className="grid grid-cols-2  mb-3 gap-4">
            <div className="col ">
              <h3 className="text-[16px] font-[600] mb-2">Product Category</h3>
              <Select
                labelId="demo-simple-select-label"
                id="ProductCat"
                value={Cat}
                className="w-full bg-white !rounded-full h-[43px]"
                label="Category"
                onChange={handleChange}
              >
                {context.catData.length !== 0 &&
                  context.catData.map((item) => {
                    return (
                      <MenuItem
                        className="w-full bg-white !rounded-full h-[43px]"
                        key={item._id}
                        value={item._id}
                        // onClick={selectedcatFun(item.name)}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>
            <div className="col w-[full]">
              <h3 className="text-[16px] font-[600] mb-2">Sub Category Name</h3>
              <input
                type="text"
                name="name"
                value={formfields.name}
                onChange={onChangeInput}
                className="w-full h-[35px] rounded-full p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="!bg-primary !text-white items-center mt-4 w-full !pr-2 gap-2 !pl-12"
          >
            <IoMdCloudUpload className="text-[25px] " /> Publish Sub Category
            {isLoading && <CircularProgress color="inherit" size={20} />}
          </Button>
        </form>

        <form className="p-8 py-3 " onSubmit={handlesubmitThird}>
          <h4 className="mb-5 font-[600] text-[20px]">
            Add Third Level Category
          </h4>
          <div className="grid grid-cols-2  mb-3 gap-4">
            <div className="col ">
              <h3 className="text-[16px] font-[600] mb-2">Product Category</h3>
              <Select
                labelId="demo-simple-select-label"
                id="ProductCat"
                value={Cat2}
                className="w-full bg-white !rounded-full h-[43px]"
                label="Category"
                onChange={handleChange2}
              >
                {context.catData.length !== 0 &&
                  context.catData.map((item) => {
                    if (!Array.isArray(item.children)) return null;

                    return item.children.map((child) => (
                      <MenuItem
                        className="w-full bg-white !rounded-full h-[43px]"
                        key={child._id}
                        value={child._id}
                      >
                        {child.name}
                      </MenuItem>
                    ));
                  })}
              </Select>
            </div>
            <div className="col w-[full]">
              <h3 className="text-[16px] font-[600] mb-2">Sub Category Name</h3>
              <input
                type="text"
                name="name"
                value={formfields2.name}
                onChange={onChangeInput2}
                className="w-full h-[35px] rounded-full p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="!bg-primary !text-white items-center mt-4 w-full !pr-2 gap-2 !pl-12"
          >
            <IoMdCloudUpload className="text-[25px] " /> Publish Third Level
            Category
            {isLoading2 && <CircularProgress color="inherit" size={20} />}
          </Button>
        </form>
      </section>
    </>
  );
}
