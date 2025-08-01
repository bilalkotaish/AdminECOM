export default function StatusBadge({ status }) {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-orange-500 text-white";
      case "confirmed":
        return "bg-green-500 text-white";
      case "canceled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <span
      className={`flex items-center justify-center py-1 px-3 text-[14px] capitalize rounded-full ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
}
