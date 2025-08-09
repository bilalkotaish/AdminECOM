import DashboardBox from "../../Components/DashboardBoxs";
import { MdWavingHand } from "react-icons/md";
import { FcShop } from "react-icons/fc";
import { FaPlus } from "react-icons/fa6";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import { Link } from "react-router-dom";
import { Button, CircularProgress, Rating } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Checkbox from "@mui/material/Checkbox";
import ProgressBar from "../../Components/ProgressBar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import Pagination from "@mui/material/Pagination";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { BiExport } from "react-icons/bi";
import { AiTwotoneEdit } from "react-icons/ai";
import { useContext } from "react";
import { Mycontext } from "../../App";
import Product from "../Products";
import { deleteData, deleteMultiple, fetchData } from "../../utils/api";
import Searchbox from "../../Components/Searchbox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IoMdEye } from "react-icons/io";
import StatusBadge from "../../Components/Badge";

export default function Dashboard() {
  const [openPopupIndex, setOpenPopupIndex] = useState(null);
  const context = useContext(Mycontext);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [Cat, setCat] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [subCat, setsubCat] = useState("");
  const [thirdsubCat, setthirdsubCat] = useState("");
  const [product, setProduct] = useState([]);
  const [displayType, setDisplayType] = useState("both");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [perPage, setPerPage] = useState(1);
  const [Sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryfilter, setcategoryfilter] = useState("");
  const [currentPage1, setCurrentPage1] = useState(1);
  const [perPage1, setPerPage1] = useState(10);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productcount, setProductcount] = useState([]);

  const totalPages1 = Math.ceil(orderData.length / perPage1);

  // Handlers
  const handlePageChange1 = (event, value) => {
    setCurrentPage1(value);
  };

  const handleLimitChange1 = (event) => {
    setPerPage1(event.target.value);
    setCurrentPage1(1); // Reset to first page when limit changes
  };

  // Slice data
  const paginatedData1 = orderData.slice(
    (currentPage1 - 1) * perPage1,
    currentPage1 * perPage1
  );

  const [chartdata, setchartdata] = useState([]);
  const [years, setYears] = useState(new Date().getFullYear());

  const fetchChartData = async () => {
    try {
      const usersRes = await fetchData("/api/orders/getusers");
      const salesRes = await fetchData("/api/orders/getsales");

      // Create maps keyed by month
      const usersMap = new Map();
      usersRes.MonthlyUsers?.forEach((u) => {
        usersMap.set(u.month, parseInt(u.TotalUsers));
      });

      const salesMap = new Map();
      salesRes.MonthlySales?.forEach((s) => {
        salesMap.set(s.month, parseInt(s.totalSales));
      });

      // Get all months (union of both keys)
      const months = Array.from(
        new Set([...usersMap.keys(), ...salesMap.keys()])
      );

      // Build merged array
      const merged = months.map((month) => ({
        name: month,
        TotalUsers: usersMap.get(month) || 0,
        Totalsales: salesMap.get(month) || 0,
      }));

      setchartdata(merged);
    } catch (err) {
      context.Alertbox("error", err.message);
    }
  };

  // Call this function once (e.g. on component mount)
  useEffect(() => {
    fetchChartData();
  }, []);

  const handleChangeYear = (event) => {
    setYears(event.target.value);
  };

  const handleChangeCatFilter = (event) => {
    setcategoryfilter(event.target.value);
  };
  useEffect(() => {
    // getTotalSales();
    const getOrderData = async () => {
      const res = await fetchData(`/api/orders/get`);
      if (res.error) {
        context.Alertbox("error", res.message);
      } else {
        setOrderData(res.data);
        console.log("Order Data:", res.data);
      }
    };

    getOrderData();
  }, [context.Alertbox, context.userData?._id]);

  useEffect(() => {
    fetchData(`/api/user/getallusers`)
      .then((res) => {
        if (res.error) {
          context.Alertbox("error", res.message);
        } else {
          setUsers(res.users);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });

    fetchData(`/api/user/getallreviews`)
      .then((res) => {
        if (res.error) {
          context.Alertbox("error", res.message);
        } else {
          setReviews(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch reviews:", err);
      });

    fetchData(`/api/product/productsCount`)
      .then((res) => {
        if (res.error) {
          context.Alertbox("error", res.message);
        } else {
          console.log("Product Count:", res.data);
          setProductcount(res.ProductCount);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch productcount:", err);
      });
  }, []);

  const handleTogglePopup = (index) => {
    if (openPopupIndex === index) {
      setOpenPopupIndex(null);
    } else {
      setOpenPopupIndex(index);
    }
  };

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
    
    <div
  className="p-5 px-5 py-2 border bg-[#f1faff] border-[rgba(0,0,0,0.1)] flex flex-col lg:flex-row items-center justify-between gap-8 mb-5"
>
  {/* Text Section */}
  <div className="info w-full lg:w-[60%]">
    <h1 className="text-[24px] md:text-[28px] lg:text-[30px] font-medium leading-snug mb-3">
      Good Morning, <br />
      <span className="text-primary">Mr. {context.userData?.name}</span>{" "}
      <MdWavingHand className="inline-block text-yellow-400 text-[30px] ml-2 rotate-[270deg]" />
    </h1>
    <p className="text-sm md:text-base mb-2">
      Here's what’s happening in your store today! See the analytics now!
    </p>

    <Button
      onClick={() =>
        context.setisOpenPanel({ open: true, model: "Add Product" })
      }
      className="!bg-blue-600 !text-white mt-3 w-30 sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] flex !items-center gap-2"
    >
      <FaPlus /> Add Products
    </Button>
  </div>

  {/* Icon Section */}
  <div className="w-full lg:w-[40%] flex justify-center">
    <FcShop className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] lg:w-[250px] lg:h-[250px]" />
  </div>
</div>

      
      {product.length !== 0 && orderData.length !== 0 && (
        <DashboardBox
          product={productcount}
          orderData={orderData?.length}
          catData={context.catData?.length}
          users={users?.length}
          reviews={reviews?.length}
        />
      )}

      <div className="card my-3 shadow-md sm:rounded-lg bg-white pt-2">
        <div className="card mt-4 mb-6 shadow-lg sm:rounded-xl bg-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 border-b">
            <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4 px-2">
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

              <div className="w-full md:w-[300px]">
                <label className="text-sm font-semibold  block text-gray-700">
                  Search
                </label>
                <Searchbox />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
  <table className="min-w-[1000px] w-full text-sm text-left text-gray-700">
    <thead className="bg-gray-100 text-xs uppercase text-gray-600">
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
        <th className="px-2 py-2">Sales</th>
        <th className="px-2 py-2">Rating</th>
        <th className="px-4 py-3 min-w-[150px]">Actions</th>
      </tr>
    </thead>

    <tbody>
      {Array.isArray(product) && product.length === 0 ? (
        <tr>
          <td colSpan={9} className="text-center py-6">
            <p className="text-sm text-gray-500">No products found for this category.</p>
          </td>
        </tr>
      ) : loading ? (
        <tr>
          <td colSpan={9} className="text-center py-6">
            <CircularProgress color="inherit" size={24} />
          </td>
        </tr>
      ) : (
        product.map((product) => (
          <tr key={product._id} className="bg-white border-b hover:bg-gray-50 transition">
            <td className="px-4 py-3">
              <Checkbox
                {...label}
                checked={product.checked === true}
                onChange={(e) => handlecheckboxChange(e, product._id)}
                size="small"
              />
            </td>

            {/* Product Info */}
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
                    <h3 className="text-xs font-semibold hover:text-primary line-clamp-2">
                      {product.description?.substring(0, 40) || "N/A"}
                    </h3>
                  </Link>
                  <span className="text-xs text-gray-500 font-semibold">
                    {product.name?.substring(0, 30)}
                  </span>
                </div>
              </div>
            </td>

            <td className="px-4 py-3">{product.category?.name}</td>
            <td className="px-4 py-3">{product.subcatname}</td>
            <td className="px-4 py-3">{product.brand}</td>

            {/* Price */}
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

            {/* Sales */}
            <td className="px-2 py-2">
              <span className="font-semibold text-sm">{product.sale} Sales</span>
              <ProgressBar type="warning" value={product.sale} />
            </td>

            {/* Rating */}
            <td className="px-2 py-2">
              <Rating
                name="half-rating-read"
                defaultValue={product.rating}
                precision={0.5}
                readOnly
              />
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                {/* Edit */}
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  sx={{
                    minWidth: 32,
                    height: 32,
                    p: 0,
                    backgroundColor: "rgb(220 252 231)",
                    "&:hover": {
                      backgroundColor: "rgb(187 247 208)",
                    },
                  }}
                  onClick={() =>
                    context.setisOpenPanel({
                      open: true,
                      model: "Edit Product",
                      id: product._id,
                    })
                  }
                >
                  <AiTwotoneEdit className="text-green-700 text-lg" />
                </Button>

                {/* View */}
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/product/${product._id}`}
                  sx={{
                    minWidth: 32,
                    height: 32,
                    p: 0,
                    backgroundColor: "rgb(219 234 254)",
                    "&:hover": {
                      backgroundColor: "rgb(191 219 254)",
                    },
                  }}
                >
                  <IoMdEye className="text-blue-700 text-lg" />
                </Button>

                {/* Delete */}
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  sx={{
                    minWidth: 32,
                    height: 32,
                    p: 0,
                    backgroundColor: "rgb(254 226 226)",
                    "&:hover": {
                      backgroundColor: "rgb(254 202 202)",
                    },
                  }}
                  onClick={() => handleDelete(product._id)}
                >
                  <MdOutlineDeleteOutline className="text-red-700 text-lg" />
                </Button>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


<div className="flex justify-between items-center px-4 sm:px-6 py-4 border-t border-gray-200">
<div className="flex items-center gap-2">
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
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
  {/* Header */}
  <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
    <h2 className="text-lg font-semibold text-gray-800">📦 My Orders</h2>
    <p className="text-sm text-gray-600">
      You have{" "}
      <span className="text-primary font-semibold">
        {orderData?.length}
      </span>{" "}
      orders in total.
    </p>
  </div>

  {/* Table Container */}
  <div className="overflow-x-auto">
    <table className="min-w-[1000px] w-full text-sm text-gray-700">
      <thead className="bg-gray-100 text-xs uppercase sticky top-0 z-10">
        <tr>
          <th className="px-4 py-3 text-left"></th>
          <th className="px-4 py-3 text-left">Order ID</th>
          <th className="px-4 py-3 text-left">Payment</th>
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left">Phone</th>
          <th className="px-4 py-3 text-left">Address</th>
          <th className="px-4 py-3 text-left">Total</th>
          <th className="px-4 py-3 text-left">Pincode</th>
          <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData1.map((item, index) => {
          const globalIndex = (currentPage1 - 1) * perPage1 + index;
          const address = [
            item.deliver_address.Address_Type,
            item.deliver_address.Address_line,
            item.deliver_address.City,
            item.deliver_address.State,
            item.deliver_address.Country,
            item.deliver_address.landmark,
          ]
            .filter(Boolean)
            .join(", ");

          return (
            <tr
              key={item._id}
              className="border-b hover:bg-gray-50 transition duration-150"
            >
              <td className="px-4 py-3">
                <Button
                  onClick={() => handleTogglePopup(globalIndex)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                  aria-label="Toggle Details"
                >
                  {openPopupIndex === globalIndex ? (
                    <FaAngleUp className="text-gray-600 text-lg" />
                  ) : (
                    <FaAngleDown className="text-gray-600 text-lg" />
                  )}
                </Button>
              </td>
              <td className="px-4 py-3 text-primary font-medium">{item._id}</td>
              <td className="px-4 py-3">{item.PaymentId}</td>
              <td className="px-4 py-3">{context.userData?.name}</td>
              <td className="px-4 py-3">{item.deliver_address.Mobile}</td>
              <td className="px-4 py-3 max-w-[300px] truncate">{address}</td>
              <td className="px-4 py-3 font-semibold text-primary">${item.Total}</td>
              <td className="px-4 py-3">{item.deliver_address.Pincode}</td>
              <td className="px-4 py-3">{context.userData?.email}</td>
              <td className="px-4 py-3">
                <StatusBadge status={item.orderStatus} />
              </td>
              <td className="px-4 py-3">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  {/* Pagination & Controls */}
  <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-t border-gray-200">
  <div className="flex items-center gap-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Items Per Page
      </label>
      <Select
        className="w-1/2 sm:w-[70px]"
        size="small"
        value={perPage1}
        onChange={handleLimitChange1}
      >
        {[1, 5, 10, 20, 50].map((val) => (
          <MenuItem key={val} value={val}>
            {val}
          </MenuItem>
        ))}
      </Select>
    </div>

    <Pagination
      count={totalPages1}
      page={currentPage1}
      color="primary"
      onChange={handlePageChange1}
    />
  </div>
</div>


      {openPopupIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-5xl relative">
            <button
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500"
              onClick={() => setOpenPopupIndex(null)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-5 text-gray-800">
              Order Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData[openPopupIndex]?.products?.map((product, idx) => (
                    <tr
                      key={idx}
                      className="bg-white border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-primary">
                        {product.productId?._id}
                      </td>
                      <td className="px-6 py-4">
                        {product.productId?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={
                            product?.productId?.images?.[0]?.url ||
                            "https://via.placeholder.com/50"
                          }
                          className="w-[50px] h-[60px] object-cover rounded-md border"
                          alt="product"
                        />
                      </td>
                      <td className="px-6 py-4">{product.quantity}</td>
                      <td className="px-6 py-4">${product.price}</td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        ${product.SubTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

<div className="card my-4 shadow-md sm:rounded-lg bg-white">
  {/* Header */}
  <div className="flex items-center justify-between px-4 sm:px-5 py-4 sm:py-5">
    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
      Total Users & Total Sales
    </h2>
  </div>

  {/* Toggle Controls */}
  <div className="flex flex-wrap items-center gap-4 px-4 sm:px-5 py-4 pt-0">
    {[
      { label: "Total Users", color: "bg-green-600", type: "users" },
      { label: "Total Sales", color: "bg-orange-600", type: "sales" },
      { label: "Both", color: "bg-gray-600", type: "both" },
    ].map(({ label, color, type }) => (
      <button
        key={type}
        onClick={() => setDisplayType(type)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition"
      >
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <span>{label}</span>
      </button>
    ))}
  </div>

  {/* Chart */}
  {chartdata.length > 0 && displayType && (
    <div className="w-full overflow-x-auto px-4 sm:px-5 pb-5">
      <div className="min-w-[600px]">
        <BarChart
          width={1000}
          height={400}
          data={chartdata}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="none" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />

          {(displayType === "users" || displayType === "both") && (
            <Bar
              dataKey="TotalUsers"
              fill="#16a34a"
              barSize={30}
              name="Total Users"
            />
          )}
          {(displayType === "sales" || displayType === "both") && (
            <Bar
              dataKey="Totalsales"
              fill="#ea580c"
              barSize={30}
              name="Total Sales"
            />
          )}
        </BarChart>
      </div>
    </div>
  )}
</div>

      </>
     
  )
}
