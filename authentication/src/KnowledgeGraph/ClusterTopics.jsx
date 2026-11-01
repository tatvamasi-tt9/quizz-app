import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../loginandsignup/1st_page/Navbar";
import GraphDesign from "./GraphDesign";

const ClusterTopics = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { docId, clusters, difficulty } = location.state || {};

  const [selectedClusters, setSelectedClusters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle cluster selection toggle
  const toggleCluster = (clusterId) => {
    setSelectedClusters((prev) =>
      prev.includes(clusterId)
        ? prev.filter((id) => id !== clusterId)
        : [...prev, clusterId]
    );
  };

  // Select all clusters
  const selectAll = () => {
    setSelectedClusters(clusters.map((c) => c.clusterId));
  };

  // Deselect all clusters
  const deselectAll = () => {
    setSelectedClusters([]);
  };

  // Generate quiz from selected topics
  const handleGenerateQuiz = async () => {
    if (selectedClusters.length === 0) {
      alert("Please select at least one topic");
      return;
    }

    try {
      setIsGenerating(true);

      const response = await fetch(
        "http://localhost:8080/generate-quiz-from-clusters",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            docId: docId,
            selectedClusterIds: selectedClusters,
            difficulty: difficulty || "medium",
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();

      console.log("Quiz generated:", data);

      // Navigate to quiz page
      navigate(`/questions/${data.sessionId}`);

    } catch (err) {
      console.error(err);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // If no data, redirect back
  if (!docId || !clusters) {
    navigate("/upload");
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Knowledge Graph - Topic Clusters
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Click on nodes to select topics for your quiz
        </p>

        {/* Selection Controls */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={selectAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Select All
          </button>
          <button
            onClick={deselectAll}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Deselect All
          </button>
          <div className="ml-auto text-gray-700 dark:text-gray-300 font-medium">
            Selected: {selectedClusters.length} / {clusters.length}
          </div>
        </div>

        {/* Graph Visualization */}
        <GraphDesign
          clusters={clusters}
          selectedClusters={selectedClusters}
          onToggleCluster={toggleCluster}
        />

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            Back
          </button>
          <button
            onClick={handleGenerateQuiz}
            disabled={isGenerating || selectedClusters.length === 0}
            className={`
              px-6 py-3 rounded-lg font-medium transition
              ${
                isGenerating || selectedClusters.length === 0
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              }
            `}
          >
            {isGenerating ? "Generating..." : "Generate Quiz from Selected Topics"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ClusterTopics;
