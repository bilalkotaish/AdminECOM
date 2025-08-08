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
      <section className="p-6 !pl-2 sm:p-6 md:p-8 bg-gray-50">
        <form
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8"
          onSubmit={handlesubmit}
        >
          <div className="max-h-[70vh] overflow-y-auto pr-1 sm:pr-3">

            {/* Product Name */}
            <div className="mb-6">
              <label
                htmlFor="product-name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Product Name
              </label>
              <input
                id="product-name"
                type="text"
                name="name"
                value={formfields.name}
                placeholder="Enter product name"
                onChange={onChangeInput}
                className="w-full h-[40px] rounded-md px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Product Description */}
            <div className="mb-6">
              <label
                htmlFor="product-description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Product Description
              </label>
              <textarea
                id="product-description"
                name="description"
                value={formfields.description}
                placeholder="Enter product description"
                onChange={onChangeInput}
                className="w-full rounded-md px-4 py-3 border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Select */}
              <div>
                <h3 className="text-sm  font-semibold mb-2">Product Category</h3>
                {context.catData.length !== 0 && (
                  <Select
                    value={Cat}
                    className="w-full h-[40px] bg-white rounded-md"
                    onChange={handleChange}
                  >
                    {context.catData.map((cat, index) => (
                      <MenuItem
                        key={index}
                        value={cat._id}
                        onClick={() => selectCatByName(cat.name)}
                      >
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </div>

              {/* Subcategory */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Product Sub Category</h3>
                {context.catData.length !== 0 && (
                  <Select
                    value={subCat}
                    className="w-full h-[40px] bg-white rounded-md"
                    onChange={handleChangesub}
                  >
                    {context.catData.flatMap((cat) =>
                      cat.children.map((subcat, idx) => (
                        <MenuItem
                          key={idx}
                          value={subcat._id}
                          onClick={() => selectsubCatByName(subcat.name)}
                        >
                          {subcat.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                )}
              </div>

              {/* Third-level Category */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Third Level Category</h3>
                {context.catData.length !== 0 && (
                  <Select
                    value={thirdsubCat}
                    className="w-full h-[40px] bg-white rounded-md"
                    onChange={handleChangethirdsub}
                  >
                    {context.catData.flatMap((cat) =>
                      cat.children.flatMap((subcat) =>
                        subcat.children.map((third, idx) => (
                          <MenuItem
                            key={idx}
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

              {/* Price */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Product Price</h3>
                <input
                  type="number"
                  name="price"
                  value={formfields.price}
                  onChange={onChangeInput}
                  className="w-full rounded-md px-4 h-[40px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Old Price */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Old Price</h3>
                <input
                  type="text"
                  name="oldprice"
                  value={formfields.oldprice}
                  onChange={onChangeInput}
                  className="w-full rounded-md px-4 h-[40px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Featured */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Featured</h3>
                <Select
                  value={subfet}
                  className="w-full h-[40px] bg-white rounded-md"
                  onChange={FeaturedhandleChange}
                >
                  <MenuItem value={true}>True</MenuItem>
                  <MenuItem value={false}>False</MenuItem>
                </Select>
              </div>

              {/* Stock */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Stock</h3>
                <input
                  type="text"
                  name="countInStock"
                  value={formfields.countInStock}
                  onChange={onChangeInput}
                  className="w-full rounded-md px-4 h-[40px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <h3 className="text-sm  font-semibold mb-2">Product Brand</h3>
                <input
                  type="text"
                  name="brand"
                  value={formfields.brand}
                  onChange={onChangeInput}
                  className="w-full h-[40px] rounded-md px-4 border border-gray-300 focus:outline-none focus:border-gray-500"
                />
              </div>

              {/* Discount */}
              <div>
                <h3 className="text-sm  font-semibold mb-2">Product Discount</h3>
                <input
                  type="number"
                  name="discount"
                  value={formfields.discount}
                  onChange={onChangeInput}
                  className="w-full h-[40px] rounded-md px-4 border border-gray-300 focus:outline-none focus:border-gray-500 no-spinner"
                />
              </div>

              <div className="col">
                <h3 className="text-sm font-[600] mb-2">Product Rams</h3>
                {pramData.length !== 0 && (
                  <Select
                    multiple
                    labelId="demo-simple-select-label"
                    id="Productram"
                    value={pram}
                    className="w-full bg-white !h-[40px] rounded-md h-[45px]"
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
                <h3 className="text-sm font-[600] mb-2">Product Weight</h3>
                {pweightData.length !== 0 && (
                  <Select
                    multiple
                    labelId="demo-simple-select-label"
                    id="Productweight"
                    value={pweight}
                    className="w-full !h-[40px] bg-white rounded-md h-[45px]"
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
                <h3 className="text-sm font-[600] mb-2">Product Size</h3>
                {psizeData.length !== 0 && (
                  <Select
                    multiple
                    labelId="demo-simple-select-label"
                    id="Productsize"
                    value={psize}
                    className="w-full !h-[40px]  bg-white rounded-md h-[45px]"
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
            </div>

            {/* Media Upload */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Media & Publish</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {preview.map((image, index) => (
                  <div key={index} className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage(image, index);
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <IoCloseSharp />
                    </button>
                    <div className="border rounded-lg overflow-hidden h-[150px]">
                      <LazyLoadImage
                        src={image.url}
                        effect="blur"
                        className="w-full h-full object-cover"
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="!bg-primary !text-white !mt-6 w-full flex items-center justify-center gap-2 py-3 text-lg font-semibold"
            >
              <IoMdCloudUpload className="text-xl" />
              Publish Product
              {isLoading && <CircularProgress color="inherit" size={20} />}
            </Button>
          </div>
        </form>
      </section>

    </>
  );
}
