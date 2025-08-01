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
      <section className="p-5 bg-gray-50">
        <form className="p-8 py-3 " onSubmit={handlesubmit}>
          <div className="scroll max-h-[75vh] pr-4 overflow-y-scroll">
            <div className="col w-full p-5 px-0">
              <h3 className="text-[22px] font-[600] mb-4"> Media & Publish</h3>
            </div>
            <div className="grid grid-cols-6 pb-4 gap-3">
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
                multiple={false}
                url="/api/homebanner/upload"
                setpreviewfun={setpreviewfun}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="!bg-primary !text-white items-center mt-4 w-full !pr-2 gap-2 !pl-12"
          >
            <IoMdCloudUpload className="text-[25px] " /> Publish HomeSlider
            {isLoading && <CircularProgress color="inherit" size={20} />}
          </Button>
        </form>
      </section>
    </>
  );
}
