import React from "react";
import SidebarMenu from "../SidebarMenu";
import IoTDeviceTable from "../IoTDeviceTable";
import SendMessageView from "../SendMessage/SendMessageView";
import RecievedMessages from "../RecieveMessages";
import SettingsView from "../SettingsView";
import Loader from "../commons/Loader";
import { useMessages } from "../../hooks/useMessages";
import { useDashboardContext } from "../../context/DashboardContext";
import FilterButtons from "../commons/FilterButtons";
import Pagination from "../commons/Pagination";

const Dashboard: React.FC = () => {
  const { activeView, filters, setFilters } = useDashboardContext();

  const { messages, pagination, loading, isPending, error } = useMessages({
    ...filters,
    page: filters.page || 1,
    limit: filters.limit || 10,
  });

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const updateFilter = (filterType: "topic" | "sensorType", value: string) => {
    setFilters({
      ...filters,
      topic: filterType === "topic" ? value : "", // Clear topic if selecting sensorType
      sensorType: filterType === "sensorType" ? value : "", // Clear sensorType if selecting topic
    });
  };

  const getViewTitle = () => {
    switch (activeView) {
      case "last-messages":
        return "Last Messages";
      case "all-devices":
        return "All Devices";
      case "send-message":
        return "Send Message";
      case "settings":
        return "Settings";
      default:
        return "Last Messages";
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "all-devices":
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-white text-2xl font-bold">
                {getViewTitle()}
              </h1>
            </div>
            <div className="p-6 min-h-screen">
              <IoTDeviceTable
                devices={messages}
                pagination={pagination}
                loading={loading}
              />
            </div>
          </>
        );

      case "last-messages":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-white text-2xl font-bold">
                {getViewTitle()}
              </h1>
              {activeView === "last-messages" && (
                <div className="text-green-400 text-sm">
                  Showing {messages.length} most recent messages
                </div>
              )}
            </div>
            <FilterButtons filters={filters} updateFilter={updateFilter} />;
            <RecievedMessages messages={messages} />
            {pagination && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        );

      default:
        return;
    }
  };

  return (
    <div className="flex h-screen">
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          background: "linear-gradient(135deg, #0F160A 0%, #577C38 100%)",
        }}
      >
        <div className="p-8 max-w-7xl mx-auto">{renderContent()}</div>
        {loading && <Loader />}
      </div>
    </div>
  );
};

export default Dashboard;
