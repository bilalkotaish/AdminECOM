import Button from "@mui/material/Button";
import { FaAngleDown, FaAngleUp, FaPlus } from "react-icons/fa6";
import { Mycontext } from "../../App";
import { useContext, useState } from "react";
import EditSubcat from "./editSubcat";

export default function SubCategoryList() {
  const context = useContext(Mycontext);
  const [isOpen, setOpen] = useState(false);

  const expand = (index) => {
    setOpen((prev) => (prev === index ? false : index));
  };

  return (
    <>
      {/* Header Card */}
      <div className="card my-6 shadow-lg sm:rounded-xl bg-white border border-gray-100">
        <h2 className="px-6 py-4 text-xl font-semibold text-gray-800">
          Sub Category List
        </h2>
        <div className="flex items-center justify-end gap-4 mb-4 pr-4">
          <Button
            onClick={() =>
              context.setisOpenPanel({ open: true, model: "Add SubCategory" })
            }
            className="flex items-center justify-center gap-2 !bg-blue-500 hover:bg-blue-600 !text-white font-semibold py-2 px-4 rounded whitespace-nowrap"
          >
            Add Sub Category <FaPlus className="text-[15px]" />
          </Button>
        </div>
      </div>

      {/* Categories & Subcategories List */}
      <div className="card my-3 pt-5 pb-5 px-4 shadow-md sm:rounded-lg bg-white">
        {context.catData.length !== 0 && (
          <ul className="w-full space-y-4">
            {context.catData.map((firstlevel, index) => (
              <li key={index}>
                {/* Main Category Row */}
                <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-200 bg-[#f1f1f1] px-4 rounded-md">
                  <span className="text-[15px] font-semibold text-gray-800">
                    {firstlevel.name}
                  </span>
                  <Button
                    onClick={() => expand(index)}
                    className="!w-[35px] !h-[35px] !p-2 !rounded-full hover:!bg-primary hover:!text-white !text-black"
                  >
                    {isOpen === index ? <FaAngleDown /> : <FaAngleUp />}
                  </Button>
                </div>

                {/* Subcategories */}
                {isOpen === index && firstlevel.children?.length > 0 && (
                  <ul className="mt-3 ml-6 space-y-3">
                    {firstlevel.children.map((secondlevel, subIndex) => (
                      <li
                        key={subIndex}
                        className="bg-gray-50 px-4 py-2 rounded-md shadow-sm"
                      >
                        <EditSubcat
                          name={secondlevel.name}
                          id={secondlevel._id}
                          catData={context.catData}
                          index={subIndex}
                          selectedCat={secondlevel.parentId}
                          selectedCatname={secondlevel.parentName}
                          subcat={context.catData}
                        />

                        {secondlevel?.children.length > 0 && (
                          <ul className="mt-3 ml-6 space-y-3">
                            {secondlevel.children.map(
                              (thirdlevel, thirdIndex) => (
                                <li
                                  key={thirdIndex}
                                  className="bg-gray-50 px-4 py-2 rounded-md shadow-sm"
                                >
                                  <EditSubcat
                                    name={thirdlevel.name}
                                    id={thirdlevel._id}
                                    catData={secondlevel.children}
                                    index={thirdIndex}
                                    selectedCat={thirdlevel.parentId}
                                    selectedCatname={thirdlevel.parentName}
                                    subcat={firstlevel.children}
                                  />
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
