"use client";

import { useState } from "react";

interface Bundle {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  tags: string[];
  isActive: boolean;
}

interface BundleManagerProps {
  crewCaptainId: string;
  initialBundles?: Bundle[];
  onBundlesChange?: (bundles: Bundle[]) => void;
}

export default function BundleManager({ crewCaptainId, initialBundles = [], onBundlesChange }: BundleManagerProps) {
  const [bundles, setBundles] = useState<Bundle[]>(initialBundles);
  const [showForm, setShowForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    tags: "",
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bundleData: Bundle = {
      id: editingBundle?.id || `bundle_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: formData.duration,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      isActive: formData.isActive,
    };

    let updatedBundles;
    if (editingBundle) {
      updatedBundles = bundles.map((bundle) => (bundle.id === editingBundle.id ? bundleData : bundle));
    } else {
      updatedBundles = [...bundles, bundleData];
    }

    setBundles(updatedBundles);
    onBundlesChange?.(updatedBundles);
    resetForm();
  };

  const handleEdit = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setFormData({
      title: bundle.title,
      description: bundle.description,
      price: bundle.price.toString(),
      duration: bundle.duration,
      tags: bundle.tags.join(", "),
      isActive: bundle.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = (bundleId: string) => {
    if (confirm("Are you sure you want to delete this bundle?")) {
      const updatedBundles = bundles.filter((bundle) => bundle.id !== bundleId);
      setBundles(updatedBundles);
      onBundlesChange?.(updatedBundles);
    }
  };

  const handleToggleActive = (bundleId: string) => {
    const updatedBundles = bundles.map((bundle) => (bundle.id === bundleId ? { ...bundle, isActive: !bundle.isActive } : bundle));
    setBundles(updatedBundles);
    onBundlesChange?.(updatedBundles);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      duration: "",
      tags: "",
      isActive: true,
    });
    setEditingBundle(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Service Bundles</h2>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors">
          Add New Bundle
        </button>
      </div>

      {/* Bundle List */}
      <div className="space-y-4 mb-6">
        {bundles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No bundles created yet</p>
            <p className="text-sm">Create your first bundle to start offering fixed-price services</p>
          </div>
        ) : (
          bundles.map((bundle) => (
            <div key={bundle.id} className={`border rounded-lg p-4 ${bundle.isActive ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{bundle.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${bundle.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{bundle.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{bundle.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium text-[var(--primary)]">${bundle.price}</span>
                    <span>{bundle.duration}</span>
                  </div>
                  {bundle.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {bundle.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleToggleActive(bundle.id)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      bundle.isActive ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {bundle.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleEdit(bundle)} className="px-3 py-1 text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(bundle.id)} className="px-3 py-1 text-xs bg-red-100 text-red-800 hover:bg-red-200 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bundle Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">{editingBundle ? "Edit Bundle" : "Create New Bundle"}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Bundle Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="e.g. Night Out Planning"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                  placeholder="Describe what's included in this bundle..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="1"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="25.00"
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="e.g. 1 day, 1 week"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="e.g. nightlife, restaurants, quick (comma-separated)"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="mr-2" />
                  <span className="text-sm text-gray-700">Make this bundle active immediately</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors">
                  {editingBundle ? "Update Bundle" : "Create Bundle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
