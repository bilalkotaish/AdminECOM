import { useContext, useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { MdOutlineMarkEmailRead, MdOutlinePhone } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { SlCalender } from "react-icons/sl";
import Searchbox from "../../Components/Searchbox";
import { Mycontext } from "../../App";
import { fetchData } from "../../utils/api";

export default function Users() {
  const context = useContext(Mycontext);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [allUsers, setAllUsers] = useState([]);

  const [search, setSearch] = useState("");
  useEffect(() => {
    if (search !== "") {
      const lowerSearch = search.toLowerCase();

      const filteredData = users.filter((item) => {
        return (
          item.name?.toLowerCase().includes(lowerSearch) ||
          item.email?.toLowerCase().includes(lowerSearch) ||
          item.Mobile?.toString().includes(lowerSearch) ||
          new Date(item.createdAt)
            .toLocaleDateString("en-GB")
            .toLowerCase()
            .includes(lowerSearch)
        );
      });

      setUsers(filteredData);
    } else {
      fetchData(`/api/user/getallusers`)
        .then((res) => {
          if (res.success) {
            setUsers(res.users);
            setAllUsers(res.users);
            setUsersPerPage(5);

            console.log("Fetched users data:", res.users);
          } else {
            console.error("Failed to fetch users:", res.message);
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
        });
    }
  }, [search]);

  useEffect(() => {
    fetchData(`/api/user/getallusers`)
      .then((res) => {
        if (res.success) {
          setUsers(res.users);
          console.log("Fetched users data:", res.users);
        } else {
          console.error("Failed to fetch users:", res.message);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <>
     <div className="bg-white shadow-md rounded-lg overflow-hidden my-6">
  {/* Header */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 gap-4">
    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Users List</h1>
    <div className="w-full sm:w-[300px]">
      <Searchbox
        setSearch={setSearch}
        Search={search}
        setPerPage1={setUsersPerPage}
      />
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="min-w-[700px] w-full text-sm text-left text-gray-700">
      <thead className="bg-gray-100 text-xs uppercase text-gray-600">
        <tr>
          <th className="px-6 py-3">Avatar</th>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Email</th>
          <th className="px-6 py-3">Verified</th>
          <th className="px-6 py-3">Phone</th>
          <th className="px-6 py-3">Created</th>
        </tr>
      </thead>
      <tbody>
        {currentUsers.map((user, index) => (
          <tr key={user._id || index} className="border-b hover:bg-gray-50 transition">
            <td className="px-6 py-4">
              <img
                src={
                  user.Avatar && user.Avatar !== ""
                    ? user.Avatar
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_8kVrRKvn48kDPt79Je7wZIuT6nUSr3l5DQ&s"
                }
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
            </td>
            <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
            <td className="px-6 py-4 flex items-center gap-2 text-gray-700">
              <MdOutlineMarkEmailRead className="text-blue-500" />
              {user.email}
            </td>
            <td className="px-6 py-4">
              {user.Verify_email ? (
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Verified
                </span>
              ) : (
                <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Not Verified
                </span>
              )}
            </td>
            <td className="px-6 py-4 flex items-center gap-2 text-gray-700">
              <MdOutlinePhone className="text-gray-500" />
              {user.Mobile || "N/A"}
            </td>
            <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
  {user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A"}
</td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-t border-gray-200">
  <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Users per page:</label>
      <select
        value={usersPerPage}
        onChange={handleItemsPerPageChange}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {[1, 5, 10, 25, 50].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>

    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handlePageChange}
      color="primary"
      shape="rounded"
      size="medium"
      className="[&_.MuiPaginationItem-root]:rounded-md"
    />
  </div>
</div>

    </>
  );
}
