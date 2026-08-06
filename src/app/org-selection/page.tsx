import { OrganizationList } from "@clerk/nextjs";

export default function OrganizationSelectionPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/"
        afterSelectOrganizationUrl="/"
        appearance={{
          elements: { rootBox: "mx-auto", card: "shadow-lg" },
        }}
      />
    </div>
  );
}
