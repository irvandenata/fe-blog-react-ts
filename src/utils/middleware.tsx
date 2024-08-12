import { setModal } from "@/redux/slices/modalSlice";
import { useDispatch } from "react-redux";

export const middlewareLoader = () => {
    // const dispatch = useDispatch();
    // dispatch(
    //     setModal({
    //         isOpen: false,
    //     })
    // );
    return true;
};
