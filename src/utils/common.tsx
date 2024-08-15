import { openModal } from "@/redux/slices/imageModalSlice";
import { useDispatch } from "react-redux";




export const convertDate = (date: string, format: string) => {
    // input date format: yyyy-mm-dd
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString("default", { month: "short" });
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    if (format === "mm-dd-yyyy") {
        return `${month} ${day}, ${year}`;
    } else if (format === "mm-yyyy") {
        return `${month} ${year}`;
    } else {
        return `${day} ${month} ${year}`;
    }

}