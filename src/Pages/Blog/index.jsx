import { Button, MenuItem, Pagination, Select, Tooltip } from "@mui/material";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDeleteOutline, MdOutlineDeleteOutline } from "react-icons/md";
import Checkbox from "@mui/material/Checkbox";
import { IoEyeOutline } from "react-icons/io5";
import { BiExport } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { Mycontext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { deleteData, deleteMultiple, fetchData } from "../../utils/api";
export default function BlogTable() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const context = useContext(Mycontext);
  const [Sorting, setSorting] = useState([]);
  const [Blog, setBlog] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(1);

  // Pagination handler
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Slice the blog data according to current page
  const paginatedBlog = Blog.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleLimitChange = (event) => {
    const value = parseInt(event.target.value); // Convert from string to number
    setRowsPerPage(value);
    setPage(1); // Reset to first page whenever the per-page value changes
  };
  useEffect(() => {
    getData();
  }, [context.isOpenPanel, page, rowsPerPage]);

  const getData = () => {
    fetchData(`/api/blog/get?page=${page}&perpage=${rowsPerPage}`).then(
      (res) => {
        if (res.success) {
          const blogWithCheck = res.data.map((item) => ({
            ...item,
            checked: false,
          }));
          setBlog(blogWithCheck);
          setTotalPages(res.pages);
        }
      }
    );
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    const updatedBlog = Blog.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setBlog(updatedBlog);
    console.log("Selected banners:", updatedBlog);
    if (isChecked) {
      const ids = updatedBlog.map((item) => item._id).sort((a, b) => a - b);
      console.log("Selected banner IDs:", ids);
      setSorting(ids);
    } else {
      setSorting([]);
    }
  };
  const handlecheckboxChange = (e, id) => {
    const updatedBlog = Blog.map((item) =>
      item._id === id ? { ...item, checked: e.target.checked } : item
    );
    setBanners(updatedBlog);
    console.log("Selected banners:", updatedBlog);
    if (e.target.checked) {
      const ids = updatedBlog
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
    deleteData(`/api/blog/${id}`).then((res) => {
      context.Alertbox("success", res.message);

      getData();
    });
  };

  const handleDeleteAll = async () => {
    if (Sorting.length > 0) {
      try {
        const res = await deleteMultiple(`/api/blog/delete`, {
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
        Blog List
      </h2>
      <div className="flex items-center justify-end gap-4 mt-4 mb-5 pr-4 px-2 py-0 mt-3">
        <Button
          onClick={() =>
            context.setisOpenPanel({ open: true, model: "Add Blog" })
          }
          className="flex items-center justify-center gap-2 !bg-blue-500 hover:bg-blue-600 !text-white font-semibold py-2 px-4 rounded whitespace-nowrap"
        >
          Add Blog <FaPlus className="text-[15px] font-semibold" />
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
                    Blog.length !== 0
                      ? Blog.every((item) => item.checked)
                      : false
                  }
                />
              </th>
              <th scope="col" className="px-6 py-3">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3 pr-56 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedBlog.length > 0 &&
              paginatedBlog.map((item, idx) => (
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
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">
                    <p>
                      {item.description
                        .replace(/<[^>]+>/g, " ")
                        .replace(/&nbsp;/g, " ")
                        .replace(/\s+/g, " ")
                        .trim()
                        .substring(0, 200)
                        .replace(/\s+\S*$/, "") +
                        (item.description.length > 200 ? "..." : "")}
                    </p>
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
                                model: "Edit Blog",
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

      <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 gap-4">
        <div className="w-full sm:w-auto">
          <label className="font-semibold text-[14px] mb-1 block">
            Items Per Page
          </label>
          <Select
            className="w-full sm:w-[100px]"
            size="small"
            value={rowsPerPage}
            onChange={handleLimitChange}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </div>

        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
          shape="rounded"
          size="medium"
          className="[&_.MuiPaginationItem-root]:!rounded-md"
        />
      </div>
    </div>
  );
}
