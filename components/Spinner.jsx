export default function Spinner({ full = true }) {
  return (
    <div className={`flex items-center justify-center ${full ? "min-h-[50vh]" : "py-10"}`}>
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
}
