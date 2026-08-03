import LoadingNeo from "@/components/ui/LoadingNeo";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <LoadingNeo variant="page" message="Memuat halaman..." />
    </div>
  );
}