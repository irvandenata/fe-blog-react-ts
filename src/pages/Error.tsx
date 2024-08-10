import { Link } from 'react-router-dom'

const ErrorPage = () => {
    return (
        <div>
            <h1>Error Page</h1>
            <Link to="/">Go to Landing</Link>
        </div>
    );
};

export default ErrorPage;
