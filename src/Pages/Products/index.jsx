import Button from "@mui/material/Button";
import { FaPlus } from "react-icons/fa6";
import Select from "@mui/material/Select";
import { IoMdAdd, IoMdEye } from "react-icons/io";
import { useContext, useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import { BiExport } from "react-icons/bi";
import { AiTwotoneEdit } from "react-icons/ai";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { Tooltip } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ProgressBar from "../../Components/ProgressBar";
import Searchbox from "../../Components/Searchbox";
import { Mycontext } from "../../App";
import { fetchData, deleteData } from "../../utils/api";
import { MdDeleteOutline } from "react-icons/md";
import { deleteMultiple } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating";

export default function Product() {
  const [categoryfilter, setcategoryfilter] = useState("");
  const [Cat, setCat] = useState("");
  const [subCat, setsubCat] = useState("");
  const [thirdsubCat, setthirdsubCat] = useState("");
  const [product, setProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [perPage, setPerPage] = useState(1);
  const [Sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(false);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const context = useContext(Mycontext);
  const handleChange = (event) => {
    const selectedCat = event.target.value;
    setCat(selectedCat);
    setsubCat("");
    setthirdsubCat("");
    setLoading(true);

    fetchData(`/api/product/products/${selectedCat}`)
      .then((res) => {
        const safeData = Array.isArray(res?.data) ? res.data : [];
        setProduct(safeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProduct([]); // fallback to empty list
        setLoading(false);
      });
  };

  const handleChangesub = (event) => {
    setsubCat(event.target.value);
    setthirdsubCat("");
    setCat("");

    setLoading(true);

    fetchData(`/api/product/productSub/${event.target.value}`)
      .then((res) => {
        const safeData = Array.isArray(res?.data) ? res.data : [];
        setProduct(safeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProduct([]); // fallback to empty list
        setLoading(false);
      });
  };

  const handleChangethirdsub = (event) => {
    setsubCat("");
    setCat("");
    setLoading(true);
    setthirdsubCat(event.target.value);
    fetchData(`/api/product/productthirdSub/${event.target.value}`)
      .then((res) => {
        const safeData = Array.isArray(res?.data) ? res.data : [];
        setProduct(safeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
        setProduct([]); // fallback to empty list
      });
  };
  useEffect(() => {
    fetchData("/api/product/products").then((res) => {
      console.log("Fetched Product data:", res);
      if (res.error === false) {
        setProduct(res.data);
      }
    });
  }, []);
  const getProducts = (page = 1, limit = perPage) => {
    setLoading(true);
    fetchData(`/api/product/products?page=${page}&perpage=${limit}`).then(
      (res) => {
        let productArr = [];
        if (res.error === false) {
          for (let i = 0; i < res.data.length; i++) {
            productArr[i] = res.data[i];
            productArr[i].checked = false;
          }
          console.log("Fetched Product data:", productArr);
          setProduct(productArr);
          setTotalPages(res.totalPages);
          setCurrentPage(res.currentPage);
          setLoading(false);
        } else {
          setLoading(false);
          context.Alertbox("error", res.message || "Failed to fetch products");
        }
      }
    );
  };
  const deleteMultiple = () => {
    if (Sorting.length > 0) {
      deleteMultiple("/api/product/deleteMultiple", {
        ids: Sorting,
      })
        .then((res) => {
          console.log("Deleting IDs:", Sorting);
          if (res.error === false) {
            context.Alertbox("success", "Product Deleted Successfully");
            getProducts();
          } else {
            context.Alertbox(
              "error",
              res.message || "Failed to delete product"
            );
          }
        })
        .catch((err) => {
          console.error("Delete failed:", err);
          context.Alertbox(
            "error",
            "An unexpected error occurred while deleting the product"
          );
        });
    }
  };
  const handleLimitChange = (event) => {
    const limit = parseInt(event.target.value);
    setPerPage(limit);
    getProducts(1, limit); // Reset to first page on limit change
  };

  useEffect(() => {
    getProducts(currentPage);
  }, []);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    getProducts(value, perPage);
  };
  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    const updatedProducts = product.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setProduct(updatedProducts);
    console.log("Selected products:", updatedProducts);
    if (isChecked) {
      const ids = updatedProducts.map((item) => item._id).sort((a, b) => a - b);
      console.log("Selected product IDs:", ids);
      setSorting(ids);
    } else {
      setSorting([]);
    }
  };
  const handleDelete = (id) => {
    deleteData(`/api/product/${id}`)
      .then((res) => {
        if (res.error === false) {
          context.Alertbox("success", "Product Deleted Successfully");
          getProducts();
        } else {
          context.Alertbox("error", res.message || "Failed to delete product");
        }
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        context.Alertbox(
          "error",
          "An unexpected error occurred while deleting the product"
        );
      });
  };
  const handlecheckboxChange = (e, id) => {
    const updatedProducts = product.map((item) =>
      item._id === id ? { ...item, checked: e.target.checked } : item
    );
    setProduct(updatedProducts);
    console.log("Selected products:", updatedProducts);
    if (e.target.checked) {
      const ids = updatedProducts
        .filter((item) => item.checked)
        .map((item) => item._id)
        .sort((a, b) => a - b);
      console.log("Selected product IDs:", ids);
      setSorting(ids);
    } else {
      setSorting([]);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 mt-4">
        <h1 className="text-xl font-semibold mb-2 md:mb-0">Products</h1>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button className="flex items-center gap-2 !bg-green-500 hover:!bg-green-600 !text-white font-semibold py-2 px-4 rounded-md">
            Export <BiExport className="text-lg" />
          </Button>
          <Button
            onClick={() =>
              context.setisOpenPanel({ open: true, model: "Add Product" })
            }
            className="flex items-center gap-2 !bg-blue-500 hover:!bg-blue-600 !text-white font-semibold py-2 px-4 rounded-md"
          >
            Add Product <FaPlus className="text-sm" />
          </Button>
          {Sorting.length > 0 && (
            <Button
              onClick={deleteMultiple}
              className="flex items-center gap-2 !bg-red-500 hover:!bg-red-600 !text-white font-semibold py-2 px-4 rounded-md"
            >
              Delete <MdDeleteOutline className="text-sm" />
            </Button>
          )}
        </div>
      </div>

      <div className="card mt-4 mb-6 shadow-lg sm:rounded-xl bg-white">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 border-b">
          <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4 px-2">
            {/* Category Filter */}
            <div className="w-full md:w-[150px]">
              <label className="text-sm font-semibold mb-2 block text-gray-700">
                Filter By Category
              </label>
              {Array.isArray(context?.catData) &&
                context.catData.length > 0 && (
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
            <div className="w-full md:w-[180px]">
              <label className="text-sm font-semibold mb-2 block text-gray-700">
                Filter By Sub Category
              </label>
              {context.catData.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="ProductCat"
                  name="productCat"
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
            <div className="w-full md:w-[250px]">
              <label className="text-sm text-[12px] block font-semibold mb-2  text-gray-700">
                Filter By Third Level Category
              </label>
              {context.catData.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="ProductCat"
                  name="productCat"
                  value={thirdsubCat}
                  className="w-full bg-white rounded-md h-[45px]"
                  label="subCategory"
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

            {/* Search Box */}
            <div className="w-full md:w-[300px]">
              <label className="text-sm font-semibold  block text-gray-700">
                Search
              </label>
              <Searchbox />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">
                  <Checkbox
                    size="small"
                    {...label}
                    onChange={handleSelectAll}
                    checked={
                      product.length !== 0
                        ? product.every((item) => item.checked)
                        : false
                    }
                  />
                </th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Subcategory</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-1 py-2">Sales</th>
                <th className="px-1 py-2">Rating</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            {Array.isArray(product) && product.length === 0 && (
              <p className="!text-sm !items-center text-center text-gray-500 my-4">
                No products found for this category.
              </p>
            )}

            <tbody>
              {loading === false ? (
                product.length !== 0 &&
                product.map((product) => (
                  <tr
                    key={product._id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        {...label}
                        checked={product.checked === true}
                        onChange={(e) => handlecheckboxChange(e, product._id)}
                        size="small"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-start gap-4 max-w-md">
                        <Link
                          to={`/product/${product._id}`}
                          className="w-[60px] h-[60px] flex-shrink-0 rounded-lg overflow-hidden border border-gray-200"
                        >
                          <LazyLoadImage
                            alt={product.name || "product"}
                            effect="blur"
                            className="w-full h-full object-cover"
                            src={product.images?.[0]?.url || "/placeholder.jpg"}
                          />
                        </Link>
                        <div className="flex flex-col">
                          <Link to={`/product/${product._id}`}>
                            <h3 className="!text-[12px] font-semibold hover:text-primary line-clamp-2">
                              {product.description || "N/A"}
                            </h3>
                          </Link>
                          <span className="text-xs text-gray-500 font-[600]">
                            {product.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">{product.category.name}</td>
                    <td className="px-4 py-3">{product.subcatname}</td>
                    <td className="px-4 py-3">{product.brand}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="line-through text-gray-400 text-xs">
                          ${product.oldprice || "0.00"}
                        </span>
                        <span className="text-green-600 font-bold text-sm">
                          ${product.price || "0.00"}
                        </span>
                      </div>
                    </td>

                    <td className="px-1 py-1">
                      <span className="font-semibold text-sm">
                        {product.sale} Sales
                      </span>
                      <ProgressBar type="warning" value={product.sale} />
                    </td>
                    <td className="px-1 py-1">
                      <Rating
                        name="half-rating-read"
                        defaultValue={product.rating}
                        precision={0.5}
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Tooltip title="Edit" placement="top" arrow>
                          <Button
                            className="!min-w-[32px] !h-8 !p-0 bg-green-100 hover:bg-green-200 rounded"
                            variant="text"
                          >
                            <AiTwotoneEdit
                              onClick={() =>
                                context.setisOpenPanel({
                                  open: true,
                                  model: "Edit Product",
                                  id: product._id,
                                })
                              }
                              className="text-green-700 text-base"
                            />
                          </Button>
                        </Tooltip>

                        <Tooltip title="View" placement="top" arrow>
                          <Link to={`/product/${product._id}`}>
                            <Button
                              className="!min-w-[32px] !h-8 !p-0 bg-red-100 hover:bg-blue-200 rounded"
                              variant="text"
                            >
                              <IoMdEye className="text-blue-700 text-base" />
                            </Button>
                          </Link>
                        </Tooltip>

                        <Tooltip title="Delete" placement="top" arrow>
                          <Button
                            className="!min-w-[32px] !h-8 !p-0 bg-red-100 hover:bg-red-200 rounded"
                            variant="text"
                            onClick={() => handleDelete(product._id)}
                          >
                            <MdOutlineDeleteOutline className="text-red-700 text-base" />
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6">
                    <CircularProgress color="inherit" size={24} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4">
          <div className="w-full sm:w-auto">
            <label className="font-semibold text-[14px] mb-1 block">
              Items Per Page
            </label>
            <Select
              className="w-1/2 sm:w-[70px]"
              size="small"
              value={perPage}
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
            page={currentPage}
            color="primary"
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
