import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import {
  BsBank2,
  BsPieChartFill,
} from "react-icons/bs";
import { AiOutlineProduct } from "react-icons/ai";
import { LiaShippingFastSolid } from "react-icons/lia";
import { IoStatsChart } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";

export default function DashboardBox(props) {
  return (
    <Swiper
      navigation={false}
      modules={[Navigation]}
      spaceBetween={15}
      breakpoints={{
        320: { slidesPerView: 2 },
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1280: { slidesPerView: 5 },
      }}
      className="dashboardbox"
    >
      {/* Users */}
      <SwiperSlide>
        <div className="bg-white rounded-md p-4 sm:p-5 cursor-pointer hover:bg-[#fafafa] border border-[rgba(0,0,0,0.2)] flex items-center gap-4">
          <FaUsers className="text-[28px] sm:text-[30px] text-purple-500" />
          <div className="info w-full">
            <h3 className="text-sm sm:text-base">Users</h3>
            <h2 className="font-semibold text-lg sm:text-xl">{props.users}</h2>
          </div>
          <IoStatsChart className="text-[60px] sm:text-[70px] text-purple-500" />
        </div>
      </SwiperSlide>

      {/* Orders */}
      <SwiperSlide>
        <div className="bg-white rounded-md p-4 sm:p-5 cursor-pointer hover:bg-[#fafafa] border border-[rgba(0,0,0,0.2)] flex items-center gap-4">
          <LiaShippingFastSolid className="text-[35px] text-blue-500" />
          <div className="info w-full">
            <h3 className="text-sm sm:text-base">Orders</h3>
            <h2 className="font-semibold text-lg sm:text-xl">{props.orderData}</h2>
          </div>
          <IoStatsChart className="text-[60px] sm:text-[70px] text-blue-500" />
        </div>
      </SwiperSlide>

      {/* Reviews */}
      <SwiperSlide>
        <div className="bg-white rounded-md p-4 sm:p-5 cursor-pointer hover:bg-[#fafafa] border border-[rgba(0,0,0,0.2)] flex items-center gap-4">
          <MdOutlineRateReview className="text-[28px] text-pink-600" />
          <div className="info w-full">
            <h3 className="text-sm sm:text-base">Reviews</h3>
            <h2 className="font-semibold text-lg sm:text-xl">{props.reviews}</h2>
          </div>
          <IoStatsChart className="text-[60px] sm:text-[70px] text-pink-600" />
        </div>
      </SwiperSlide>

      {/* Category */}
      <SwiperSlide>
        <div className="bg-white rounded-md p-4 sm:p-5 cursor-pointer hover:bg-[#fafafa] border border-[rgba(0,0,0,0.2)] flex items-center gap-4">
          <BsPieChartFill className="text-[28px] text-green-600" />
          <div className="info w-full">
            <h3 className="text-sm sm:text-base">Category</h3>
            <h2 className="font-semibold text-lg sm:text-xl">{props.catData}</h2>
          </div>
          <IoStatsChart className="text-[60px] sm:text-[70px] text-green-600" />
        </div>
      </SwiperSlide>

      {/* Products */}
      <SwiperSlide>
        <div className="bg-white rounded-md p-4 sm:p-5 cursor-pointer hover:bg-[#fafafa] border border-[rgba(0,0,0,0.2)] flex items-center gap-4">
          <AiOutlineProduct className="text-[28px] text-red-500" />
          <div className="info w-full">
            <h3 className="text-sm sm:text-base">Products</h3>
            <h2 className="font-semibold text-lg sm:text-xl">{props.product}</h2>
          </div>
          <IoStatsChart className="text-[60px] sm:text-[70px] text-red-500" />
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
