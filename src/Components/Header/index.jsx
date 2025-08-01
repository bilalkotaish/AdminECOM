import Button from "@mui/material/Button";
import { RiMenu3Fill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import Badge from "@mui/material/Badge";
import { FaRegBell } from "react-icons/fa";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FiActivity } from "react-icons/fi";
import IconButton from "@mui/material/IconButton";
import { Divider } from "@mui/material";
import { Mycontext } from "../../App";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/api";
import Addproduct from "../../Pages/Products/Addproducts";
import AddHomeSlider from "../../Pages/HomeSliderbanner/Addhomeslider";
import AddCategory from "../../Pages/Category/addCategroy";
import AddSubCategory from "../../Pages/Category/addSubCategroy";
import Addadress from "../../Pages/Address/Addadress";
import EditCategory from "../../Pages/Category/editCategory";
import Dialog from "@mui/material/Dialog";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import React from "react";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import EditProduct from "../../Pages/Products/editProduct";
import Addbannerv1 from "../../Pages/bannerv1/addbannerv1";
import Editbannerv1 from "../../Pages/bannerv1/editbannerv1";
import AddBlog from "../../Pages/Blog/addblog";
import EditBlog from "../../Pages/Blog/editBlog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Header() {
  const [anchormyacc, setAnchormyacc] = useState(null);
  const openMyacc = Boolean(anchormyacc);
  const history = useNavigate();
  const handleClickMyacc = (event) => {
    setAnchormyacc(event.currentTarget);
  };
  const handleCloseMyacc = () => {
    setAnchormyacc(null);
  };
  const context = useContext(Mycontext);
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
      padding: "0 4px",
    },
  }));
  const logout = () => {
    setAnchormyacc(null);
    fetchData(`/api/user/Logout?token=${localStorage.getItem("accesstoken")}`, {
      withCredentials: true,
    }).then((res) => {
      console.log(res);
      if (res.error === false) {
        context.setisLogin(false);
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        history("/");
      } else {
        context.setisLogin(true);
      }
    });
  };
  return (
    <>
      <header
        className={`w-full pr-7 h-auto bg-white shadow-md py-2   transition-all duration-300 flex items-center justify-between ${
          context.isSidebar === true ? "pl-64" : "pl-4"
        }`}
      >
        <Button
          // onClick={() => context.setisSidebar(!context.isSidebar)}
          className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full text-[rgba(0,0,0,0.8)]"
        >
          {/* <RiMenu3Fill className="text-[18px]" /> */}
        </Button>

        <div className="part2 w-[40%] flex items-center !justify-end gap-5">
          <IconButton aria-label="cart">
            <StyledBadge badgeContent={4} color="secondary">
              <FaRegBell />
            </StyledBadge>
          </IconButton>

          {context.isLogin === true ? (
            <div className="relative">
              <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhnJ8ohO113eX3thYt_EViTew3NXN3xwKxi4DzqigRhpA0GY6OWlgY5yZCOqPLda4y5fk&usqp=CAU."
                  className="w-full h-full object-cover rounded-full"
                  onClick={handleClickMyacc}
                />
              </div>

              <Menu
                anchorEl={anchormyacc}
                id="account-menu"
                open={openMyacc}
                onClose={handleCloseMyacc}
                onClick={handleCloseMyacc}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleCloseMyacc}>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhnJ8ohO113eX3thYt_EViTew3NXN3xwKxi4DzqigRhpA0GY6OWlgY5yZCOqPLda4y5fk&usqp=CAU."
                        className="w-full h-full object-cover rounded-full"
                        onClick={handleClickMyacc}
                      />
                    </div>

                    <div className="info ">
                      <h3 className="!text-[16px] font-[500] ">
                        {context.userData?.name}
                      </h3>
                      <h3 className="!text-[13px] font-[400] opacity-70">
                        {context?.userData?.email}
                      </h3>
                    </div>
                  </div>
                </MenuItem>
                <Divider />
                <Link to="/profile">
                  <MenuItem
                    onClick={handleCloseMyacc}
                    className="flex items-center gap-3"
                  >
                    <FaRegUser /> <span className="text-[14px]">Profile</span>
                  </MenuItem>
                </Link>

                <MenuItem onClick={logout} className="flex items-center gap-3">
                  <RiLogoutBoxLine />{" "}
                  <span className="text-[14px]">Sign Out</span>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Link to="/login">
              <Button className="!bg-blue-600 !text-white !rounded-full">
                Login
              </Button>
            </Link>
          )}
        </div>
      </header>

      <Dialog
        fullScreen
        open={context.isOpenPanel.open}
        onClose={() => context.setisOpenPanel({ open: false })}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => context.setisOpenPanel({ open: false })}
              aria-label="close"
            >
              <IoMdClose />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {context.isOpenPanel?.model}
            </Typography>
          </Toolbar>
        </AppBar>
        {context.isOpenPanel.model === "Add Product" && <Addproduct />}
        {context.isOpenPanel.model === "AddBannerslider" && <AddHomeSlider />}
        {context.isOpenPanel.model === "Add Category" && <AddCategory />}
        {context.isOpenPanel.model === "Add SubCategory" && <AddSubCategory />}
        {context.isOpenPanel.model === "Add Address" && <Addadress />}
        {context.isOpenPanel.model === "Edit Category" && <EditCategory />}
        {context.isOpenPanel.model === "Edit Product" && <EditProduct />}
        {context.isOpenPanel.model === "Add Banner V1" && <Addbannerv1 />}
        {context.isOpenPanel.model === "Edit Banner V1" && <Editbannerv1 />}
        {context.isOpenPanel.model === "Add Blog" && <AddBlog />}
        {context.isOpenPanel.model === "Edit Blog" && <EditBlog />}
      </Dialog>
    </>
  );
}
