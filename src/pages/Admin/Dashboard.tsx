import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setMenu } from '@/redux/slices/menuSlice';

const DashboardPage = () => {
   
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setMenu("Dashboard"));
    });
    
    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            Dashboard
            </div>
        </>
    );
};

export default DashboardPage;
