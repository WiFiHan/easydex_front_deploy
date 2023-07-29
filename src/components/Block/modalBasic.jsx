import { useEffect, useRef } from "react";

function ModalBasic({ setModalOpen }) {
  // 모달 z-index 문제 해결 필요
  let wrapperRef = useRef();
  //모달창 가장 바깥쪽 태그를 감싸주는 역할
  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  const handleClickOutside = (event) => {
    if (wrapperRef && !wrapperRef.current.contains(event.target)) {
      closeModal();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="flex flex-row justify-between w-100[px] h-50[px] bg-white border-solid border-2 rounded"
    >
      <p> 모달창입니다.</p>
      <button onClick={closeModal}>X</button>
    </div>
  );
}

export default ModalBasic;
