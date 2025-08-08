import { Button, MenuItem, Pagination, Select, Tooltip } from "@mui/material";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDeleteOutline, MdOutlineDeleteOutline } from "react-icons/md";
import Checkbox from "@mui/material/Checkbox";
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
      if (res.success && Array.isArray(res.data)) {
        const BannerArr = res.data.map((item) => ({
          ...item,
          checked: false,
        }));
        setBanners(BannerArr);
      } else {
        setBanners([]);
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
    setSorting(isChecked ? updatedBanners.map((item) => item._id) : []);
  };

  const handlecheckboxChange = (e, id) => {
    const updatedBanners = banners.map((item) =>
      item._id === id ? { ...item, checked: e.target.checked } : item
    );
    setBanners(updatedBanners);
    const selectedIds = updatedBanners
      .filter((item) => item.checked)
      .map((item) => item._id);
    setSorting(selectedIds);
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
          getData();
        } else {
          context.Alertbox("error", res.message || "Deletion failed.");
        }
      } catch {
        context.Alertbox("error", "An error occurred while deleting.");
      }
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedBanners = banners.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="card my-6 shadow-lg sm:rounded-xl bg-white border border-gray-100">
      {/* Header */}
      <h2 className="px-4 sm:px-6 py-4 text-lg sm:text-xl font-semibold text-gray-800">
        Banner V1 List
      </h2>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3">
        <Button
          onClick={() =>
            context.setisOpenPanel({ open: true, model: "Add Banner V1" })
          }
          className="flex items-center gap-2 !bg-blue-500 hover:bg-blue-600 !text-white font-semibold py-2 px-4 rounded whitespace-nowrap"
        >
          Add Banner V1 <FaPlus className="text-[15px]" />
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

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-[600px] w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 sm:px-6 py-3 w-12">
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
              <th className="px-4 sm:px-6 py-3">Image</th>
              <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedBanners.length > 0 ? (
              paginatedBanners.map((item, idx) => (
                <tr
                  key={idx}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <Checkbox
                      {...label}
                      size="small"
                      checked={item.checked === true}
                      onChange={(e) => handlecheckboxChange(e, item._id)}
                    />
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-wrap gap-3">
                      {Array.isArray(item.image) && item.image.length > 0 ? (
                        item.image.map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={`Banner ${index}`}
                            className="w-[250px] h-[100px] object-cover rounded-md border border-gray-200 shadow-sm hover:scale-105 transition-transform"
                          />
                        ))
                      ) : (
                        <span className="text-gray-400">No image available</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex justify-end items-center gap-2">
                      <Tooltip title="Edit" placement="top" arrow>
                        <Button
                          className="!min-w-[32px] !h-8 !p-0 !bg-green-50 hover:!bg-green-100 !rounded-md"
                          variant="text"
                          onClick={() =>
                            context.setisOpenPanel({
                              open: true,
                              model: "Edit Banner V1",
                              id: item._id,
                            })
                          }
                        >
                          <AiTwotoneEdit className="text-green-600 text-lg" />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top" arrow>
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
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No banners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-t border-gray-200">
      <div className="flex items-center gap-2">
    <span className="text-sm text-gray-700">Rows per page:</span>
    <Select
      value={rowsPerPage}
      onChange={(e) => {
        setRowsPerPage(e.target.value);
        setPage(1); // reset to first page
      }}
      size="small"
    >
      {[5, 10, 20, 50].map((num) => (
        <MenuItem key={num} value={num}>
          {num}
        </MenuItem>
      ))}
    </Select>
  </div>
        <Pagination
          count={Math.ceil(banners.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          size="medium"
          className="[&_.MuiPaginationItem-root]:rounded-md"
        />
      </div>
    </div>
  );
}
