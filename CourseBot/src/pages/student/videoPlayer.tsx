// import React, { useEffect, useRef, useState } from "react";

// const FloatingVideoPlayer = ({ uri }) => {
//     const videoRef = useRef<HTMLDivElement>(null);
//     const [position, setPosition] = useState({ top: 100, left: 100 });
//     const [url, setUrl] = useState<string | null>(null);

//     useEffect(() => {
//         const savedPosition = localStorage.getItem("videoPlayerPosition");
//         const savedUrl = localStorage.getItem("url");
//         if (savedUrl) setUrl(savedUrl);
//         if (savedPosition) {
//             try {
//                 setPosition(JSON.parse(savedPosition));
//             } catch (err) {
//                 console.error("Error parsing saved position:", err);
//             }
//         }

//         const handleStorageChange = (e: StorageEvent) => {
//             if (e.key === "url" && e.newValue) {
//                 setUrl(e.newValue);
//             }
//         };
//         window.addEventListener("storage", handleStorageChange);
//         return () => {
//             window.removeEventListener("storage", handleStorageChange);
//         };
//     }, []);

//     useEffect(() => {
//         const el = videoRef.current;
//         if (!el) return;

//         let isDragging = false;
//         let offsetX = 0;
//         let offsetY = 0;

//         const onMouseDown = (e: MouseEvent) => {
//             isDragging = true;
//             const rect = el.getBoundingClientRect();
//             offsetX = e.clientX - rect.left;
//             offsetY = e.clientY - rect.top;
//             el.style.transition = "none";
//         };

//         const onMouseMove = (e: MouseEvent) => {
//             if (!isDragging) return;

//             const newLeft = e.clientX - offsetX;
//             const newTop = e.clientY - offsetY;

//             el.style.left = `${newLeft}px`;
//             el.style.top = `${newTop}px`;
//             el.style.right = "auto";
//             el.style.bottom = "auto";
//             el.style.position = "fixed";
//         };

//         const onMouseUp = (e: MouseEvent) => {
//             if (!isDragging) return;
//             isDragging = false;
//             el.style.transition = "all 0.2s ease-in-out";

//             const newLeft = e.clientX - offsetX;
//             const newTop = e.clientY - offsetY;
//             const newPosition = { top: newTop, left: newLeft };
//             setPosition(newPosition);
//             localStorage.setItem("videoPlayerPosition", JSON.stringify(newPosition));
//         };

//         el.addEventListener("mousedown", onMouseDown);
//         document.addEventListener("mousemove", onMouseMove);
//         document.addEventListener("mouseup", onMouseUp);

//         return () => {
//             el.removeEventListener("mousedown", onMouseDown);
//             document.removeEventListener("mousemove", onMouseMove);
//             document.removeEventListener("mouseup", onMouseUp);
//         };
//     }, [videoRef.current]); // react to ref change

//     if (!url) return null;

//     return (
//         <div
//             ref={videoRef}
//             className="w-80 h-48 bg-black rounded-lg shadow-lg cursor-move z-50 fixed"
//             style={{
//                 top: `${position.top}px`,
//                 left: `${position.left}px`,
//             }}
//         >
//             <video
//                 controls
//                 className="w-full h-full rounded-lg"
//                 src={uri || url}
//             />
//         </div>
//     );
// };

// export default FloatingVideoPlayer;
import React, { useEffect, useRef, useState } from "react";

const FloatingVideoPlayer = ({ uri }: { uri?: string }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 100, left: 100 });
  const [url, setUrl] = useState<string | null>(null);

  // Load saved position and URL on first mount
  useEffect(() => {
    const savedPosition = localStorage.getItem("videoPlayerPosition");
    const savedUrl = localStorage.getItem("url");
    if (savedUrl) setUrl(savedUrl);
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (err) {
        console.error("Error parsing saved position:", err);
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "url" && e.newValue) {
        setUrl(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle dragging logic
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      el.style.transition = "none";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;

      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
      el.style.right = "auto";
      el.style.bottom = "auto";
      el.style.position = "fixed";
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      el.style.transition = "all 0.2s ease-in-out";

      const newLeft = parseFloat(el.style.left || "0");
      const newTop = parseFloat(el.style.top || "0");
      const newPosition = { top: newTop, left: newLeft };
      setPosition(newPosition);
      localStorage.setItem("videoPlayerPosition", JSON.stringify(newPosition));
    };

    el.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [url]); // reattach if video changes

  if (!url) return null;

  return (
    <div
      ref={videoRef}
      className="w-80 h-48 bg-black rounded-lg shadow-lg cursor-move z-50 fixed"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <video controls className="w-full h-full rounded-lg" src={uri || url} />
    </div>
  );
};

export default FloatingVideoPlayer;
