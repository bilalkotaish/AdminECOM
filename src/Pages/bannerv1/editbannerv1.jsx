import { Button, CircularProgress, MenuItem, Select } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Mycontext } from "../../App";
import FileUploadBox from "../../Components/UploadBox";
import { IoMdCloudUpload } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { deleteData, editData, fetchData, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function Editbannerv1() {
  const [Cat, setCat] = useState("");
  const context = useContext(Mycontext);
  const [preview, setpreview] = useState([]);
  const [subCat, setsubCat] = useState("");
  const [thirdsubCat, setthirdsubCat] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const history = useNavigate();
  const [info, setinfo] = useState("");

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
  const handleChangeInfo = (event) => {
    setinfo(event.target.value);
    formfields.info = event.target.value;
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

  useEffect(() => {
    const id = context.isOpenPanel?.id;
    console.log("Panel ID:", id);
    if (id) {
      fetchData(`/api/bannerv1/${context.isOpenPanel?.id}`).then((res) => {
        console.log(res);

        (formfields.title = res.data.title),
          (formfields.catId = res.data.catId),
          (formfields.image = res.data.image),
          (formfields.subcatId = res.data.subcatId),
          (formfields.thirdsubcatId = res.data.thirdsubcatId),
          (formfields.price = res.data.price),
          (formfields.info = res.data.info);
        setpreview(res.data.image);
        setCat(res.data.catId);
        setsubCat(res.data.subcatId);
        setthirdsubCat(res.data.thirdsubcatId);
        setinfo(res.data.info);
      });
    }
  }, [context.isOpenPanel]);

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

    editData(`/api/bannerv1/${context.isOpenPanel?.id}`, formfields).then(
      (res) => {
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
      }
    );
  };
  return (
    <>
      <section className="p-5 bg-gray-50">
        <form className="p-8 py-3 " onSubmit={handlesubmit}>
          <div className="grid grid-cols-5 mb-3 gap-2">
            <div className="col ">
              <h3 className="text-[16px] font-[600] mb-2">Banner Title</h3>
              <input
                type="text"
                name="title"
                value={formfields?.title}
                onChange={onChangeInput}
                className="w-full h-[35px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>

            <div className="col  ">
              <h3 className="text-[16px] font-[600] mb-2">Category</h3>
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
                    <MenuItem key={index} value={cat._id}>
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
                  id="subcat"
                  name="subcat"
                  value={subCat}
                  className="w-full bg-white rounded-md h-[45px]"
                  label="subCategory"
                  onChange={handleChangesub}
                >
                  {context.catData.map((cat, index) =>
                    cat.children.map((subcat, index) => (
                      <MenuItem key={index} value={subcat._id}>
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
                  id="thirdsubcat"
                  name="thirdsubcat"
                  value={thirdsubCat}
                  className="w-full bg-white rounded-md h-[45px]"
                  label="thirdsubCategory"
                  onChange={handleChangethirdsub}
                >
                  {context.catData.map((cat, index) =>
                    cat.children.map((subcat, index) =>
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
            <div className="col">
              <h3 className="text-[16px] font-[600] mb-2">
                Banner Info Position
              </h3>
              {context.catData.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="info"
                  name="info"
                  value={info}
                  className="w-full bg-white rounded-md h-[45px]"
                  label="thirdsubCategory"
                  onChange={handleChangeInfo}
                >
                  <MenuItem value={"left"}>Left</MenuItem>
                  <MenuItem value={"right"}>Right</MenuItem>
                </Select>
              )}
            </div>
            <div className="col ">
              <h3 className="text-[16px] font-[600] mb-2">Price</h3>
              <input
                type="text"
                name="price"
                value={formfields?.price}
                onChange={onChangeInput}
                className="w-full h-[42px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
          <div className="scroll max-h-[75vh] pr-4 overflow-y-auto">
            <div className="w-full p-5 px-0">
              <h3 className="text-lg font-semibold mb-2">Image</h3>
            </div>

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

          <Button
            type="submit"
            className="!bg-primary !text-white items-center mt-4 w-full !pr-2 gap-2 !pl-12"
          >
            <IoMdCloudUpload className="text-[25px] " /> Publish BannerV1
            {isLoading && <CircularProgress color="inherit" size={20} />}
          </Button>
        </form>
      </section>
    </>
  );
}
