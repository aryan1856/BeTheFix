import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Upload, Sparkles, MapPin, X } from "lucide-react";
import toast from "react-hot-toast";

const ReportIssue = () => {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [location, setLocation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDescription, setUserDescription] = useState("");

  const categories = [
    "Garbage",
    "Events",
    "Community",
    "Announcements",
    "Questions",
    "Other",
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    setImages((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: true,
  });

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAutoGenerate = async () => {
    if (!userDescription || selectedCategories.length === 0) {
      return alert(
        "Please provide description and select at least one category."
      );
    }

    setIsGenerating(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/generate-complaint`,
        {
          userDescription,
          categories: selectedCategories.join(", "),
        },
        { withCredentials: true }
      );

      if (res.data?.complaint) {
        setCaption(res.data.complaint);
      } else {
        console.error("No complaint returned:", res.data);
      }
    } catch (err) {
      toast.error("Auto-generate error.", err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !caption ||
      selectedCategories.length === 0 ||
      images.length === 0 ||
      !location
    ) {
      return alert(
        "Please fill all required fields including images and location."
      );
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("categories", selectedCategories.join(","));
    formData.append("longitude", location.longitude);
    formData.append("latitude", location.latitude);
    images.forEach((image) => {
      formData.append("images", image.file);
    });

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.message === "Post created") {
        toast.success("Post created successfully");

        // Clear form fields
        setCaption("");
        setSelectedCategories([]);
        setImages([]);
        setLocation(null); // Optional — remove if you want to retain location
      } else {
        toast.error(error.message);
        console.error("Unexpected response", error.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error creating post:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit}>
        {/* Image Upload Section */}
        <div className="mb-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-2" size={32} />
            <p className="text-gray-600">
              Drag & drop images here, or click to select
            </p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    selectedCategories.includes(category)
                      ? "bg-[#2cb1bc] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Caption Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Caption
            </label>
            <button
              type="button"
              onClick={handleAutoGenerate}
              className="flex items-center gap-2 text-sm text-[#2cb1bc] hover:text-[#0e7c86]"
              disabled={isGenerating}
            >
              <Sparkles size={16} />
              {isGenerating ? "Generating..." : "Auto-generate"}
            </button>
          </div>
          {/* User Description Field for Auto Generation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe the issue briefly(2-words to auto-generate caption)
            </label>
            <input
              type="text"
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
              className="w-full p-3 border rounded-lg focus:border-transparent"
              placeholder="e.g. water leaking near park"
            />
          </div>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full h-32 p-3 border rounded-lg focus:border-transparent"
            placeholder="Write a caption for your post..."
          />
        </div>

        {/* Location Section */}
        {location && (
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span>
              Location detected: {location.latitude.toFixed(6)},{" "}
              {location.longitude.toFixed(6)}
            </span>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#2cb1bc] text-white hover:bg-[#0e7c86]"
          }`}
        >
          {isSubmitting ? "Posting..." : "Create Post"}
        </motion.button>
      </form>
    </div>
  );
};

export default ReportIssue;