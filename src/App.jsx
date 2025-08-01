import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import { createContext, useState } from "react";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Product from "./Pages/Products";
import React from "react";
import Slide from "@mui/material/Slide";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
import HomeBanner from "./Pages/HomeSliderbanner";
import CategoryList from "./Pages/Category";
import SubCategoryList from "./Pages/Category/Subcatlist";
import toast, { Toaster } from "react-hot-toast";
import Users from "./Pages/Users";
import Orders from "./Pages/Orders";
import ForgetPassword from "./Pages/ForgetPass";
import Verify from "./Pages/Verify";
import ChangePassword from "./Pages/ChangePassword";
import { useEffect } from "react";
import { fetchData } from "./utils/api";
import Profile from "./Pages/Profile";
import ProductDetails from "./Pages/Products/productdetails";
import AddRams from "./Pages/Products/addRams";
import AddSize from "./Pages/Products/addSize";
import AddWeight from "./Pages/Products/addWeight";
import BannerV1Table from "./Pages/bannerv1";
import BlogTable from "./Pages/Blog";
const Mycontext = createContext();
function App() {
  const [isSidebar, setisSidebar] = useState(true);
  const [isLogin, setisLogin] = useState(false);
  const [userData, setuserData] = useState(null);
  const [catData, setCatData] = useState([]);
  const [isOpenPanel, setisOpenPanel] = useState({
    open: false,
    model: "",
    id: null,
  });
  const Alertbox = (status, msg) => {
    if (status === "success") {
      toast.success(msg);
    }
    if (status === "error") {
      toast.error(msg);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");

    if (token) {
      setisLogin(true);
      fetchData(`/api/user/userdetails`)
        .then((res) => {
          if (res.error) {
            throw res;
          }
          setuserData(res.data);
        })
        .catch((err) => {
          const message = err?.message || err?.response?.data?.message;

          if (message === "You Are Not Logged In") {
            localStorage.removeItem("accesstoken");
            localStorage.removeItem("refreshToken");
            Alertbox("error", "Your session has expired");
            setisLogin(false);
          } else {
            Alertbox("error", "An error occurred while fetching user data");
          }
        });
    } else {
      setisLogin(false);
    }
  }, []);

  useEffect(() => {
    fetchData("/api/category/getcategory").then((res) => {
      console.log("Fetched category data:", res);
      setCatData(res.categories || []);
    });
  }, []);

  const values = {
    setisSidebar,
    isSidebar,
    isLogin,
    Alertbox,
    userData,
    setuserData,
    setisLogin,
    catData,
    setCatData,
    isOpenPanel,
    setisOpenPanel,
  };

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <Dashboard />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/login",

        element: (
          <>
            <Login />
          </>
        ),
      },
      {
        path: "/Signup",

        element: (
          <>
            {" "}
            <Signup />{" "}
          </>
        ),
      },
      {
        path: "/forgetpassword",

        element: (
          <>
            {" "}
            <ForgetPassword />{" "}
          </>
        ),
      },
      {
        path: "/verify",

        element: (
          <>
            {" "}
            <Verify />{" "}
          </>
        ),
      },
      {
        path: "/ChangePassword",

        element: (
          <>
            {" "}
            <ChangePassword />{" "}
          </>
        ),
      },
      {
        path: "/product",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <Product />
              </div>
            </div>
          </section>
        ),
      },
      ,
      {
        path: "/homebanner/list",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <HomeBanner />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/Categorylist",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <CategoryList />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/SubCategory/list",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <SubCategoryList />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/users",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <Users />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/orders",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <Orders />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/profile",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <Profile />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/product/:id",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <ProductDetails />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/addRams",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <AddRams />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/addsize",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <AddSize />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/addweight",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <AddWeight />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/homebannerv1/list",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <BannerV1Table />
              </div>
            </div>
          </section>
        ),
      },
      {
        path: "/bloglist",
        element: (
          <section className="main">
            <Header />
            <div className="contentmain flex transition-all duration-300">
              <div
                className={`sidebarwrapper transition-all duration-300 overflow-hidden ${
                  isSidebar ? "w-[18%] px-4 py-2" : "w-0 px-0 py-0"
                }`}
              >
                <Sidebar />
              </div>

              <div
                className={`contentright px-5 py-4 transition-all duration-300 ${
                  isSidebar === false ? "w-full" : "w-[82%]"
                }`}
              >
                <BlogTable />
              </div>
            </div>
          </section>
        ),
      },
    ],
    {
      future: {
        v7_relativeSplatPath: true,
      },
    }
  );

  return (
    <Mycontext.Provider value={values}>
      <RouterProvider router={router} />
      <Toaster />;
    </Mycontext.Provider>
  );
}

export default App;
export { Mycontext };
