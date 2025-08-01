import { useRef, useState, useContext } from "react";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { Mycontext } from "../../App";
import { UploadImages } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

export default function FileUploadBox(props) {
  const [preview, setpreview] = useState([]);
  const [upload, setupload] = useState(false);
  const context = useContext(Mycontext);
  const onchangefile = async (e, apiEndPoint) => {
    try {
      setpreview([]);
      const files = e.target.files;
      setupload(true);

      const formData = new FormData();

      // Append all valid image files
      for (let i = 0; i < files.length; i++) {
        if (
          files[i] &&
          ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
            files[i].type
          )
        ) {
          formData.append("images", files[i]);
        } else {
          context.Alertbox("error", "Please select only image files");
          setupload(false);
          return;
        }
      }

      // Upload once with all valid files
      const res = await UploadImages(apiEndPoint, formData);
      console.log("Response data:", res);

      if (res?.images) {
        setupload(false);
        // props.setpreview(res.images);
        props.setpreviewfun(res.images);
        context.Alertbox("success", "Image Uploaded Successfully");
      } else {
        throw new Error("No images returned");
      }
    } catch (error) {
      console.log("Upload error:", error);
      setupload(false);
    }
  };

  return (
    <div
      className="uploadbox p-3 rounded-md overflow-hidden border-2 border-dashed border-[rgba(0,0,0,0.2)] h-[150px]
     w-[100%] bg-gray-100 cursor-pinter hover:bg-gray-300 flex items-center justify-center flex-col relative"
    >
      {upload === true ? (
        <>
          <CircularProgress color="inherit" />
          <h4 className="text-[12px]">Uploading...</h4>
        </>
      ) : (
        <>
          <MdOutlinePhotoSizeSelectActual className="text-[40px] opacity-45 pinter-events-none" />
          <h4>Image Upload</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onchangefile(e, props.url)}
            name="images"
            multiple={props.multiple !== undefined ? props.multiple : false}
            className="absolute top-0 left-0 w-full h-full z-50 opacity-0"
          />{" "}
        </>
      )}
    </div>
  );
}
