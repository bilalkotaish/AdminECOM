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
import { useContext, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import FileUploadBox from "../../Components/UploadBox";
import { Mycontext } from "../../App";
import { deleteData, editData, fetchData, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Switch from "@mui/material/Switch";
const label = { inputProps: { "aria-label": "Switch demo" } };

export default function EditProduct() {
  const [Cat, setCat] = useState("");
  const [subCat, setsubCat] = useState("");
  const [thirdsubCat, setthirdsubCat] = useState("");
  const [preview, setpreview] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [subfet, setsubfet] = useState("");
  const [pram, setpram] = useState([]);
  const [pweight, setpweight] = useState([]);
  const [psize, setpsize] = useState([]);
  const [pramData, setpramData] = useState([]);
  const [pweightData, setpweightData] = useState([]);
  const [psizeData, setpsizeData] = useState([]);
  const [bannerpreview, setbannerpreview] = useState([]);
  const [checkswitch, setcheckswitch] = useState(false);

  const context = useContext(Mycontext);
  const history = useNavigate();

  const setpreviewbannerfun = (previewArr) => {
    setbannerpreview([...bannerpreview, ...previewArr]); // Changed from preview to bannerpreview
    setformfields({
      ...formfields,
      bannerImage: [...formfields.bannerImage, ...previewArr], // Fixed field name
    });
  };
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
  useEffect(() => {
    fetchData(`/api/product/${context.isOpenPanel.id}`).then((res) => {
      console.log(context.isOpenPanel.id);
      setformfields({
        name: res?.data?.name,
        images: res?.data?.images,
        price: res?.data?.price,
        description: res?.data?.description,
        brand: res?.data?.brand,
        oldprice: res?.data?.oldprice,
        rating: res?.data?.rating,
        category: res?.data?.category,
        catname: res?.data?.catname,
        catId: res?.data?.catId,
        subcatname: res?.data?.subcatname,
        subcatId: res?.data?.subcatId,
        thirdsubname: res?.data?.thirdsubname,
        thirdsubcatId: res?.data?.thirdsubcatId,
        countInStock: res?.data?.countInStock,
        isFeatured: res?.data?.isFeatured,
        discount: res?.data?.discount,
        productRam: res?.data?.productRam,
        size: res?.data?.size,
        productweight: res?.data?.productweight,
        bannerImage: res?.data?.bannerImage,
        bannerTitle: res?.data?.bannerTitle,
        IsDisplayedHome: res?.data?.IsDisplayedHome,
      });
      setpreview(res?.data?.images);
      setbannerpreview(res?.data?.bannerImage || []);
      setCat(res?.data?.catId);
      setsubCat(res?.data?.subcatId);
      setthirdsubCat(res?.data?.thirdsubcatId);
      setsubfet(res?.data?.isFeatured);
      setcheckswitch(res?.data?.IsDisplayedHome);

      setpram(res?.data?.productRam);
      setpweight(res?.data?.productweight);
      setpsize(res?.data?.size);
    });
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

  const setpreviewfun = (previewArr) => {
    setpreview([...preview, ...previewArr]);
    setformfields({
      ...formfields,
      images: [...formfields.images, ...previewArr],
    });
  };
  const removeImage = (image, index) => {
    deleteData(`/api/category/deleteimage`, { fileId: image.fileId }).then(
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

    if (formfields.isFeatured === "") {
      context.Alertbox("error", "Please Provide Product Featured");
      return false;
    }
    if (Array.isArray(formfields.bannerImage)) {
      formfields.bannerImage = formfields.bannerImage.map((img) => {
        // If img is object with url property, return url string, else return img as is
        if (typeof img === "object" && img !== null && "url" in img) {
          return img.url;
        }
        return img;
      });
    }
    editData(
      `/api/product/updateProduct/${context.isOpenPanel.id}`,
      formfields
    ).then((res) => {
      if (res.error !== true) {
        setisLoading(false);
        context.Alertbox("success", res.message);
        console.log(res);

        context.setisOpenPanel(false);
        setpreview([]);
        history("/product");
      } else {
        context.Alertbox("error", res.message);
      }
    });
  };
  const selectram = (ram) => {
    formfields.productRam = ram._id;
    formfields.ramname = ram.ram;
  };
  const handlebanner = (e) => {
    setcheckswitch(e.target.checked);
    formfields.IsDisplayedHome = e.target.checked;
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
     <section className="p-4 sm:p-5 bg-gray-50">
  <form className="p-4 sm:p-8 py-3" onSubmit={handlesubmit}>
    <div className="scroll max-h-[70vh] pr-2 sm:pr-4 overflow-y-auto">
      {/* Product Name */}
      <div className="mb-4">
        <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Name</h3>
        <input
          type="text"
          name="name"
          value={formfields.name}
          onChange={onChangeInput}
          className="w-full h-[40px] sm:h-[45px] rounded-md px-4 border border-gray-300 focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* Product Description */}
      <div className="mb-4">
        <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Description</h3>
        <textarea
          name="description"
          value={formfields.description}
          onChange={onChangeInput}
          className="w-full h-[100px] rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Category */}
        <div>
          <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Category</h3>
          {context.catData.length !== 0 && (
            <Select
              name="productCat"
              value={Cat}
              onChange={handleChange}
              className="w-full bg-white rounded-md h-[45px]"
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

        {/* Sub Category */}
        <div>
          <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Sub Category</h3>
          {context.catData.length !== 0 && (
            <Select
              value={subCat}
              onChange={handleChangesub}
              className="w-full bg-white rounded-md h-[45px]"
            >
              {context.catData.flatMap((cat) =>
                cat.children.map((subcat, index) => (
                  <MenuItem
                    key={index}
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

        {/* Third Level Category */}
        <div>
          <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Third Level Category</h3>
          {context.catData.length !== 0 && (
            <Select
              value={thirdsubCat}
              onChange={handleChangethirdsub}
              className="w-full bg-white rounded-md h-[45px]"
            >
              {context.catData.flatMap((cat) =>
                cat.children.flatMap((subcat) =>
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

        {/* Price */}
        <div>
          <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Price</h3>
          <input
            type="number"
            name="price"
            value={formfields.price}
            onChange={onChangeInput}
            className="w-full h-[45px] rounded-md px-4 border border-gray-300 focus:outline-none focus:border-gray-500 no-spinner"
          />
        </div>

        {/* Old Price */}
<div>
  <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Old Price</h3>
  <input
    type="number"
    name="oldprice"
    value={formfields.oldprice}
    onChange={onChangeInput}
    className="w-full h-[45px] rounded-md px-4 border border-gray-300 focus:outline-none focus:border-gray-500 no-spinner"
  />
</div>

{/* Featured */}
<div>
  <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Featured</h3>
  <Select
    value={subfet}
    onChange={FeaturedhandleChange}
    className="w-full bg-white rounded-md h-[45px]"
  >
    <MenuItem value={true}>True</MenuItem>
    <MenuItem value={false}>False</MenuItem>
  </Select>
</div>

{/* Stock */}
<div>
  <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Stock</h3>
  <input
    type="number"
    name="countInStock"
    value={formfields.countInStock}
    onChange={onChangeInput}
    className="w-full h-[45px] rounded-md px-4 border border-gray-300 focus:outline-none focus:border-gray-500 no-spinner"
  />
</div>

{/* Brand */}
<div>
  <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Brand</h3>
  <input
    type="text"
    name="brand"
    value={formfields.brand}
    onChange={onChangeInput}
    className="w-full h-[45px] rounded-md px-4 border border-gray-300 focus:outline-none focus:border-gray-500"
  />
</div>

{/* Discount */}
<div>
  <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Discount</h3>
  <input
    type="number"
    name="discount"
    value={formfields.discount}
    onChange={onChangeInput}
    className="w-full h-[45px] rounded-md px-4 border border-gray-300 focus:outline-none focus:border-gray-500 no-spinner"
  />
</div>

{/* Rams */}
<div>
  <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Rams</h3>
  {pramData.length !== 0 && (
    <Select
      multiple
      value={pram}
      onChange={RamhandleChange}
      className="w-full bg-white rounded-md h-[45px]"
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

{/* Weight */}
<div>
  <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Weight</h3>
  {pweightData.length !== 0 && (
    <Select
      multiple
      value={pweight}
      onChange={weighthandleChange}
      className="w-full bg-white rounded-md h-[45px]"
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

{/* Size */}
<div>
  <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Size</h3>
  {psizeData.length !== 0 && (
    <Select
      multiple
      value={psize}
      onChange={sizehandleChange}
      className="w-full bg-white rounded-md h-[45px]"
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

{/* Rating */}
<div className="flex flex-col justify-center">
  <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Product Rating</h3>
  <Rating
    name="half-rating"
    value={formfields.rating}
    onChange={onChangeRating}
    precision={0.5}
  />
</div>

      </div>

      {/* Media & Publish */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Media & Publish</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {preview.length > 0 &&
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden h-[150px] bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
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
            multiple
            setpreviewfun={setpreviewfun}
          />
        </div>
      </div>

      {/* Banner Images */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold">Banner Images</h3>
          <Switch onChange={handlebanner} checked={checkswitch} {...label} />
        </div>
        {formfields.IsDisplayedHome && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-6">
              {bannerpreview.length > 0 &&
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
                    <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden h-[150px] bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                      <LazyLoadImage
                        alt="Banner"
                        effect="blur"
                        className="w-full h-full object-cover"
                        src={typeof image === "string" ? image : image.url}
                      />
                    </div>
                  </div>
                ))}

              <FileUploadBox
                url="/api/product/uploadbannerimage"
                multiple
                name="bannerImage"
                setpreviewfun={setpreviewbannerfun}
              />
            </div>
            <div className="mt-4">
              <h3 className="text-sm sm:text-[16px] font-semibold mb-2">Banner Title</h3>
              <input
                type="text"
                name="bannerTitle"
                value={formfields.bannerTitle}
                onChange={onChangeInput}
                className="w-full h-[45px] rounded-md px-4 border border-gray-300 focus:outline-none focus:border-gray-500"
              />
            </div>
          </>
        )}
      </div>
    </div>

    <Button
      type="submit"
      className="!bg-primary !text-white items-center mt-4 w-full gap-2 !pl-12"
    >
      <IoMdCloudUpload className="text-[25px]" /> Publish Product
      {isLoading && <CircularProgress color="inherit" size={20} />}
    </Button>
  </form>
</section>

    </>
  );
}
