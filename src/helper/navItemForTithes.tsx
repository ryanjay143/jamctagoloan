import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faGift, faList12, faUser, faMoneyCheck } from "@fortawesome/free-solid-svg-icons";

export const navItemForTithes = [
    {
      label: "Tithes Giving",
      to: "/jamc/tagoloan/tithes-offering",
      icon: <FontAwesomeIcon icon={faGift} className="mr-2" />,
    },
    {
      label: "Expense",
      to: "/jamc/tagoloan/expense",
      icon: <FontAwesomeIcon icon={faMoneyCheck} className="mr-2" />,
    },
    {
      label: "History",
      to: "/jamc/tagoloan/tithes-offering/history",
      icon: <FontAwesomeIcon icon={faHistory} className="mr-2" />,
    },
    {
      label: "Tithes Report",
      to: "/jamc/tagoloan/tithes-offering/report",
      icon: <FontAwesomeIcon icon={faList12} className="mr-2" />,
    },
    {
      label: "Per Member Summary",
      to: "/jamc/tagoloan/tithes-offering/per-member-summary",
      icon: <FontAwesomeIcon icon={faUser} className="mr-2" />,
    },
  ];

export default navItemForTithes;