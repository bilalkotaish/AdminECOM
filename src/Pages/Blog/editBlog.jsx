import { useState, useContext, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoMdCloudUpload } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import FileUploadBox from "../../Components/UploadBox";
import Button from "@mui/material/Button";
import { deleteData, editData, fetchData, postData } from "../../utils/api";
import { Mycontext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Editor from "react-simple-wysiwyg";

export default function EditBlog() {
  const [preview, setpreview] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [Html, setHtml] = useState("");

  const context = useContext(Mycontext);
  const history = useNavigate();

  const [formfields, setformfields] = useState({
    title: "",
    image: [],
    description: "",
  });

  useEffect(() => {
    const id = context.isOpenPanel?.id;
    console.log("Panel ID:", id);
    if (id) {
      fetchData(`/api/blog/${id}`).then((res) => {
        console.log(res);

        (formfields.title = res.data.title),
          (formfields.image = res.data.image),
          (formfields.description = res.data.description),
          setpreview(res.data.image);
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
      image: [...formfields.image, ...previewArr],
    });
  };
  const removeImage = (image, index) => {
    deleteData(`/api/blog/deleteimage`, { fileId: image.fileId }).then(
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
  const handleEditorChange = (e) => {
    setHtml(e.target.value);
    formfields.description = e.target.value;
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(formfields);
    setisLoading(true);

    if (formfields.title === "") {
      context.Alertbox("error", "Please Provide Blog Title");
      return false;
    }
    if (formfields.description === "") {
      context.Alertbox("error", "Please Provide Blog  Description");
      return false;
    }
    if (formfields.image.length === 0) {
      context.Alertbox("error", "Please Provide Blog  Image");
      return false;
    }

    editData(`/api/blog/${context.isOpenPanel.id}`, formfields).then((res) => {
      if (res.error !== true) {
        setisLoading(false);
        context.Alertbox("success", res.message);
        console.log(res);
        setformfields({
          title: "",
          description: "",
          image: [],
        });
        setpreview([]);
        context.setisOpenPanel(false);
        history("/bloglist");
      } else {
        context.Alertbox("error", res.message);
      }
    });
  };

  return (
    <>
      <section className="p-5 bg-gray-50">
        <form className="p-8 py-3 " onSubmit={handlesubmit}>
          <div className="grid grid-cols-1 mb-3 gap-4">
            <div className="col w-[50%]">
              <h3 className="text-[16px] font-[600] mb-2">Blog Title</h3>
              <input
                type="text"
                name="title"
                value={formfields?.title}
                onChange={onChangeInput}
                className="w-full h-[35px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
            <div className="col w-[100%]">
              <h3 className="text-[16px] font-[600] mb-2">Blog description</h3>
              <Editor
                type="text"
                name="description"
                value={formfields?.description}
                onChange={handleEditorChange}
                containerProps={{ style: { resize: "vertical" } }}
                className="w-full h-[35px] rounded-md p-5 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
          <div className="scroll max-h-[75vh] pr-4 overflow-y-auto">
            <div className="w-full p-5 px-0">
              <h3 className="text-lg font-semibold mb-2">Blog Image</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-6">
              {preview?.length !== 0 &&
                preview?.map((image, index) => (
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
                        alt={`Image ${index + 1}`}
                        effect="blur"
                        className="w-full h-full object-cover"
                        src={image.url}
                      />
                    </div>
                  </div>
                ))}

              <FileUploadBox
                multiple={true}
                url="/api/blog/upload"
                setpreviewfun={setpreviewfun}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="!bg-primary !text-white items-center mt-4 w-full !pr-2 gap-2 !pl-12"
          >
            <IoMdCloudUpload className="text-[25px] " /> Publish Blog
            {isLoading && <CircularProgress color="inherit" size={20} />}
          </Button>
        </form>
      </section>
    </>
  );
}
