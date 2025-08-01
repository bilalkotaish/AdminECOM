import { useState, useContext, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoMdCloudUpload } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import FileUploadBox from "../../Components/UploadBox";
import Button from "@mui/material/Button";
import { deleteData, editData, postData } from "../../utils/api";
import { Mycontext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchData } from "../../utils/api";

export default function EditCategory() {
  const [preview, setpreview] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const context = useContext(Mycontext);

  const [formfields, setformfields] = useState({
    name: "",
    images: [],
  });
  useEffect(() => {
    const id = context.isOpenPanel?.id;
    console.log("Panel ID:", id);
    if (id) {
      fetchData(`/api/category/${id}`).then((res) => {
        console.log(res);
        setformfields({
          name: res.name,
          images: res.images,
        });
        setpreview(res.images);
      });
    }
  }, [context.isOpenPanel?.id]);

  const onChangeInput = (e) => {
    console.log(e.target.name);
    const { name, value } = e.target;
    setformfields(() => {
      return { ...formfields, [name]: value };
    });
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

    editData(`/api/category/${context.isOpenPanel.id}`, formfields).then(
      (res) => {
        if (res.error !== true) {
          setisLoading(false);
          context.Alertbox("success", res.message);
          console.log(res);
          setformfields({
            name: "",
            images: [],
          });
          setpreview([]);
          context.setisOpenPanel(false);
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
          <div className="grid grid-cols-1 mb-3 gap-4">
            <div className="col w-[34%]">
              <h3 className="text-[16px] font-[600] mb-2">Category Name</h3>
              <input
                type="text"
                name="name"
                value={formfields.name}
                onChange={onChangeInput}
                className="w-full h-[35px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
          <div className="scroll max-h-[75vh] pr-4 overflow-y-auto">
            <div className="w-full p-5 px-0">
              <h3 className="text-lg font-semibold mb-2">Category Image</h3>
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
                        alt={image}
                        effect="blur"
                        className="w-full h-full object-cover"
                        src={image.url}
                      />
                    </div>
                  </div>
                ))}

              <FileUploadBox
                multiple={true}
                url="/api/category/upload"
                setpreviewfun={setpreviewfun}
              />
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
