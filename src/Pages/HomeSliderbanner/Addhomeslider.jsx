import { useContext, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoMdCloudUpload } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import FileUploadBox from "../../Components/UploadBox";
import Button from "@mui/material/Button";
import { Mycontext } from "../../App";
import { useNavigate } from "react-router-dom";
import { deleteData, postData } from "../../utils/api";
import { CircularProgress } from "@mui/material";

export default function AddHomeSlider() {
  const [preview, setpreview] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const context = useContext(Mycontext);
  const history = useNavigate();

  const [formfields, setformfields] = useState({
    images: [],
  });
  const setpreviewfun = (previewArr) => {
    setpreview([...preview, ...previewArr]);
    setformfields({
      ...formfields,
      images: [...formfields.images, ...previewArr],
    });
  };
  const removeImage = (image, index) => {
    deleteData(`/api/homebanner/deleteimage`, { fileId: image.fileId }).then(
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
    setisLoading(true);
    postData("/api/homebanner/create", formfields).then((res) => {
      if (res.error !== true) {
        setisLoading(false);
        context.Alertbox("success", res.message);
        console.log(res);
        setformfields({ images: [] });
        setpreview([]);
        context.setisOpenPanel(false);
        history("/homebanner/list");
      } else {
        context.Alertbox("error", res.message);
      }
    });
  };
  return (
    <>
      <section className="p-4 sm:p-6 md:p-8 bg-gray-50">
  <form className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8" onSubmit={handlesubmit}>
    {/* Header */}
    <div className="mb-6">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Media & Publish</h3>
    </div>

    {/* Scrollable Preview & Upload */}
    <div className="max-h-[70vh] overflow-y-auto pr-1 sm:pr-3 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {preview.length !== 0 &&
          preview.map((image, index) => (
            <div className="relative group" key={index}>
              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeImage(image, index);
                }}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-md"
              >
                <IoCloseSharp className="text-sm" />
              </button>

              {/* Image Preview */}
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

        {/* Upload Box */}
        <FileUploadBox
          multiple={false}
          url="/api/homebanner/upload"
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
      Publish HomeSlider
      {isLoading && <CircularProgress color="inherit" size={20} />}
    </Button>
  </form>
</section>

    </>
  );
}
