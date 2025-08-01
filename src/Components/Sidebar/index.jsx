import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { TbSlideshow } from "react-icons/tb";
import { RiLogoutBoxLine } from "react-icons/ri";
import { PiUsersBold } from "react-icons/pi";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import Collapse from "react-collapse";
import { RiBloggerLine } from "react-icons/ri";
import logo from "./../../assets/logo.png";

import { LiaShippingFastSolid } from "react-icons/lia";
import { useContext, useState } from "react";
import { Mycontext } from "../../App";

export default function Sidebar() {
  const [submenuindex, setsubmenuindex] = useState(null);
  const isOpenSub = (index) => {
    if (submenuindex === index) {
      setsubmenuindex(null);
    } else {
      setsubmenuindex(index);
    }
  };
  const context = useContext(Mycontext);
  return (
    <div
      className={`sidebar fixed top-0 left-0 !bg-white h-full border-r border-[rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden ${
        context.isSidebar ? "w-[18%] px-4 py-2" : "w-[0%] px-0 py-0"
      }`}
    >
      <>
        <div className="py-2 w-full">
          <Link to="/">
            <img src={logo} className="w-[200px] h-auto" alt="Logo" />
          </Link>
        </div>
        {context.isSidebar === true && (
          <ul className="mt-4">
            <li>
              <Link to="/">
                <Button className="w-full !capitalize !justify-start !py-2 hover:!bg-[#f1f1f1] items-center flex gap-3 !font-[500]  text-[14px] !text-[rgba(0,0,0,0.9)] ">
                  {" "}
                  <RxDashboard className="text-[18px]" />
                  Dashboard
                </Button>
              </Link>
            </li>
            <li>
              <Button
                className="w-full !capitalize !justify-start !py-2  hover:!bg-[#f1f1f1] items-center flex gap-3 !font-[500]  text-[14px] !text-[rgba(0,0,0,0.9)] "
                onClick={() => isOpenSub(1)}
              >
                {" "}
                <TbSlideshow className="text-[18px]" />
                Home Slides{" "}
                <span className="ml-auto w-[30px] flex items-center justify-center h-[30px]">
                  <FaAngleDown
                    className={`transition-all ${
                      submenuindex === 1 ? `rotate-180` : ""
                    }`}
                  />
                </span>
              </Button>

              <Collapse isOpened={submenuindex === 1 ? true : false}>
                <ul className="w-full">
                  <li className="w-full">
                    <Link to="/homebanner/list">
                      <Button className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize">
                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                        Home Banner Slide List
                      </Button>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Button
                      onClick={() =>
                        context.setisOpenPanel({
                          open: true,
                          model: "AddBannerslider",
                        })
                      }
                      className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize"
                    >
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                      Add Home Banner Slide
                    </Button>
                  </li>
                </ul>
              </Collapse>
            </li>
            <li>
              <Button
                className="w-full !capitalize !justify-start !py-2  hover:!bg-[#f1f1f1] items-center flex gap-3 !font-[500]  text-[14px] !text-[rgba(0,0,0,0.9)] "
                onClick={() => isOpenSub(4)}
              >
                {" "}
                <TbSlideshow className="text-[18px]" />
                Home Banners
                <span className="ml-auto w-[30px] flex items-center justify-center h-[30px]">
                  <FaAngleDown
                    className={`transition-all ${
                      submenuindex === 4 ? `rotate-180` : ""
                    }`}
                  />
                </span>
              </Button>

              <Collapse isOpened={submenuindex === 4 ? true : false}>
                <ul className="w-full">
                  <li className="w-full">
                    <Link to="/homebannerv1/list">
                      <Button className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize">
                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                        Banner V1 List
                      </Button>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Button
                      onClick={() =>
                        context.setisOpenPanel({
                          open: true,
                          model: "Add Banner V1",
                        })
                      }
                      className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize"
                    >
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                      Add Banner V1
                    </Button>
                  </li>
                </ul>
              </Collapse>
            </li>
            <li>
              <Button
                className="w-full !capitalize !justify-start !py-2  hover:!bg-[#f1f1f1] items-center flex gap-3 !font-[500]  text-[14px] !text-[rgba(0,0,0,0.9)] "
                onClick={() => isOpenSub(5)}
              >
                {" "}
                <RiBloggerLine className="text-[20px]" />
                Blogs
                <span className="ml-auto w-[30px] flex items-center justify-center h-[30px]">
                  <FaAngleDown
                    className={`transition-all ${
                      submenuindex === 5 ? `rotate-180` : ""
                    }`}
                  />
                </span>
              </Button>

              <Collapse isOpened={submenuindex === 5 ? true : false}>
                <ul className="w-full">
                  <li className="w-full">
                    <Link to="/bloglist">
                      <Button className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize">
                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                        Blog List
                      </Button>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Button
                      onClick={() =>
                        context.setisOpenPanel({
                          open: true,
                          model: "Add Blog",
                        })
                      }
                      className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize"
                    >
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                      Add Blogs
                    </Button>
                  </li>
                </ul>
              </Collapse>
            </li>
            <li>
              <Link to="/users">
                <Button className="w-full !capitalize !justify-start !py-2 hover:!bg-[#f1f1f1]  items-center flex gap-3 !font-[500]  text-[14px] !text-[rgba(0,0,0,0.9)] ">
                  {" "}
                  <PiUsersBold className="text-[18px]" />
                  Users
                </Button>
              </Link>
            </li>
            <li>
              <Button
                className="w-full !capitalize !justify-start !py-2  hover:!bg-[#f1f1f1] items-center flex gap-3 !font-[500]  text-[14px] !text-[rgba(0,0,0,0.9)] "
                onClick={() => isOpenSub(2)}
              >
                {" "}
                <AiOutlineProduct className="text-[18px]" />
                Products{" "}
                <span className="ml-auto w-[30px] flex items-center justify-center h-[30px]">
                  <FaAngleDown
                    className={`transition-all ${
                      submenuindex === 2 ? `rotate-180` : ""
                    }`}
                  />
                </span>
              </Button>

              <Collapse isOpened={submenuindex === 2 ? true : false}>
                <ul className="w-full">
                  <li className="w-full">
                    <Link to="/product">
                      <Button className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize">
                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                        Product List
                      </Button>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Button
                      onClick={() =>
                        context.setisOpenPanel({
                          open: true,
                          model: "Add Product",
                        })
                      }
                      className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize"
                    >
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                      Add Products
                    </Button>
                  </li>
                  <li className="w-full">
                    <Link to="/Addrams">
                      <Button className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize">
                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                        Add Product Ram
                      </Button>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link to="/Addweight">
                      <Button className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize">
                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                        Add Product Weight
                      </Button>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link to="/Addsize">
                      <Button className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize">
                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                        Add Product Size
                      </Button>
                    </Link>
                  </li>
                </ul>
              </Collapse>
            </li>
            <li>
              <Button
                className="w-full !capitalize !justify-start !py-2  hover:!bg-[#f1f1f1] items-center flex gap-3 !font-[500]  text-[14px] !text-[rgba(0,0,0,0.9)] "
                onClick={() => isOpenSub(3)}
              >
                {" "}
                <MdOutlineCategory className="text-[18px]" />
                Category{" "}
                <span className="ml-auto w-[30px] flex items-center justify-center h-[30px]">
                  <FaAngleDown
                    className={`transition-all ${
                      submenuindex === 3 ? `rotate-180` : ""
                    }`}
                  />
                </span>
              </Button>

              <Collapse isOpened={submenuindex === 3 ? true : false}>
                <ul className="w-full">
                  <li className="w-full">
                    <Link to="/categorylist">
                      <Button className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize">
                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                        Category List
                      </Button>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Button
                      onClick={() =>
                        context.setisOpenPanel({
                          open: true,
                          model: "Add Category",
                        })
                      }
                      className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize"
                    >
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                      Add Category
                    </Button>
                  </li>
                  <li className="w-full">
                    <Link to="/subcategory/list">
                      <Button className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize">
                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                        Sub Category List
                      </Button>
                    </Link>
                  </li>
                  <li className="w-full">
                    <Button
                      onClick={() =>
                        context.setisOpenPanel({
                          open: true,
                          model: "Add SubCategory",
                        })
                      }
                      className="!text-[rgba(0,0,0,0.8)] !text-[13px] font-[600] !pl-8 w-full flex gap-3 !justify-start !capitalize"
                    >
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                      Add Sub Category
                    </Button>
                  </li>
                </ul>
              </Collapse>
            </li>

            <li>
              <Link to="/orders">
                <Button className="w-full !capitalize !justify-start !py-2 hover:!bg-[#f1f1f1] items-center flex gap-3 !font-[500]  text-[14px] !text-[rgba(0,0,0,0.9)] ">
                  {" "}
                  <LiaShippingFastSolid className="text-[18px]" />
                  Orders
                </Button>
              </Link>
            </li>
            <li>
              <Button className="w-full !capitalize !justify-start !py-2 hover:!bg-[#f1f1f1]  items-center flex gap-3 !font-[500]  text-[14px] !text-[rgba(0,0,0,0.9)] ">
                {" "}
                <RiLogoutBoxLine className="text-[18px]" />
                Logout
              </Button>
            </li>
          </ul>
        )}
      </>
    </div>
  );
}
