import { useState } from "react";
import { Button, Pagination } from "@mui/material";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import Searchbox from "../../Components/Searchbox";
import { useContext } from "react";
import { Mycontext } from "../../App";
import { useEffect } from "react";
import { editData, fetchData } from "../../utils/api";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Orders() {
  const [openPopupIndex, setOpenPopupIndex] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage1, setCurrentPage1] = useState(1);
  const [perPage1, setPerPage1] = useState(10);

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
  const context = useContext(Mycontext);
  const handleTogglePopup = (index) => {
    if (openPopupIndex === index) {
      setOpenPopupIndex(null);
    } else {
      setOpenPopupIndex(index);
    }
  };
  const [status, setStatus] = useState("");

  const handleChange = (event, id) => {
    setStatus(event.target.value);
    const obj = {
      orderId: id,
      orderStatus: event.target.value,
    };
    editData(`/api/orders/update/${id}`, obj).then((res) => {
      setStatus(res.data.orderStatus);
      context.Alertbox("success", res.message);
    });
  };

  useEffect(() => {
    if (search !== "") {
      const lowerSearch = search.toLowerCase();

      const filteredData = orderData.filter((item) => {
        return (
          // Assuming you want to search by _id as orderId:
          item._id?.toLowerCase().includes(lowerSearch) ||
          item.orderStatus?.toLowerCase().includes(lowerSearch) ||
          // userId is an object, search by userId.name or userId.email
          item.userId?.name?.toLowerCase().includes(lowerSearch) ||
          item.userId?.email?.toLowerCase().includes(lowerSearch) ||
          item.Paymentstatus?.toLowerCase().includes(lowerSearch) ||
          item.PaymentId?.toLowerCase().includes(lowerSearch) ||
          item.Total?.toString().toLowerCase().includes(lowerSearch)
        );
      });

      setOrderData(filteredData);
    } else {
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
    }
  }, [search]);

  useEffect(() => {
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
  }, [context.Alertbox, context.userData?._id, status]);

  return (
    <div className="card my-4 shadow-md sm:rounded-lg bg-white">
  {/* Header */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-5 gap-4">
    <h1 className="text-lg font-semibold text-gray-800">Recent Orders</h1>
    <div className="w-full sm:w-[60%]">
      <Searchbox search={search} setSearch={setSearch} setPerPage1={setPerPage1} />
    </div>
  </div>

  {/* Orders Summary */}
  <div className="border-b border-gray-200 px-6 py-4">
    <h2 className="text-lg font-semibold text-gray-800">My Orders</h2>
    <p className="text-sm text-gray-600">
      There are{" "}
      <span className="text-primary font-semibold">{orderData?.length}</span> Orders in Total
    </p>
  </div>

  {/* Orders Table */}
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm text-left text-gray-600">
      <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
        <tr>
          <th className="px-6 py-3"></th>
          <th className="px-6 py-3">Order ID</th>
          <th className="px-6 py-3">Payment</th>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Phone</th>
          <th className="px-6 py-3">Address</th>
          <th className="px-6 py-3">Total</th>
          <th className="px-6 py-3">Pincode</th>
          <th className="px-6 py-3">Email</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Date</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData1.map((item, index) => {
          const globalIndex = (currentPage1 - 1) * perPage1 + index;
          return (
            <tr key={item._id} className="bg-white border-b hover:bg-gray-50 transition">
              <td className="px-6 py-4">
                <Button
                  onClick={() => handleTogglePopup(globalIndex)}
                  className="w-10 h-10 min-w-10 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  {openPopupIndex === globalIndex ? (
                    <FaAngleUp className="text-gray-600 text-lg" />
                  ) : (
                    <FaAngleDown className="text-gray-600 text-lg" />
                  )}
                </Button>
              </td>
              <td className="px-6 py-4 text-primary">{item._id}</td>
              <td className="px-6 py-4">{item.PaymentId}</td>
              <td className="px-6 py-4">{context.userData?.name}</td>
              <td className="px-6 py-4">{item.deliver_address.Mobile}</td>
              <td className="px-6 py-4 max-w-[300px] truncate">
                {[
                  item.deliver_address.Address_Type,
                  item.deliver_address.Address_line,
                  item.deliver_address.City,
                  item.deliver_address.State,
                  item.deliver_address.Country,
                  item.deliver_address.landmark,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </td>
              <td className="px-6 py-4 font-semibold text-primary">${item.Total}</td>
              <td className="px-6 py-4">{item.deliver_address.Pincode}</td>
              <td className="px-6 py-4">{context.userData?.email}</td>
              <td className="px-6 py-4">
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={item.orderStatus || orderStatus}
                    onChange={(event) => handleChange(event, item._id)}
                  >
                    <MenuItem value="pending">
                      <span style={{ color: "#f97316" }}>Pending</span>
                    </MenuItem>
                    <MenuItem value="Confirmed">
                      <span style={{ color: "#22c55e" }}>Confirmed</span>
                    </MenuItem>
                    <MenuItem value="Canceled">
                      <span style={{ color: "#ef4444" }}>Canceled</span>
                    </MenuItem>
                  </Select>
                </FormControl>
              </td>
              <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>

    {/* Pagination Controls */}
    <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-t border-gray-200">
    <div className="flex items-center gap-2">
        <label className="font-semibold text-sm mb-1 block">Items Per Page</label>
        <Select
          className="w-full sm:w-[80px]"
          size="small"
          value={perPage1}
          onChange={handleLimitChange1}
        >
          {[1, 5, 10, 20, 50].map((num) => (
            <MenuItem key={num} value={num}>{num}</MenuItem>
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

  {/* Popup Modal */}
  {openPopupIndex !== null && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-5xl relative overflow-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500"
          onClick={() => setOpenPopupIndex(null)}
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-5 text-gray-800">Order Details</h3>
        <table className="min-w-full text-sm text-left text-gray-700">
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
              <tr key={idx} className="bg-white border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-primary">{product.productId?._id}</td>
                <td className="px-6 py-4">{product.productId?.name || "N/A"}</td>
                <td className="px-6 py-4">
                  <img
                    src={product?.productId?.images?.[0]?.url || "https://via.placeholder.com/50"}
                    className="w-[50px] h-[60px] object-cover rounded-md border"
                    alt="product"
                  />
                </td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4 font-semibold text-primary">${product.SubTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
</div>

  );
}
