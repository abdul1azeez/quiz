import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { FaTimes, FaCheck, FaUndo, FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import getCroppedImg from "../../../utils/canvasUtils"; // Adjust path as needed

const ImageEditorModal = ({ imageSrc, aspect, onCancel, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      // Create a File object from the Blob to match standard input behavior
      const file = new File([croppedImageBlob], "cropped-image.jpg", { type: "image/jpeg" });
      onSave(file);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh] md:h-[600px]">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 z-10 bg-[#1a1a1a]">
          <h3 className="text-white font-bold text-lg">Edit Image</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-white transition">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect} // 1 for Square, 16/9 for Banner
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
          />
        </div>

        {/* Controls */}
        <div className="p-6 bg-[#1a1a1a] flex flex-col gap-4 z-10 border-t border-white/10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Zoom Control */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-gray-400 font-medium uppercase tracking-wider">
                <span>Zoom</span>
                <span>{(zoom * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <FaSearchMinus className="text-gray-500 text-xs" />
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#04644C]"
                />
                <FaSearchPlus className="text-gray-500 text-xs" />
              </div>
            </div>

            {/* Rotation Control */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-gray-400 font-medium uppercase tracking-wider">
                <span>Rotate</span>
                <span>{rotation}°</span>
              </div>
              <div className="flex items-center gap-3">
                <FaUndo className="text-gray-500 text-xs -scale-x-100" />
                <input
                  type="range"
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby="Rotation"
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#04644C]"
                />
                <FaUndo className="text-gray-500 text-xs" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => { setRotation(0); setZoom(1); }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              Reset
            </button>
            <div className="flex-1"></div>
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-white/10 hover:bg-white/20 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-[#04644C] hover:bg-[#03523F] shadow-lg hover:shadow-[#04644C]/25 transition flex items-center gap-2"
            >
              <FaCheck /> Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;