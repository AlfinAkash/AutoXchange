import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import BASE_URL from "../../config/Config";
import { Spinner } from "react-bootstrap";
import styles from "../styles/dashboard.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch(`${BASE_URL}/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setSummary(data);
        } else {
          console.error("Failed to fetch summary:", await res.text());
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center mt-5 text-danger">No summary data found</div>
    );
  }

  const cards = [
    {
      label: "Vehicles In Stock",
      value: summary.unsoldCount,
      desc: "Total available for sale",
      icon: "bi-truck",
      bg: styles.cardBlue,
    },
    {
      label: "Vehicles Sold (This Month)",
      value: summary.soldCount,
      desc: "Successful transactions",
      icon: "bi-currency-dollar",
      bg: styles.cardGreen,
    },
    {
      label: "Upcoming Services",
      value: summary.withoutMaintenanceCount,
      desc: "Scheduled maintenance",
      icon: "bi-tools",
      bg: styles.cardYellow,
    },
    {
      label: "Total Purchase ₹",
      value: summary.totalPurchaseAmount.toLocaleString(),
      desc: "Overall buying cost",
      icon: "bi-cart-plus",
      bg: styles.cardPurple,
    },
    {
      label: "Total Sales ₹",
      value: summary.totalSalesAmount.toLocaleString(),
      desc: "Total amount received",
      icon: "bi-bar-chart",
      bg: styles.cardOrange,
    },
    {
      label: "Profit ₹",
      value: summary.profitAmount.toLocaleString(),
      desc: "Total margin earned",
      icon: "bi-graph-up-arrow",
      bg: styles.cardRed,
    },
  ];

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-center text-primary">Business Summary</h2>
<p className="text-center text-muted">Updated overview of vehicle sales, services & profit</p>

      <div className="row g-4">
        {cards.map((card, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4">
            <div className={`p-4 rounded shadow text-white ${card.bg} ${styles.dashboardCard}`}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{card.label}</h6>
                  <h2 className="fw-bold">{card.value}</h2>
                  <small>{card.desc}</small>
                </div>
                <i className={`bi ${card.icon} fs-2`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <small className="text-muted text-end d-block mt-3">
  Last updated: {new Date().toLocaleString()}
</small>
    </div>
  );
};

export default Dashboard;



