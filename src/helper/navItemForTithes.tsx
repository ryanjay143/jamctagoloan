import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faList12, faUser, faMoneyCheck } from "@fortawesome/free-solid-svg-icons";

export const navItemForTithes = [
    {
      label: "Tithes Giving",
      to: "/jamc/tagoloan/tithes-offering",
      icon: <FontAwesomeIcon icon={faGift} className="mr-2" />,
    },
    // {
    //   label: "Expense",
    //   to: "/jamc/tagoloan/expense",
    //   icon: <FontAwesomeIcon icon={faMoneyCheck} className="mr-2" />,
    // },
    {
      label: "Expense",
      to: "/jamc/tagoloan/tithes-offering/expense",
      icon: <FontAwesomeIcon icon={faMoneyCheck} className="mr-2" />,
    },
    {
      label: "Reports",
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