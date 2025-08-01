import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { useParams } from "react-router-dom";
import { fetchData } from "../../utils/api";
import { MdBrandingWatermark } from "react-icons/md";
import { GoGear } from "react-icons/go";
import { BiCategory } from "react-icons/bi";
import { MdRateReview } from "react-icons/md";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { IoMdResize } from "react-icons/io";
import { GiGears } from "react-icons/gi";
import Rating from "@mui/material/Rating";

export default function ProductDetails() {
  const [slideindex, setslideindex] = useState(0);
  const usezoom1 = useRef();
  const usezoom2 = useRef();
  const [product, setproduct] = useState([]);
  const { id } = useParams();
  const Goto = (index) => {
    setslideindex(index);
    usezoom1.current.swiper.slideTo(index);
    usezoom2.current.swiper.slideTo(index);
  };

  useEffect(() => {
    fetchData(`/api/product/${id}`).then((res) => {
      if (res?.error === false) {
        setproduct(res?.data);
      } else {
        console.log("Error fetching product details");
      }
    });
  }, []);
  return (
    <>
      <div className="flex flex-col md:flex-row items-start mb-10 md:items-center justify-between px-2 mt-4">
        <h1 className="text-xl font-semibold mb-2 md:mb-0">Product Details</h1>
      </div>

      <div className="product-details  flex gap-8 ">
        <div className="w-[40%]">
          {product?.images?.length > 0 && (
            <div className="flex gap-3">
              <div className="slider w-[30%] h-[420px] overflow-hidden  rounded-md">
                <Swiper
                  ref={usezoom1}
                  direction={"vertical"}
                  slidesPerView={4}
                  spaceBetween={2}
                  navigation={true}
                  modules={[Navigation]}
                  className={`zoomthumbs w-[full] h-[420px] overflow-hidden rounded-md ${
                    product?.images?.length > 4 && "space"
                  }`}
                >
                  {product?.images?.map((item, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className={`item rounded-md !overflow-hidden cursor-pointer group ${
                          slideindex === index ? "opacity-1" : "opacity-30"
                        }`}
                        onClick={() => Goto(index)}
                      >
                        <img
                          src={item.url}
                          alt={`Product ${index}`}
                          className="w-full transition-full rounded-lg group-hover:scale-105"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="zoomcontainer w-[85%] !h-[500px] overflow-hidden rounded-md">
                <Swiper
                  slidesPerView={1}
                  ref={usezoom2}
                  spaceBetween={0}
                  navigation={false}
                >
                  {product?.images?.map((item, index) => (
                    <SwiperSlide key={index}>
                      <InnerImageZoom
                        src={item.url}
                        zoomSrc={item.url}
                        zoomType="hover"
                        zoomScale={1}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[55%]">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            {/* Title */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900">
                {product?.name}
              </h1>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Brand */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <MdBrandingWatermark className="text-xl text-blue-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                  <p className="text-gray-800 font-medium">
                    {product?.brand || "N/A"}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <BiCategory className="text-xl text-blue-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Category
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {product?.catname || "N/A"}
                  </p>
                </div>
              </div>

              {/* RAM */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <GoGear className="text-xl text-blue-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">RAM</h3>
                  {product?.productRam?.map((item, index) => (
                    <p key={index} className="text-gray-800 font-medium">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <IoMdResize className="text-xl text-blue-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Size</h3>
                  {product?.size?.map((item, index) => (
                    <p key={index} className="text-gray-800 font-medium">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <MdRateReview className="text-xl text-blue-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reviews</h3>
                  <p className="text-gray-800 font-medium">
                    {product?.reviews || 0} Reviews
                  </p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <GiGears className="text-xl text-blue-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Created At
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {product?.createdAt
                      ? new Date(product.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="mt-10 w-full">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
                Product Description
              </h2>

              {product?.description ? (
                <p className="w-full text-base leading-relaxed text-gray-700">
                  {product.description}
                </p>
              ) : (
                <p className="w-full text-base text-gray-500 italic">
                  No description available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <br />

      <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
        {" "}
        Customers Reviews
      </h3>

      <div className="flex flex-col gap-4">
        <div className="bg-white p-6 mb-2 rounded-2xl shadow-md w-full flex flex-col md:flex-row gap-6 items-start md:items-center">
          <img
            src={product?.images?.[0]?.url || "/placeholder.jpg"}
            alt="User Avatar"
            className="w-[70px] h-[70px] rounded-full border-2 border-gray-300 object-cover"
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
              <h4 className="text-lg font-semibold text-gray-800">John Doe</h4>
              <Rating
                name="read-only"
                value={4}
                readOnly
                precision={0.5}
                size="small"
              />
            </div>

            <span className="text-sm text-gray-500">May 19, 2025</span>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              My husband and I celebrated our anniversary here and it couldn't
              have been more perfect. The staff went above and beyond to make
              our evening special, even bringing us a complimentary dessert with
              a sweet message.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-white p-6 mb-2 rounded-2xl shadow-md w-full flex flex-col md:flex-row gap-6 items-start md:items-center">
          <img
            src={product?.images?.[0]?.url || "/placeholder.jpg"}
            alt="User Avatar"
            className="w-[70px] h-[70px] rounded-full border-2 border-gray-300 object-cover"
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
              <h4 className="text-lg font-semibold text-gray-800">John Doe</h4>
              <Rating
                name="read-only"
                value={4}
                readOnly
                precision={0.5}
                size="small"
              />
            </div>

            <span className="text-sm text-gray-500">May 19, 2025</span>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              My husband and I celebrated our anniversary here and it couldn't
              have been more perfect. The staff went above and beyond to make
              our evening special, even bringing us a complimentary dessert with
              a sweet message.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
