import { Link, useLocation } from "react-router-dom";
import { 
  Home, FileText, Folder, ChevronRight, 
  Gamepad2, MessageCircle, User, Image, Layers
} from "lucide-react";

// Mapping paths to icons
const iconMap = {
  home: <Home className="me-2 text-black" />,
  notes: <FileText className="me-2 text-black" />,
  tasks: <Folder className="me-2 text-black" />,
  images: <Image className="me-2 text-black" />,
  games: <Gamepad2 className="me-2 text-black" />,
  message: <MessageCircle className="me-2 text-black" />,
  profile: <User className="me-2 text-black" />,
  layers: <Layers className="me-2 text-black" />
};

const Breadcrumbs = () => {
    const location = useLocation();
    const paths = location.pathname.split("/").filter((path) => path);
    const isLastHome = paths.length === 0;

    return (
        <>
            {
                location.pathname !== '/login'  &&  location.pathname !== '/signup' && location.pathname !== '/forgot'&&
            <nav className="p-2 px-3 bg-light shadow-sm border rounded" style={{position: 'fixed', top: '62px', zIndex: '1', minWidth: 'auto'}}>
                <ul className="breadcrumb mb-0">
                    <li className={`breadcrumb-item ${isLastHome ? "active text-dark" : ""}`}>
                        <Link to="/" className="d-flex align-items-center text-decoration-none text-primary">
                        {iconMap["home"]}
                        <span className={`${isLastHome ? 'text-black' : 'text-primary'}`}>Home</span>
                        </Link>
                    </li>

                    {paths.map((path, index) => {
                    const fullPath = `/${paths.slice(0, index + 1).join("/")}`;
                    const icon = iconMap[path.toLowerCase()] || iconMap["layers"];
                    const isLast = index === paths.length - 1;
                    
                    return (
                        <li key={fullPath} className={`breadcrumb-item ${isLast ? "active text-dark" : ""}`}>
                        {!isLast ? (
                            <Link to={fullPath} className="d-flex align-items-center text-decoration-none text-primary">
                            {icon}
                            <span>{path.charAt(0).toUpperCase() + path.slice(1)}</span>
                            </Link>
                        ) : (
                            <span className="d-flex align-items-center">
                            {icon}
                            {path.charAt(0).toUpperCase() + path.slice(1)}
                            </span>
                        )}
                        </li>
                    );
                    })}
                </ul>
            </nav>}
        </>
    );
};

export default Breadcrumbs;
