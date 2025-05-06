import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faCalendarCheck, faList, faUser } from "@fortawesome/free-solid-svg-icons";

export const navItems = [
    {
      label: "Attendance",
      to: "/jamctagoloan/attendance",
      icon: <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />,
    },
    {
      label: "Records",
      to: "/jamctagoloan/attendance/history",
      icon: <FontAwesomeIcon icon={faHistory} className="mr-2" />,
    },
    {
      label: "Member",
      to: "/jamctagoloan/attendance/add-member",
      icon: <FontAwesomeIcon icon={faUser} className="mr-2" />,
    },
    {
      label: "Reports",
      to: "/jamctagoloan/attendance/reports",
      icon: <FontAwesomeIcon icon={faList} className="mr-2" />,
    },
  ];

export default navItems;