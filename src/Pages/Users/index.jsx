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
      <div className="card my-3 shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center w-full pl-4 justify-between pr-6">
          <h1 className="text-[25px] pt-4 font-[600]">Users List</h1>
          <div className="col w-[30%] ml-auto">
            <Searchbox
              setSearch={setSearch}
              Search={search}
              setPerPage1={setUsersPerPage}
            />
          </div>
        </div>

        <div className="mt-5">
          <table className="table-auto w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3 pl-8">User Image</th>
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">User Email</th>
                <th className="px-4 py-3">Email Verification</th>
                <th className="px-4 py-3">User Phone</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={user._id || index}
                  className="bg-white border-b border-gray-200"
                >
                  <td className="px-4 py-3 pl-8">
                    <div className="flex items-center gap-4 max-w-[300px]">
                      <div className="w-[45px] h-[45px] overflow-hidden rounded-md">
                        <img
                          src={
                            user.Avatar && user.Avatar !== ""
                              ? user.Avatar
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_8kVrRKvn48kDPt79Je7wZIuT6nUSr3l5DQ&s"
                          }
                          className="w-full h-full object-cover"
                          alt={user.name}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">{user.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <MdOutlineMarkEmailRead />
                      {user.email}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      {user.Verify_email ? (
                        <span className="bg-green-500 text-white rounded-full px-3 py-1">
                          Verified
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white rounded-full px-3 py-1">
                          Not Verified
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <MdOutlinePhone />
                      {user.Mobile || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <SlCalender />
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-4 px-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Users per page:</label>
            <select
              value={usersPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={1}>1</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>
    </>
  );
}
