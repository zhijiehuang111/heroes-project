import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-gray-600">頁面不存在</p>
        <div className="mt-4">
          <Link
            href="/heroes"
            className="px-4 py-2 rounded border border-blue-500 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
          >
            返回英雄列表
          </Link>
        </div>
      </div>
    </div>
  );
}
