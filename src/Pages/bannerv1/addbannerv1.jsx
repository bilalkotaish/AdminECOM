import { Button, CircularProgress, MenuItem, Select } from "@mui/material";
import { useContext, useState } from "react";
import { Mycontext } from "../../App";
import FileUploadBox from "../../Components/UploadBox";
import { IoMdCloudUpload } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { deleteData, postData } from "../../utils/api";

export default function Addbannerv1() {
  const [Cat, setCat] = useState("");
  const context = useContext(Mycontext);
  const [preview, setpreview] = useState([]);
  const [subCat, setsubCat] = useState("");
  const [info, setinfo] = useState("");

  const [thirdsubCat, setthirdsubCat] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const handleChangesub = (event) => {
    setsubCat(event.target.value);
    formfields.subcatId = event.target.value;
    setisLoading(true);

    fetchData(`/api/product/productSub/${event.target.value}`)
      .then((res) => {
        const safeData = Array.isArray(res?.data) ? res.data : [];
        setProduct(safeData);
        setisLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProduct([]); // fallback to empty list
        setisLoading(false);
      });
  };

  const handleChangethirdsub = (event) => {
    setthirdsubCat(event.target.value);
    formfields.thirdsubcatId = event.target.value;
    setisLoading(true);
    fetchData(`/api/product/productthirdSub/${event.target.value}`)
      .then((res) => {
        const safeData = Array.isArray(res?.data) ? res.data : [];
        setProduct(safeData);
        setisLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setisLoading(false);
        setProduct([]); // fallback to empty list
      });
  };
  const [formfields, setformfields] = useState({
    title: "",
    catId: "",
    image: [],
    subcatId: "",
    thirdsubcatId: "",
    price: "",
    info: "",
  });
  const onChangeInput = (e) => {
    console.log(e.target.name);
    const { name, value } = e.target;
    setformfields(() => {
      return { ...formfields, [name]: value };
    });
  };

  const removeImage = (image, index) => {
    deleteData(`/api/bannerv1/deleteimage`, { fileId: image.fileId }).then(
      (res) => {
        console.log("Deleted:", res);
        setpreview(preview.filter((item, i) => i !== index));
        setformfields({
          ...formfields,
          image: formfields.image.filter((item, i) => i !== index),
        });
      }
    );
  };
  const setpreviewfun = (previewArr) => {
    setpreview([...preview, ...previewArr]);
    setformfields({
      ...formfields,
      image: [...formfields.image, ...previewArr],
    });
  };
  const handleChange = (event) => {
    setCat(event.target.value);
    formfields.catId = event.target.value;
  };

  const handleChangeInfo = (event) => {
    setinfo(event.target.value);
    formfields.info = event.target.value;
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(formfields);
    setisLoading(true);
    if (formfields.title === "") {
      context.Alertbox("error", "Please Provide Category Name");
      return false;
    }
    if (formfields.image.length === 0) {
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
    if (formfields.price === "") {
      context.Alertbox("error", "Please Provide Product Price");
      return false;
    }

    postData("/api/bannerv1/create", formfields).then((res) => {
      console.log(res);
      if (res.error !== true) {
        setisLoading(false);
        context.Alertbox("success", res.message);
        console.log(res);

        setpreview([]);
        context.setisOpenPanel(false);
        history("/homebannerv1/list");
      } else {
        context.Alertbox("error", res.message);
      }
    });
  };
  return (
    <>
    <section className="p-4 sm:p-6 md:p-8 bg-gray-50">
  <form className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8" onSubmit={handlesubmit}>
    {/* Form Fields */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {/* Banner Title */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Banner Title</h3>
        <input
          type="text"
          name="title"
          value={formfields?.title}
          onChange={onChangeInput}
          className="w-full h-[40px] rounded-md px-3 border border-gray-300 focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Category</h3>
        {context.catData.length > 0 && (
          <Select
            name="productCat"
            value={Cat}
            onChange={handleChange}
            className="w-full bg-white rounded-md h-[40px]"
            size="small"
          >
            {context.catData.map((cat, index) => (
              <MenuItem key={index} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        )}
      </div>

      {/* Sub Category */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Product Sub Category</h3>
        {context.catData.length > 0 && (
          <Select
            name="subcat"
            value={subCat}
            onChange={handleChangesub}
            className="w-full bg-white rounded-md h-[40px]"
            size="small"
          >
            {context.catData.flatMap((cat) =>
              cat.children.map((subcat, index) => (
                <MenuItem key={index} value={subcat._id}>
                  {subcat.name}
                </MenuItem>
              ))
            )}
          </Select>
        )}
      </div>

      {/* Third Level Category */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Third Level Category</h3>
        {context.catData.length > 0 && (
          <Select
            name="thirdsubcat"
            value={thirdsubCat}
            onChange={handleChangethirdsub}
            className="w-full bg-white rounded-md h-[40px]"
            size="small"
          >
            {context.catData.flatMap((cat) =>
              cat.children.flatMap((subcat) =>
                subcat.children.map((third, index) => (
                  <MenuItem key={index} value={third._id}>
                    {third.name}
                  </MenuItem>
                ))
              )
            )}
          </Select>
        )}
      </div>

      {/* Info Position */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Banner Info Position</h3>
        <Select
          name="info"
          value={info}
          onChange={handleChangeInfo}
          className="w-full bg-white rounded-md h-[40px]"
          size="small"
        >
          <MenuItem value="left">Left</MenuItem>
          <MenuItem value="right">Right</MenuItem>
        </Select>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Price</h3>
        <input
          type="text"
          name="price"
          value={formfields?.price}
          onChange={onChangeInput}
          className="w-full h-[40px] rounded-md px-3 border border-gray-300 focus:outline-none focus:border-gray-500"
        />
      </div>
    </div>

    {/* Image Upload Section */}
    <div className="max-h-[70vh] overflow-y-auto pr-1 sm:pr-3 mb-6">
      <h3 className="text-base font-semibold mb-3">Images</h3>
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden h-[150px] w-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center">
                <LazyLoadImage
                  alt={`Category Image ${index + 1}`}
                  effect="blur"
                  className="w-full h-full object-cover"
                  src={image.url}
                />
              </div>
            </div>
          ))}

        <FileUploadBox
          multiple={true}
          url="/api/bannerv1/upload"
          setpreviewfun={setpreviewfun}
        />
      </div>
    </div>

    {/* Submit Button */}
    <Button
      type="submit"
      className="!bg-primary !text-white w-full flex items-center justify-center gap-2 py-2 px-4 text-base sm:text-lg font-medium rounded-md"
    >
      <IoMdCloudUpload className="text-xl" />
      Publish BannerV1
      {isLoading && <CircularProgress color="inherit" size={20} />}
    </Button>
  </form>
</section>

    </>
  );
}
