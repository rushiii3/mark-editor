import { StorageDashboard } from "./storage-dashboard";

export const metadata = {
  title: "Storage",
  description: "Monitor local storage usage, quota, and resource categories."
};

export default function StoragePage() {
  return <StorageDashboard />;
}
