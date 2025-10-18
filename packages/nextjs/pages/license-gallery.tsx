import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";

interface License {
  id: number;
  name: string;
  uri: string;
  licenseType: number;
  active: boolean;
  createdAt: number;
}

const LicenseGallery: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  // 读取 license 总数
  const { data: licenseIndex } = useScaffoldContractRead({
    contractName: "DataLicense",
    functionName: "licenseIndex",
  });

  // 获取所有 licenses
  useEffect(() => {
    const fetchLicenses = async () => {
      if (!licenseIndex) return;

      const total = Number(licenseIndex);
      const licensePromises = [];

      for (let i = 1; i <= total; i++) {
        licensePromises.push(
          fetch(`/api/license/${i}`)
            .then(res => res.json())
            .catch(() => null)
        );
      }

      const results = await Promise.all(licensePromises);
      const validLicenses = results
        .filter(license => license !== null)
        .map((license, index) => ({
          ...license,
          id: index + 1,
          createdAt: Date.now() - index * 86400000, // 模拟时间戳
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      setLicenses(validLicenses);
      setLoading(false);
    };

    fetchLicenses();
  }, [licenseIndex]);

  const getLicenseTypeName = (type: number) => {
    switch (type) {
      case 0:
        return "禁止衍生";
      case 1:
        return "完全开放";
      case 2:
        return "5% 回流";
      default:
        return "未知";
    }
  };

  const getLicenseTypeColor = (type: number) => {
    switch (type) {
      case 0:
        return "bg-red-100 text-red-800";
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">加载 License 数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📜 License 画廊</h1>
        <p className="text-gray-600">浏览所有已创建的数据许可证模板</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-gray-500">总计: {licenses.length} 个许可证</span>
          {connectedAddress && (
            <span className="text-sm text-gray-500">
              已连接: <Address address={connectedAddress} />
            </span>
          )}
        </div>
      </div>

      {/* License Cards Grid */}
      {licenses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">暂无许可证数据</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {licenses.map(license => (
            <div
              key={license.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
            >
              {/* License Image/Icon */}
              <div className="bg-gradient-to-br from-purple-400 to-indigo-600 h-48 flex items-center justify-center">
                <div className="text-white text-6xl">📜</div>
              </div>

              {/* License Info */}
              <div className="p-6">
                {/* License Name */}
                <h3 className="text-xl font-bold mb-2 truncate">{license.name}</h3>

                {/* License Type Badge */}
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getLicenseTypeColor(
                      license.licenseType,
                    )}`}
                  >
                    {getLicenseTypeName(license.licenseType)}
                  </span>
                </div>

                {/* License ID */}
                <div className="mb-2">
                  <span className="text-sm text-gray-600">License ID:</span>
                  <span className="ml-2 text-sm font-mono font-semibold">#{license.id}</span>
                </div>

                {/* Status */}
                <div className="mb-2">
                  <span className="text-sm text-gray-600">状态:</span>
                  <span
                    className={`ml-2 text-sm font-semibold ${
                      license.active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {license.active ? "✓ 活跃" : "✗ 未激活"}
                  </span>
                </div>

                {/* Created Time */}
                <div className="mb-4">
                  <span className="text-sm text-gray-600">创建时间:</span>
                  <span className="ml-2 text-sm">{formatDate(license.createdAt)}</span>
                </div>

                {/* URI */}
                {license.uri && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">URI:</span>
                    <a
                      href={license.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-sm text-blue-600 hover:text-blue-800 truncate block"
                    >
                      {license.uri.length > 30 ? `${license.uri.slice(0, 30)}...` : license.uri}
                    </a>
                  </div>
                )}

                {/* Action Button */}
                <button className="w-full mt-4 bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">许可证类型说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
              禁止衍生
            </span>
            <p className="text-sm text-gray-600">数据集只能按原样使用，不允许创建衍生作品</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              完全开放
            </span>
            <p className="text-sm text-gray-600">数据集可以自由使用，包括创建衍生作品</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
              5% 回流
            </span>
            <p className="text-sm text-gray-600">允许衍生作品，但 5% 收益回流给原作者</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseGallery;

