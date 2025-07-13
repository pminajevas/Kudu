import PresidentProfile from "@/components/marketplace/PresidentProfile";
import PresidentManagement from "../../../../components/marketplace/PresidentManagement";

interface PresidentPageProps {
  params: {
    id: string;
  };
  searchParams: {
    newRegistration?: string;
    manage?: string;
  };
}

export default function PresidentPage({ params, searchParams }: PresidentPageProps) {
  const isManagementView = searchParams.newRegistration === "true" || searchParams.manage === "true";

  if (isManagementView) {
    return <PresidentManagement presidentId={params.id} />;
  }

  return <PresidentProfile presidentId={params.id} />;
}
