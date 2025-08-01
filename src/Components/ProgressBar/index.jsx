export default function ProgressBar(props) {
  return (
    <div className="w-[150px] h-[5px] overflow-hidden rounded-sm">
      <span
        className={`flex items-center w-[${props.value}%] h-[5px] bg-blue-500 ${
          props.type === "success" && "bg-green-700"
        } ${props.type === "Failed" && "bg-red-700"}
        ${props.type === "warning" && "bg-orange-500"}`}
      ></span>
    </div>
  );
}
