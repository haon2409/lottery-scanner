import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import Tesseract from "tesseract.js";

const Button = ({ children, onClick }) => (
  <button onClick={onClick} className="bg-blue-500 text-white px-4 py-2 rounded">
    {children}
  </button>
);

export default function LotteryScanner() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        processImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = (imageData) => {
    setLoading(true);
    Tesseract.recognize(imageData, "eng")
      .then(({ data: { text } }) => {
        setResult(text);
      })
      .catch((error) => console.error("OCR Error:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Dò Vé Số</h1>
      {!image ? (
        <>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCapture}
            ref={fileInputRef}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2">
            <Camera size={20} /> Chụp hình vé số
          </Button>
        </>
      ) : (
        <div className="relative flex flex-col items-center">
          <img src={image} alt="Vé số" className="rounded-lg shadow-lg max-w-full mb-4" />
          <Button
            onClick={() => {
              setImage(null);
              setResult("");
            }}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
          >
            <X size={16} />
          </Button>
        </div>
      )}
      {loading && <p className="text-gray-600 mt-2">Đang xử lý hình ảnh...</p>}
      {result && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <h2 className="text-lg font-semibold">Kết quả OCR:</h2>
          <p className="text-gray-800 whitespace-pre-line">{result}</p>
        </div>
      )}
    </div>
  );
}
