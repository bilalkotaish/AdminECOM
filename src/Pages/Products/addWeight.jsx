import { Button, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { IoMdCloudUpload } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Mycontext } from "../../App";
import { postData, fetchData, deleteData, editData } from "../../utils/api";

export default function AddWeight() {
  const [isLoading, setisLoading] = useState(false);
  const [weight, setWeight] = useState("");
  const [data, setData] = useState([]);
  const context = useContext(Mycontext);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    getWeights();
  }, []);

  const getWeights = () => {
    fetchData(`/api/product/getWeights`)
      .then((res) => {
        console.log(res);
        if (res.error === false) {
          setData(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        context.Alertbox("error", "Failed to fetch Weight data");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setisLoading(true);
    if (editId !== "") {
      editData(`/api/product/updateweight/${editId}`, { weight }).then(
        (res) => {
          console.log(res);
          if (res.error === false) {
            context.Alertbox("success", res.message);
            setWeight("");
            getWeights();
            setisLoading(false);
          }
        }
      );
    }
    if (editId === "") {
      if (weight.trim() === "") {
        context.Alertbox("Please enter a Weight value");
        setisLoading(false);
        return;
      }
      postData(`/api/product/addWeight`, { weight })
        .then((res) => {
          console.log(res);
          if (res.error === false) {
            setWeight("");
            context.Alertbox("success", res.message);
            getWeights();
          }
        })
        .catch((err) => {
          console.error(err);
          context.Alertbox("error", "Failed to add Weight");
        })
        .finally(() => {
          setisLoading(false);
        });
    }
  };

  const handleDelete = (id) => {
    deleteData(`/api/product/deleteWeight/${id}`)
      .then((res) => {
        console.log(res);
        if (res.error === false) {
          context.Alertbox("success", res.message);
          getWeights();
        } else {
          context.Alertbox("error", res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        context.Alertbox("error", "Failed to delete Weight");
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const handleEdit = (id) => {
    console.log("Edit Weight with ID:", id);
    setisLoading(true);
    setEditId(id);
    fetchData(`/api/product/getWeights/${id}`)
      .then((res) => {
        console.log(res);
        if (res.error === false) {
          setWeight(res.data.weight);
          context.Alertbox("success", res.message);
        } else {
          context.Alertbox("error", res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        context.Alertbox("error", "Failed to fetch Weight data");
      })
      .finally(() => {
        setisLoading(false);
      });
  };
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 mt-6">
        <h1 className="text-xl font-bold mb-4 md:mb-0">Add Weight</h1>
      </div>

      <div className="w-[80%] px-4 mt-4">
        <div className="w-full bg-white shadow-lg rounded-xl p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
              <label
                htmlFor="weight"
                className="text-sm font-medium text-gray-700 min-w-[100px]"
              >
                Weight Value:
              </label>
              <input
                type="text"
                id="weight"
                name="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter Size Value"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="!bg-primary !text-white items-center mt-4 w-full !pr-2 gap-2 !pl-12"
              >
                <IoMdCloudUpload className="text-[25px] " /> Publish Product
                Weight
                {isLoading === true && (
                  <CircularProgress color="inherit" size={20} />
                )}
              </Button>
            </div>
          </form>
        </div>
        <table className="min-w-full bg-white shadow-lg rounded-xl mt-6 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/2 px-6 py-2 text-left">
                Product Weight Value
              </th>
              <th className="w-1/4 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500">
                  No Weight data available
                </td>
              </tr>
            ) : (
              data.map((weight, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="w-1/2 px-6 py-2 truncate items-center">
                    {weight.weight}
                  </td>
                  <td className="w-1/4 px-4 py-2">
                    <div className="flex items-center gap-3">
                      <AiTwotoneEdit
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleEdit(weight._id)}
                      />
                      <MdOutlineDeleteOutline
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(weight._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
