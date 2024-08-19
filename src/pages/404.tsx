import { Link } from 'react-router-dom'

const ErrorPage = () => {
    return (
        <div className='relative z-10 grid place-content-center h-screen w-full text-center'>
            <h1 className='text-3xl font-bold'>What are you doing here?</h1>
            <Link to='/' className='py-1 cursor-pointer px-2 rounded-lg mt-4 bg-primary'>Go Home</Link>
        </div>
    );
};
export default ErrorPage;
