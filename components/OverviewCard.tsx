export function OverviewCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

