import { SparklesPreview } from "@/components/Example/sparkle";
import { Link } from "react-router-dom";

const LandingPage = () => { 
    return (
        <div>
            <div className="flex justify-center items-center h-screen">
                <SparklesPreview />
            </div>
        </div>
    );
};

export default LandingPage;
