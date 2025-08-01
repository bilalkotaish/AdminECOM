import { Button, Pagination, Tooltip } from "@mui/material";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDeleteOutline, MdOutlineDeleteOutline } from "react-icons/md";
import Checkbox from "@mui/material/Checkbox";
import { IoEyeOutline } from "react-icons/io5";
import { BiExport } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { Mycontext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { deleteData, deleteMultiple, fetchData } from "../../utils/api";
export default function BannerV1Table() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const context = useContext(Mycontext);
  const [Sorting, setSorting] = useState([]);

  const [banners, setBanners] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getData();
  }, [context.isOpenPanel]);

  const getData = () => {
    fetchData("/api/bannerv1/get").then((res) => {
      let BannerArr = [];

      console.log("Fetched Banner V1 data:", res);
      if (res.success && Array.isArray(res.data)) {
        for (let i = 0; i < res.data.length; i++) {
          BannerArr[i] = res.data[i];
          BannerArr[i].checked = false;
        }
        console.log("Fetched Banner V1 data:", BannerArr);

        setBanners(BannerArr);
      } else {
        setBanners([]); // fallback
      }
    });
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    const updatedBanners = banners.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setBanners(updatedBanners);
    console.log("Selected banners:", updatedBanners);
    if (isChecked) {
      const ids = updatedBanners.map((item) => item._id).sort((a, b) => a - b);
      console.log("Selected banner IDs:", ids);
      setSorting(ids);
    } else {
      setSorting([]);
    }
  };
  const handlecheckboxChange = (e, id) => {
    const updatedBanners = banners.map((item) =>
      item._id === id ? { ...item, checked: e.target.checked } : item
    );
    setBanners(updatedBanners);
    console.log("Selected banners:", updatedBanners);
    if (e.target.checked) {
      const ids = updatedBanners
        .filter((item) => item.checked)
        .map((item) => item._id)
        .sort((a, b) => a - b);
      console.log("Selected banner IDs:", ids);
      setSorting(ids);
    } else {
      setSorting([]);
    }
  };

  const handleDelete = (id) => {
    deleteData(`/api/bannerv1/${id}`).then((res) => {
      context.Alertbox("success", res.message);

      getData();
    });
  };

  const handleDeleteAll = async () => {
    if (Sorting.length > 0) {
      try {
        const res = await deleteMultiple(`/api/bannerv1/delete`, {
          ids: Sorting,
        });

        if (res.success) {
          context.Alertbox("success", res.message);
          getData(); // refresh list
        } else {
          context.Alertbox("error", res.message || "Deletion failed.");
        }
      } catch (error) {
        context.Alertbox("error", "An error occurred while deleting.");
      }
    }
  };

  return (
    <div className="card my-6 shadow-lg sm:rounded-xl bg-white border border-gray-100">
      <h2 className="px-6 py-4 text-xl font-semibold text-gray-800 ">
        Banner V1 List
      </h2>
      <div className="flex items-center justify-end gap-4 mt-4 mb-5 pr-4 px-2 py-0 mt-3">
        <Button
          onClick={() =>
            context.setisOpenPanel({ open: true, model: "Add Banner V1" })
          }
          className="flex items-center justify-center gap-2 !bg-blue-500 hover:bg-blue-600 !text-white font-semibold py-2 px-4 rounded whitespace-nowrap"
        >
          Add Banner V1 <FaPlus className="text-[15px] font-semibold" />
        </Button>
        {Sorting.length > 0 && (
          <Button
            onClick={handleDeleteAll}
            className="flex items-center gap-2 !bg-red-500 hover:!bg-red-600 !text-white font-semibold py-2 px-4 rounded-md"
          >
            Delete <MdDeleteOutline className="text-sm" />
          </Button>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 w-12">
                <Checkbox
                  size="small"
                  {...label}
                  onChange={handleSelectAll}
                  checked={
                    banners.length !== 0
                      ? banners.every((item) => item.checked)
                      : false
                  }
                />
              </th>
              <th scope="col" className="px-6 py-3">
                Image
              </th>
              <th scope="col" className="px-6 py-3 pr-56 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {banners.length > 0 &&
              banners.map((item, idx) => (
                <tr
                  key={idx}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <Checkbox
                      {...label}
                      size="small"
                      checked={item.checked === true}
                      onChange={(e) => handlecheckboxChange(e, item._id)}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {Array.isArray(item.image) && item.image.length > 0 ? (
                        item.image.map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={`Banner ${index}`}
                            className="w-[300px] h-[100px] object-cover rounded-md shadow-sm hover:scale-105 border border-gray-200"
                          />
                        ))
                      ) : (
                        <span className="text-gray-400">
                          No image available
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 pr-44">
                    <div className="flex justify-end items-center space-x-2">
                      <Tooltip title="Delete" placement="top" arrow>
                        <Button
                          className="!min-w-[32px] !h-8 !p-0 !bg-green-50 hover:!bg-green-100 !rounded-md"
                          variant="text"
                        >
                          <AiTwotoneEdit
                            onClick={() =>
                              context.setisOpenPanel({
                                open: true,
                                model: "Edit Banner V1",
                                id: item._id,
                              })
                            }
                            className="text-green-600 text-lg"
                          />
                        </Button>
                        <Button
                          className="!min-w-[32px] !h-8 !p-0 !bg-red-50 hover:!bg-red-100 !rounded-md"
                          variant="text"
                          onClick={() => handleDelete(item._id)}
                        >
                          <MdOutlineDeleteOutline className="text-red-600 text-lg" />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex !justify-end items-center px-6 py-4 border-t border-gray-200">
        <Pagination
          count={5}
          color="primary"
          shape="rounded"
          size="medium"
          className="[&_.MuiPaginationItem-root]:!rounded-md "
        />
      </div>
    </div>
  );
}
