import { useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";

export default function Searchbox(props) {
  const [search, setSearch] = useState("");
  const searchInput = useRef();
  const onChangeInput = (e) => {
    setSearch(e.target.value);
    props.setSearch(e.target.value);
    if (e.target.value === "") {
      props.setSearch("");
      props.setPerPage1(1);
    }
  };
  return (
    <div className="!w-full mt-2  h-auto bg-[#f1f1f1] relative rounded-full">
      <IoSearch className="top-[12px] left-[10px] absolute text-[rgba(0,0,0,0.5)]" />
      <input
        type="text"
        placeholder="Search  ..."
        onChange={onChangeInput}
        ref={searchInput}
        value={search}
        className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] bg-[#f1f1f1] p-2 pl-8 rounded-full focus:outline-none focus:border-[rgba(0,0,0,0.5)] "
      />
    </div>
  );
}
