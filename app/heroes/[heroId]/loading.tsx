export default function HeroProfileSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-10 py-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <div className="flex flex-col items-center gap-4 sm:items-start">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-4 bg-gray-200 rounded" />
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="w-8 h-4 bg-gray-200 rounded" />
              <div className="w-8 h-8 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-3 mt-6 sm:items-start sm:justify-end sm:mt-0 sm:ml-auto">
          <div className="w-24 h-5 bg-gray-200 rounded" />
          <div className="w-24 h-9 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
