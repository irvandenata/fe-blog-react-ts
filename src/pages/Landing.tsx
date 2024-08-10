import { SparklesPreview } from "@/components/example/sparkle";
import { Link } from "react-router-dom";

const LandingPage = () => { 
    return (
        <div>
            <h1>Landing Page</h1>
            <Link to="/login">Go to Login</Link>
            <div className="flex justify-center items-center h-screen">
                <SparklesPreview />
            </div>
        </div>
    );
};

export default LandingPage;
