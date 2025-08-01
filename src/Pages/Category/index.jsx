import { Button, Pagination, Tooltip } from "@mui/material";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Checkbox from "@mui/material/Checkbox";
import { IoEyeOutline } from "react-icons/io5";
import { BiExport } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { Mycontext } from "../../App";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { fetchData, deleteData } from "../../utils/api";
export default function CategoryList() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const context = useContext(Mycontext);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(context.catData.length / rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const paginatedData = context.catData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    fetchData("/api/category/getcategory").then((res) => {
      console.log("Fetched category data:", res);
      context.setCatData(res.categories || []);
    });
  }, []);

  const handleDelete = (id) => {
    deleteData(`/api/category/${id}`).then((res) => {
      console.log(res.data);
      fetchData("/api/category/getcategory").then((res) => {
        console.log("Fetched category data:", res);
        context.setCatData(res.categories || []);
      });
    });
  };

  return (
    <div className="card my-6 shadow-lg sm:rounded-xl bg-white border border-gray-100">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Category List</h2>
        <div className="flex gap-3">
          <Button className="flex items-center gap-2 !bg-green-500 hover:bg-green-600 !text-white font-semibold px-4 py-2 rounded">
            Export <BiExport className="text-lg" />
          </Button>
          <Button
            onClick={() =>
              context.setisOpenPanel({ open: true, model: "Add Category" })
            }
            className="flex items-center gap-2 !bg-blue-500 hover:bg-blue-600 !text-white font-semibold px-4 py-2 rounded"
          >
            Add Category <FaPlus className="text-base" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-16 py-3">Image</th>
              <th className="px-6 py-3">Category Name</th>
              <th className="px-6 py-3 text-right pr-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b border-gray-100 hover:bg-gray-50 transition duration-200"
              >
                <td className="px-16 py-4">
                  <div className="flex items-center">
                    <LazyLoadImage
                      alt={item.name || "category image"}
                      effect="blur"
                      className="w-[60px] h-[60px] object-cover rounded-md border border-gray-200"
                      src={item.images?.[0]?.url || "/placeholder.jpg"}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <h1 className="font-medium">{item.name || "N/A"}</h1>
                </td>
                <td className="px-6 py-4 text-right pr-28">
                  <div className="flex justify-end items-center space-x-2">
                    <Tooltip title="Edit" placement="top" arrow>
                      <Button
                        className="!min-w-[32px] !h-8 !p-0 !bg-green-50 hover:!bg-green-100 !rounded-md"
                        variant="text"
                      >
                        <AiTwotoneEdit
                          onClick={() =>
                            context.setisOpenPanel({
                              open: true,
                              model: "Edit Category",
                              id: item._id,
                            })
                          }
                          className="text-green-600 text-lg"
                        />
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage" className="text-sm text-gray-600">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="px-2 py-1 border rounded-md text-sm"
          >
            {[5, 10, 25, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          shape="rounded"
          size="medium"
          className="[&_.MuiPaginationItem-root]:!rounded-md"
        />
      </div>
    </div>
  );
}
