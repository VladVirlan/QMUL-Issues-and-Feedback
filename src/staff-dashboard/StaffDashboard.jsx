import { useMemo, useState } from "react";
import "./StaffDashboard.css";
import Tickets from "../staff_tabs/Tickets";
import Services from "../components/admin_tabs/Services";
import ECClaimsReview from "../staff_tabs/ECClaimsReview";
import ModuleOrganiser from "../module_organiser/ModuleOrganiser";

const StaffDashboard = ({ onLogout, staffRole }) => {
    const tabs = useMemo(
        () => {
            const baseTabs = [
                {
                    id: "tickets",
                    label: "Tickets",
                    subtitle: "View and manage support tickets",
                    component: Tickets,
                },
                {
                    id: "services",
                    label: "Services",
                    subtitle: "Update service health and outages",
                    component: Services,
                },
            ];

            if (staffRole === "SST") {
                baseTabs.push({
                    id: "ec-claims",
                    label: "EC Claims",
                    subtitle: "Review, approve, or reject EC claims",
                    component: ECClaimsReview,
                });
            }

            return baseTabs;
        },
        [staffRole],
    );

    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const activeTabItem = tabs.find((tab) => tab.id === activeTab) || tabs[0];
    const ActiveComponent = activeTabItem.component;

    if (staffRole === "MODULE_ORGANISER") {
        return (
            <div className="StaffDashboardContainer">
                <div className="StaffDashboardHeader">
                    <div>
                        <h1>Module Organiser Dashboard</h1>
                        <p>Manage module-related tasks and information.</p>
                    </div>
                    <button id="LogOutButton" onClick={onLogout}>
                        LOG OUT
                    </button>
                </div>

                <div className="StaffTabs">
                    <button className="staff-tab active">
                        <span>EC Submissions</span>
                        <small>View extenuating circumstance submissions</small>
                    </button>
                </div>

                <div className="StaffTabContent">
                    <ModuleOrganiser />
                </div>
            </div>
        )
    }

    return (
        <div className="StaffDashboardContainer">
            <div className="StaffDashboardHeader">
                <div>
                    <h1>Staff Dashboard</h1>
                    <p>Manage tickets and service updates in one place.</p>
                </div>
                <button id="LogOutButton" onClick={onLogout}>
                    LOG OUT
                </button>
            </div>

            <div className="StaffTabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={activeTab === tab.id ? "staff-tab active" : "staff-tab"}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span>{tab.label}</span>
                        <small>{tab.subtitle}</small>
                    </button>
                ))}
            </div>

            <div className="StaffTabContent">
                <ActiveComponent />
            </div>
        </div>
    );
};

export default StaffDashboard;
