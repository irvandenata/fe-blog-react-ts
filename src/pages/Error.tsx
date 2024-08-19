import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="grid place-content-center h-screen w-full">
            <h1 className="text-3xl font-bold">What are you doing here?</h1>
            <Link to="/" className="text-blue-500">
                Go to Landing
            </Link>
        </div>
    );
};
export default ErrorPage;
