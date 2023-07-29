import { useState } from "react";
import { editUserProfile } from "../../apis/api";

const MyPageElement = ({ profile, formData, setFormData, title }) => {
  const [isEdit, setIsEdit] = useState(false);

  const handleEdit = (e) => {
    e.preventDefault();
    const { id } = e.target;
    setIsEdit(!isEdit);
    setFormData({ ...formData, [id]: profile[id] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await editUserProfile(formData);
    console.log(response);
  };

  const handleFormData = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  return (
    <>
      <label htmlFor={title} className="label">
        {title}:
      </label>
      {isEdit ? (
        <div className="flex flex-col w-full">
          <input
            disabled={!isEdit}
            type={title}
            id={title}
            className="input"
            onChange={handleFormData}
            value={formData[title]}
          />
          <div className="flex w-full flex-row justify-center gap-x-10 mt-5">
            <button id={title} onClick={handleEdit} className="middle-button">
              취소하기
            </button>
            <button onClick={handleSubmit} className="middle-button">
              수정하기
            </button>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-row items-center justify-between border-b-2 border-b-gray-400 pb-2">
          <p className="ml-3 text-xl font-bold">{profile[title]}</p>
          <button id={title} className="middle-button" onClick={handleEdit}>
            변경
          </button>
        </div>
      )}
    </>
  );
};

export default MyPageElement;
