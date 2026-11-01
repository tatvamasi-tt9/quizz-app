import { useEffect, useRef, useState } from "react";

const GraphDesign = ({ clusters, selectedClusters, onToggleCluster }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [nodePositions, setNodePositions] = useState([]);

  // Update canvas dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = Math.max(600, window.innerHeight - 300);
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Calculate node positions in a circle around center
  useEffect(() => {
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    const positions = clusters.map((cluster, index) => {
      const angle = (index / clusters.length) * 2 * Math.PI - Math.PI / 2;
      return {
        clusterId: cluster.clusterId,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        angle,
      };
    });

    setNodePositions(positions);
  }, [clusters, dimensions]);

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw connections from center to nodes
    nodePositions.forEach((pos) => {
      const cluster = clusters.find((c) => c.clusterId === pos.clusterId);
      const isSelected = selectedClusters.includes(pos.clusterId);
      const isHovered = hoveredNode === pos.clusterId;

      // Draw line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = isSelected
        ? "rgba(37, 99, 235, 0.6)"
        : "rgba(156, 163, 175, 0.3)";
      ctx.lineWidth = isSelected || isHovered ? 3 : 1.5;
      ctx.stroke();
    });

    // Draw center node
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#1f2937";
    ctx.fill();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Topics", centerX, centerY);

    // Draw cluster nodes
    nodePositions.forEach((pos) => {
      const cluster = clusters.find((c) => c.clusterId === pos.clusterId);
      const isSelected = selectedClusters.includes(pos.clusterId);
      const isHovered = hoveredNode === pos.clusterId;

      const nodeRadius = isHovered ? 45 : 40;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);

      if (isSelected) {
        ctx.fillStyle = "#3b82f6";
      } else {
        ctx.fillStyle = "#ffffff";
      }
      ctx.fill();

      ctx.strokeStyle = isSelected ? "#2563eb" : "#d1d5db";
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();

      // Draw chunk count badge
      const badgeRadius = 18;
      const badgeX = pos.x + nodeRadius - 8;
      const badgeY = pos.y - nodeRadius + 8;

      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? "#1e40af" : "#6b7280";
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(cluster.chunkCount, badgeX, badgeY);
    });
  }, [
    clusters,
    selectedClusters,
    hoveredNode,
    nodePositions,
    dimensions,
  ]);

  // Handle click on canvas
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on any node
    nodePositions.forEach((pos) => {
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (distance <= 45) {
        onToggleCluster(pos.clusterId);
      }
    });
  };

  // Handle mouse move for hover effect
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let foundHover = null;
    nodePositions.forEach((pos) => {
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (distance <= 45) {
        foundHover = pos.clusterId;
      }
    });

    setHoveredNode(foundHover);
    canvas.style.cursor = foundHover !== null ? "pointer" : "default";
  };

  // Get cluster info for tooltip
  const getHoveredCluster = () => {
    if (hoveredNode === null) return null;
    return clusters.find((c) => c.clusterId === hoveredNode);
  };

  const hoveredCluster = getHoveredCluster();

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
        className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900"
      />

      {/* Tooltip for hovered node */}
      {hoveredCluster && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-lg p-4 shadow-xl max-w-md z-10">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
            {hoveredCluster.topicName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {hoveredCluster.chunkCount} chunk{hoveredCluster.chunkCount !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {hoveredCluster.representativeSnippet}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Click to {selectedClusters.includes(hoveredCluster.clusterId) ? "deselect" : "select"}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-6 justify-center text-sm">
        {clusters.map((cluster) => {
          const isSelected = selectedClusters.includes(cluster.clusterId);
          return (
            <button
              key={cluster.clusterId}
              onClick={() => onToggleCluster(cluster.clusterId)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isSelected
                  ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500"
                  : "bg-gray-100 dark:bg-slate-800 border-2 border-transparent hover:border-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  isSelected ? "bg-blue-600" : "bg-gray-400"
                }`}
              />
              <span className="font-medium text-gray-900 dark:text-white">
                {cluster.topicName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({cluster.chunkCount})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GraphDesign;
