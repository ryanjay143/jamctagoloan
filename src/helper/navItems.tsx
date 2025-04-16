import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faCalendarCheck, faList } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";

export const navItems = [
    {
      label: "Check Attendance",
      to: "/jamc/tagoloan/attendance",
      icon: <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />,
    },
    {
      label: "Attendance Record",
      to: "/jamc/tagoloan/attendance/history",
      icon: <FontAwesomeIcon icon={faHistory} className="mr-2" />,
    },
    {
      label: "Add Member",
      to: "/jamc/tagoloan/attendance/add-member",
      icon: <FontAwesomeIcon icon={faUserPlus} className="mr-2" />,
    },
    {
      label: "Attendance Report",
      to: "/jamc/tagoloan/attendance/reports",
      icon: <FontAwesomeIcon icon={faList} className="mr-2" />,
    },
  ];

export default navItems;