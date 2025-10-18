import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";

interface Dataset {
  id: number;
  arTxId: string;
  owner: string;
  createdAt: number;
  licenseId?: number;
  licenseName?: string;
  licenseType?: number;
  totalSupply?: string;
}

const DatasetGallery: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "my">("all");

  // 读取 dataset 总数
  const { data: datasetIndex } = useScaffoldContractRead({
    contractName: "DatasetRegistry",
    functionName: "datasetIndex",
  });

  // 获取所有 datasets
  useEffect(() => {
    const fetchDatasets = async () => {
      if (!datasetIndex) return;

      const total = Number(datasetIndex);
      const datasetPromises = [];

      for (let i = 1; i <= total; i++) {
        datasetPromises.push(
          fetch(`/api/dataset/${i}`)
            .then(res => res.json())
            .catch(() => null)
        );
      }

      const results = await Promise.all(datasetPromises);
      const validDatasets = results
        .filter(dataset => dataset !== null)
        .map((dataset, index) => ({
          ...dataset,
          id: index + 1,
          createdAt: Date.now() - index * 86400000, // 模拟时间戳
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      setDatasets(validDatasets);
      setLoading(false);
    };

    fetchDatasets();
  }, [datasetIndex]);

  const getLicenseTypeName = (type?: number) => {
    if (type === undefined) return "未绑定";
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

  const getLicenseTypeColor = (type?: number) => {
    if (type === undefined) return "bg-gray-100 text-gray-800";
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

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const filteredDatasets =
    filter === "my" && connectedAddress
      ? datasets.filter(d => d.owner.toLowerCase() === connectedAddress.toLowerCase())
      : datasets;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">加载 Dataset 数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🗂️ Dataset 画廊</h1>
        <p className="text-gray-600">浏览所有已注册的数据集 NFT</p>
        <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">总计: {datasets.length} 个数据集</span>
            {connectedAddress && (
              <span className="text-sm text-gray-500">
                已连接: <Address address={connectedAddress} />
              </span>
            )}
          </div>

          {/* Filter Buttons */}
          {connectedAddress && (
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilter("my")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === "my"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                我的数据集
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dataset Cards Grid */}
      {filteredDatasets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            {filter === "my" ? "您还没有创建任何数据集" : "暂无数据集"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map(dataset => (
            <div
              key={dataset.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
            >
              {/* Dataset Image/Icon */}
              <div className="bg-gradient-to-br from-blue-400 to-purple-600 h-48 flex items-center justify-center relative">
                <div className="text-white text-6xl">📊</div>
                {connectedAddress &&
                  dataset.owner.toLowerCase() === connectedAddress.toLowerCase() && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      我的
                    </div>
                  )}
              </div>

              {/* Dataset Info */}
              <div className="p-6">
                {/* Dataset ID */}
                <h3 className="text-xl font-bold mb-3">Dataset #{dataset.id}</h3>

                {/* License Type Badge */}
                {dataset.licenseType !== undefined && (
                  <div className="mb-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getLicenseTypeColor(
                        dataset.licenseType,
                      )}`}
                    >
                      {getLicenseTypeName(dataset.licenseType)}
                    </span>
                  </div>
                )}

                {/* Owner */}
                <div className="mb-2">
                  <span className="text-sm text-gray-600">拥有者:</span>
                  <Address address={dataset.owner} />
                </div>

                {/* Arweave TX ID */}
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Arweave ID:</span>
                  <a
                    href={`https://arweave.net/${dataset.arTxId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800 font-mono"
                  >
                    {formatAddress(dataset.arTxId)}
                  </a>
                </div>

                {/* Total Supply */}
                {dataset.totalSupply && (
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">总供应量:</span>
                    <span className="ml-2 text-sm font-semibold">
                      {(Number(dataset.totalSupply) / 1e18).toFixed(2)} 份额
                    </span>
                  </div>
                )}

                {/* Created Time */}
                <div className="mb-4">
                  <span className="text-sm text-gray-600">创建时间:</span>
                  <span className="ml-2 text-sm">{formatDate(dataset.createdAt)}</span>
                </div>

                {/* License Info */}
                {dataset.licenseId && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">绑定许可证</div>
                    <div className="text-sm font-semibold">
                      {dataset.licenseName || `License #${dataset.licenseId}`}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    查看详情
                  </button>
                  {connectedAddress &&
                    dataset.owner.toLowerCase() !== connectedAddress.toLowerCase() && (
                      <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                        购买份额
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">{datasets.length}</div>
          <div className="text-blue-100">总数据集数量</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">
            {datasets.filter(d => d.licenseType === 1).length}
          </div>
          <div className="text-green-100">完全开放许可</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">
            {connectedAddress
              ? datasets.filter(d => d.owner.toLowerCase() === connectedAddress.toLowerCase()).length
              : 0}
          </div>
          <div className="text-purple-100">我的数据集</div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">关于 Dataset NFT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="mb-2">
              <strong>📊 数据集注册：</strong>每个数据集都有唯一的 ID 和 Arweave 交易 ID，确保内容不可篡改。
            </p>
            <p>
              <strong>🔗 许可证绑定：</strong>数据集可以绑定不同类型的许可证，定义使用规则。
            </p>
          </div>
          <div>
            <p className="mb-2">
              <strong>🪙 份额交易：</strong>通过 Bodhi1155 合约，数据集可以被分割成份额进行交易。
            </p>
            <p>
              <strong>💰 创作者收益：</strong>所有交易都会向原创作者支付 5% 的费用。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetGallery;

