import Link from "next/link";
import { cn } from "@/lib/utils";

const ServiceCard = ({ icon: Icon, title, description, href }) => (
  <Link
    href={href}
    className="group block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105"
  >
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200 transition-colors">
        <Icon
          className="text-blue-600 group-hover:text-blue-700 transition-colors"
          size={32}
        />
      </div>
      <h3
        className={cn(
          "text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors"
        )}
      >
        {title}
      </h3>
    </div>
    <p
      className={cn(
        "text-gray-600 group-hover:text-gray-800 transition-colors"
      )}
    >
      {description}
    </p>
  </Link>
);

export default ServiceCard;
