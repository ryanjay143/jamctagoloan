import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faList12, faUser, faMoneyCheck } from "@fortawesome/free-solid-svg-icons";

export const navItemForTithes = [
    {
      label: "Tithes Giving",
      to: "/jamctagoloan/tithes-offering",
      icon: <FontAwesomeIcon icon={faGift} className="mr-2" />,
    },
    // {
    //   label: "Expense",
    //   to: "/jamctagoloan/expense",
    //   icon: <FontAwesomeIcon icon={faMoneyCheck} className="mr-2" />,
    // },
    {
      label: "Expense",
      to: "/jamctagoloan/tithes-offering/expense",
      icon: <FontAwesomeIcon icon={faMoneyCheck} className="mr-2" />,
    },
    {
      label: "Reports",
      to: "/jamctagoloan/tithes-offering/report",
      icon: <FontAwesomeIcon icon={faList12} className="mr-2" />,
    },
    {
      label: "Per Member Summary",
      to: "/jamctagoloan/tithes-offering/per-member-summary",
      icon: <FontAwesomeIcon icon={faUser} className="mr-2" />,
    },
  ];

export default navItemForTithes;