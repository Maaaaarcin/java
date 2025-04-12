import {Link} from "react-router-dom";

function Footer() {
    return (
        <footer>
            <div className="w-full mx-auto p-4 md:flex md:items-center md:justify-center dark:bg-gray-800">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <Link
                    to="/" className="hover:underline">Staem™</Link>. All Rights Reserved.</span>
            </div>
        </footer>
    );
}

export default Footer;