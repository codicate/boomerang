import { useState } from "react";
import { Button } from "./ui/button";
import { NewResourceInput } from "../types/resource";

interface AddResourceFormProps {
  onSubmit: (
    resource: NewResourceInput
  ) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

export const AddResourceForm = ({
  onSubmit,
  isSubmitting,
}: AddResourceFormProps) => {
  const [formData, setFormData] = useState<NewResourceInput>({
    title: "",
    url: "",
    description: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic validation
    if (
      !formData.title.trim() ||
      !formData.url.trim() ||
      !formData.description.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // URL validation
    try {
      new URL(formData.url);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    const result = await onSubmit(formData);

    if (result.success) {
      setSuccess(true);
      setFormData({ title: "", url: "", description: "", tags: [] });
      setTagInput("");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to submit resource");
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Share a Resource
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g., Senior React Developer at TechCorp"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            disabled={isSubmitting}
          />
        </div>

        {/* URL Input */}
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            URL *
          </label>
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder="https://example.com/job-posting"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            disabled={isSubmitting}
          />
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Brief description of the resource..."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Tags Input */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-200 hover:text-white transition-colors"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagInputKeyPress}
              placeholder="Add a tag and press Enter"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              disabled={isSubmitting}
            />
            <Button
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim() || isSubmitting}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-2 rounded-lg text-sm">
            Resource shared successfully! 🎉
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sharing..." : "Share Resource"}
        </Button>
      </form>
    </div>
  );
};
