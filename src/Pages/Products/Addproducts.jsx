import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { IoMdCloudUpload } from "react-icons/io";
import Select from "@mui/material/Select";
import { IoCloseSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import "react-lazy-load-image-component/src/effects/blur.css";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import FileUploadBox from "../../Components/UploadBox";
import { Mycontext } from "../../App";
import { deleteData, fetchData, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
const label = { inputProps: { "aria-label": "Switch demo" } };

export default function Addproduct() {
  const [Cat, setCat] = useState("");
  const [subCat, setsubCat] = useState("");
  const [thirdsubCat, setthirdsubCat] = useState("");
  const [preview, setpreview] = useState([]);
  const [bannerpreview, setbannerpreview] = useState([]);

  const [isLoading, setisLoading] = useState(false);

  const [subfet, setsubfet] = useState("");
  const [pram, setpram] = useState([]);
  const [pweight, setpweight] = useState([]);
  const [psize, setpsize] = useState([]);
  const [pramData, setpramData] = useState([]);
  const [pweightData, setpweightData] = useState([]);
  const [psizeData, setpsizeData] = useState([]);
  const [checkswitch, setcheckswitch] = useState(false);
  const context = useContext(Mycontext);
  const history = useNavigate();
  const RamhandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setpram(typeof value === "string" ? value.split(",") : value);
    formfields.productRam = value;
  };
  const sizehandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setpsize(typeof value === "string" ? value.split(",") : value);
    formfields.size = value;
  };
  const weighthandleChange = (event) => {
    const {
      target: { value },
    } = event;
    setpweight(typeof value === "string" ? value.split(",") : value);
    formfields.productweight = value;
  };
  const FeaturedhandleChange = (event) => {
    setsubfet(event.target.value);
    formfields.isFeatured = event.target.value;
  };

  const handleChange = (event) => {
    setCat(event.target.value);
    formfields.catId = event.target.value;
    formfields.category = event.target.value;
  };

  const handlebanner = (e) => {
    setcheckswitch(e.target.checked);
    formfields.IsDisplayedHome = e.target.checked;
  };
  const handleChangesub = (event) => {
    setsubCat(event.target.value);
    formfields.subcatId = event.target.value;
  };

  const handleChangethirdsub = (event) => {
    setthirdsubCat(event.target.value);
    formfields.thirdsubcatId = event.target.value;
  };

  const [formfields, setformfields] = useState({
    name: "",
    images: [],
    price: "",
    description: "",
    brand: "",
    oldprice: "",
    rating: "",
    category: "",
    catname: "",
    catId: "",
    subcatname: "",
    subcatId: "",
    thirdsubname: "",
    thirdsubcatId: "",
    countInStock: "",
    isFeatured: false,
    discount: "",
    productRam: [],
    size: [],
    productweight: [],
    bannerImage: [],
    bannerTitle: "",
    IsDisplayedHome: false,
  });
  const onChangeInput = (e) => {
    console.log(e.target.name);
    const { name, value } = e.target;
    setformfields(() => {
      return { ...formfields, [name]: value };
    });
  };
  const selectCatByName = (name) => {
    formfields.catname = name;
  };
  const selectsubCatByName = (name) => {
    formfields.subcatname = name;
  };
  const selectthirdsubCatByName = (name) => {
    formfields.thirdsubname = name;
  };
  const onChangeRating = (e) => {
    setformfields(() => {
      return { ...formfields, rating: e.target.value };
    });
  };

  const setpreviewfun = (previewArr) => {
    setpreview([...preview, ...previewArr]);
    setformfields({
      ...formfields,
      images: [...formfields.images, ...previewArr],
    });
  };
  const setpreviewbannerfun = (previewArr) => {
    setbannerpreview([...bannerpreview, ...previewArr]); // Changed from preview to bannerpreview
    setformfields({
      ...formfields,
      bannerImage: [...formfields.bannerImage, ...previewArr], // Fixed field name
    });
  };
  const removeImage = (image, index) => {
    deleteData(`/api/product/deleteimage`, { fileId: image.fileId }).then(
      (res) => {
        console.log("Deleted:", res);
        setpreview(preview.filter((item, i) => i !== index));
        setformfields({
          ...formfields,
          images: formfields.images.filter((item, i) => i !== index),
        });
      }
    );
  };
  const removebannerImage = (image, index) => {
    deleteData(`/api/product/deletebannerimage`, { fileId: image.fileId }).then(
      (res) => {
        console.log("Deleted:", res);
        setbannerpreview(bannerpreview.filter((item, i) => i !== index));
        setformfields({
          ...formfields,
          bannerImage: formfields.bannerImage.filter((item, i) => i !== index),
        });
      }
    );
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(formfields);
    setisLoading(true);
    if (formfields.name === "") {
      context.Alertbox("error", "Please Provide Category Name");
      return false;
    }
    if (formfields.images.length === 0) {
      context.Alertbox("error", "Please Provide Category Image");
      return false;
    }
    if (formfields.catId === "") {
      context.Alertbox("error", "Please Provide Category Id");
      return false;
    }
    if (formfields.subcatId === "") {
      context.Alertbox("error", "Please Provide Sub Category Id");
      return false;
    }
    // if (formfields.bannerImage.length === 0) {
    //   context.Alertbox("error", "Please Provide Banner Image");
    //   return false;
    // }

    // if (formfields.thirdsubcatId === "") {
    //   context.Alertbox("error", "Please Provide Third Sub Category Id");
    //   return false;
    // }
    if (formfields.price === "") {
      context.Alertbox("error", "Please Provide Product Price");
      return false;
    }
    if (formfields.quantity === "") {
      context.Alertbox("error", "Please Provide Product Quantity");
      return false;
    }
    if (formfields.brand === "") {
      context.Alertbox("error", "Please Provide Product Brand");
      return false;
    }
    if (formfields.oldprice === "") {
      context.Alertbox("error", "Please Provide Product Old Price");
      return false;
    }
    if (formfields.rating === "") {
      context.Alertbox("error", "Please Provide Product Rating");
      return false;
    }
    if (formfields.discount === "") {
      context.Alertbox("error", "Please Provide Product Discount");
      return false;
    }
    if (formfields.description === "") {
      context.Alertbox("error", "Please Provide Product Description");
      return false;
    }
    if (formfields.countInStock === "") {
      context.Alertbox("error", "Please Provide Product Stock");
      return false;
    }
    // if (formfields.productRam.length === 0) {
    //   context.Alertbox("error", "Please Provide Product Ram");
    //   return false;
    // }
    // if (formfields.size.length === 0) {
    //   context.Alertbox("error", "Please Provide Product Size");
    //   return false;
    // }
    // if (formfields.productweight.length === 0) {
    //   context.Alertbox("error", "Please Provide Product Weight");
    //   return false;
    // }

    if (formfields.isFeatured === "") {
      context.Alertbox("error", "Please Provide Product Featured");
      return false;
    }
    postData("/api/product/create", formfields).then((res) => {
      console.log(res);
      if (res.error !== true) {
        setisLoading(false);
        context.Alertbox("success", res.message);
        console.log(res);

        setpreview([]);
        context.setisOpenPanel(false);
        history("/product");
      } else {
        context.Alertbox("error", res.message);
      }
    });
  };

  useEffect(() => {
    fetchData("/api/product/getRams").then((res) => {
      console.log(res);
      if (res.error === false) {
        setpramData(res.data);
      }
    });
    fetchData("/api/product/getweights").then((res) => {
      console.log(res);
      if (res.error === false) {
        setpweightData(res.data);
      }
    });
    fetchData("/api/product/getSizes").then((res) => {
      console.log(res);
      if (res.error === false) {
        setpsizeData(res.data);
      }
    });
  }, []);
  const selectram = (ram) => {
    formfields.productRam = ram._id;
    formfields.ramname = ram.ram;
  };
  const selectweight = (weight) => {
    formfields.productweight = weight._id;
    formfields.weightname = weight.weight;
  };
  const selectsize = (size) => {
    formfields.size = size._id;
    formfields.sizename = size.size;
  };

  return (
    <>
      <section className="p-5 bg-gray-50">
        <form className="p-8 py-3 " onSubmit={handlesubmit}>
          <div className="scroll max-h-[70vh] pr-4 overflow-y-scroll">
            <div className="grid grid-cols-1 mb-3 gap-4">
              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">Product Name</h3>
                <input
                  type="text"
                  name="name"
                  value={formfields.name}
                  onChange={onChangeInput}
                  className="w-full h-[35px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 mb-3 gap-4">
              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">
                  Product Description
                </h3>
                <textarea
                  type="text"
                  name="description"
                  value={formfields.description}
                  onChange={onChangeInput}
                  className="w-full h-[100px]  rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">
                  Product Category
                </h3>
                {context.catData.length !== 0 && (
                  <Select
                    labelId="demo-simple-select-label"
                    id="ProductCat"
                    name="productCat"
                    value={Cat}
                    className="w-full bg-white rounded-md h-[45px]"
                    label="Category"
                    onChange={handleChange}
                  >
                    {context.catData.map((cat, index) => (
                      <MenuItem
                        key={index}
                        value={cat._id}
                        onClick={() => {
                          selectCatByName(cat.name);
                        }}
                      >
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </div>

              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">
                  Product Sub Category
                </h3>
                {context.catData.length !== 0 && (
                  <Select
                    labelId="demo-simple-select-label"
                    id="ProductCat"
                    name="productCat"
                    value={subCat}
                    className="w-full bg-white rounded-md h-[45px]"
                    label="subCategory"
                    onChange={handleChangesub}
                  >
                    {context.catData.map((cat, index) =>
                      cat.children.map((subcat, index) => (
                        <MenuItem
                          key={index}
                          value={subcat._id}
                          onClick={() => {
                            selectsubCatByName(subcat.name);
                          }}
                        >
                          {subcat.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                )}
              </div>
              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">
                  Product Third Level Category
                </h3>
                {context.catData.length !== 0 && (
                  <Select
                    labelId="demo-simple-select-label"
                    id="ProductCat"
                    name="productCat"
                    value={thirdsubCat}
                    className="w-full bg-white rounded-md h-[45px]"
                    label="subCategory"
                    onChange={handleChangethirdsub}
                  >
                    {context.catData.map((cat, index) =>
                      cat.children.map((subcat, index) =>
                        subcat.children.map((third, index) => (
                          <MenuItem
                            key={index}
                            value={third._id}
                            onClick={() => selectthirdsubCatByName(third.name)}
                          >
                            {third.name}
                          </MenuItem>
                        ))
                      )
                    )}
                  </Select>
                )}
              </div>
              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">Product Price</h3>
                <input
                  type="number"
                  name="price"
                  value={formfields.price}
                  onChange={onChangeInput}
                  className=" no-spinner w-full h-[45px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
                />
              </div>

              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">
                  Product Old Price
                </h3>
                <input
                  type="number"
                  name="oldprice"
                  value={formfields.oldprice}
                  onChange={onChangeInput}
                  className=" no-spinner w-full h-[45px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
                />
              </div>
              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">
                  Product Featured
                </h3>
                <Select
                  labelId="demo-simple-select-label"
                  id="ProductsubCat"
                  value={subfet}
                  className="w-full bg-white rounded-md h-[45px]"
                  label="Category"
                  onChange={FeaturedhandleChange}
                >
                  <MenuItem value={true}>True</MenuItem>
                  <MenuItem value={false}>False</MenuItem>
                </Select>
              </div>
              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">Product Stock</h3>
                <input
                  type="number"
                  name="countInStock"
                  value={formfields.countInStock}
                  onChange={onChangeInput}
                  className=" no-spinner w-full h-[45px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
                />
              </div>
              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">Product Brand</h3>
                <input
                  type="text"
                  name="brand"
                  value={formfields.brand}
                  onChange={onChangeInput}
                  className=" no-spinner w-full h-[45px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
                />
              </div>
              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">
                  Product Discount
                </h3>
                <input
                  type="number"
                  name="discount"
                  value={formfields.discount}
                  onChange={onChangeInput}
                  className=" no-spinner w-full h-[45px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
                />
              </div>
              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">Product Rams</h3>
                {pramData.length !== 0 && (
                  <Select
                    multiple
                    labelId="demo-simple-select-label"
                    id="Productram"
                    value={pram}
                    className="w-full bg-white rounded-md h-[45px]"
                    onChange={RamhandleChange}
                  >
                    {pramData.map((ram, index) => (
                      <MenuItem
                        key={index}
                        value={ram.ram}
                        onClick={() => selectram(ram)}
                      >
                        {ram.ram}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </div>

              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">Product Weight</h3>
                {pweightData.length !== 0 && (
                  <Select
                    multiple
                    labelId="demo-simple-select-label"
                    id="Productweight"
                    value={pweight}
                    className="w-full bg-white rounded-md h-[45px]"
                    label="Category"
                    onChange={weighthandleChange}
                  >
                    {pweightData.map((weight, index) => (
                      <MenuItem
                        key={index}
                        value={weight.weight}
                        onClick={() => selectweight(weight)}
                      >
                        {weight.weight}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </div>
              <div className="col">
                <h3 className="text-[16px] font-[600] mb-2">Product Size</h3>
                {psizeData.length !== 0 && (
                  <Select
                    multiple
                    labelId="demo-simple-select-label"
                    id="Productsize"
                    value={psize}
                    className="w-full bg-white rounded-md h-[45px]"
                    label="Category"
                    onChange={sizehandleChange}
                  >
                    {psizeData.map((size, index) => (
                      <MenuItem
                        key={index}
                        value={size.size}
                        onClick={() => selectsize(size)}
                      >
                        {size.size}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </div>
              <div className="col mt-1">
                <h3 className="text-[16px] font-[600] mb-4">Product Rating</h3>
                <Rating
                  name="half-rating"
                  defaultValue={2.5}
                  onChange={onChangeRating}
                  precision={0.5}
                />
              </div>
            </div>

            <div className="col w-full p-5 px-0">
              <h3 className="text-[22px] font-[600] mb-4"> Media & Publish</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-6">
                {preview.length !== 0 &&
                  preview.map((image, index) => (
                    <div className="relative group" key={index}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeImage(image, index);
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-md"
                      >
                        <IoCloseSharp className="text-sm" />
                      </button>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden h-[150px] w-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center">
                        <LazyLoadImage
                          alt={image}
                          effect="blur"
                          className="w-full h-full object-cover"
                          src={image.url}
                        />
                      </div>
                    </div>
                  ))}

                <FileUploadBox
                  url="/api/product/uploadimage"
                  multiple={true}
                  name="images"
                  setpreviewfun={setpreviewfun}
                />
              </div>
            </div>

            <div className="col w-full p-5 px-0">
              {" "}
              <div className="flex items-center gap-4">
                <h3 className="text-[22px] font-[600] mb-4"> Banner Images</h3>

                <Switch
                  onChange={(e) => handlebanner(e)}
                  checked={checkswitch}
                  {...label}
                />
              </div>
              {formfields.IsDisplayedHome && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-6">
                    {bannerpreview.length !== 0 &&
                      bannerpreview.map((image, index) => (
                        <div className="relative group" key={index}>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              removebannerImage(image, index);
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-md"
                          >
                            <IoCloseSharp className="text-sm" />
                          </button>

                          <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden h-[150px] w-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center">
                            <LazyLoadImage
                              alt={image}
                              effect="blur"
                              className="w-full h-full object-cover"
                              src={image.url}
                            />
                          </div>
                        </div>
                      ))}

                    <FileUploadBox
                      url="/api/product/uploadbannerimage"
                      multiple={true}
                      name="bannerImage"
                      setpreviewfun={setpreviewbannerfun}
                    />
                  </div>
                  <div className="col">
                    <h3 className="text-[16px] font-[600] mb-2">
                      Banner Title
                    </h3>
                    <input
                      type="text"
                      name="bannerTitle"
                      value={formfields.bannerTitle}
                      onChange={onChangeInput}
                      className=" no-spinner w-full h-[45px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="!bg-primary !text-white items-center mt-4 w-full !pr-2 gap-2 !pl-12"
          >
            <IoMdCloudUpload className="text-[25px] " /> Publish Product
            {isLoading && <CircularProgress color="inherit" size={20} />}
          </Button>
        </form>
      </section>
    </>
  );
}
