export const Loading = ({ label = "Loading" }: { label?: string }) => {
  return (
    <div role="status" className="flex items-center justify-center py-12">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-edge border-t-main" />
      <span className="sr-only">{label}</span>
    </div>
  );
};
