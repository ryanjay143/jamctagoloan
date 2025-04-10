import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";

export const navItems = [
    {
      label: "Check Attendance",
      to: "/jamc/tagoloan/user-dashboard",
      icon: <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />,
    },
    {
      label: "Attendance History",
      to: "/jamc/tagoloan/user-dashboard/history",
      icon: <FontAwesomeIcon icon={faHistory} className="mr-2" />,
    },
    {
      label: "Add Member",
      to: "/jamc/tagoloan/user-dashboard/add-member",
      icon: <FontAwesomeIcon icon={faUserPlus} className="mr-2" />,
    },
  ];

export default navItems;