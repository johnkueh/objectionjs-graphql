import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const useUpload = ({ multiple = false, accept = 'image/*' } = {}) => {
  const [state, dispatch] = useReducer(reducer, {});
  const Uploader = ({ onUploaded }) => {
    return (
      <div className="relative">
        <button className="text-blue-600" type="button">
          Upload logo
        </button>
        <input
          multiple={multiple}
          accept={accept}
          className="cursor-pointer absolute w-full opacity-0 bg-red-300 inset-0"
          type="file"
          onChange={async e => {
            const fileBlobs = Array.from(e.target.files);
            const uploads = {};

            fileBlobs.forEach(async file => {
              const formData = new FormData();
              const id = `${file.lastModified}-${file.name}`;
              formData.append('upload_preset', uploadPreset);
              formData.append('file', file);
              uploads[id] = {
                id,
                url: URL.createObjectURL(file),
                progress: 0
              };
              const { data } = await axios.request({
                method: 'post',
                url: `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: ({ loaded, total }) => {
                  const progress = (loaded / total).toFixed(2);
                  dispatch({
                    type: 'SET_PROGRESS',
                    id,
                    progress
                  });
                }
              });
              onUploaded(data);
              dispatch({
                type: 'SET_COMPLETED',
                id
              });
            });

            dispatch({
              type: 'UPLOAD_START',
              uploads
            });
          }}
        />
        <div className="flex flex-wrap">
          {Object.keys(state).map(key => {
            const { url, progress } = state[key];
            return (
              <div key={key} className="relative rounded mr-2 mt-2 mb-2 overflow-hidden shadow-md">
                <img className="preview object-cover opacity-50" alt={key} src={url} />
                <div
                  style={{ width: `${Math.trunc(progress * 100)}%` }}
                  className="progress bg-blue-300"
                />
              </div>
            );
          })}
        </div>
        <style jsx>
          {`
            .progress {
              height: 3px;
            }
            .preview {
              width: 3.5rem;
              height: 3.5rem;
            }
            input[type='file'] {
              font-size: 0;
            }
          `}
        </style>
      </div>
    );
  };

  Uploader.propTypes = {
    onUploaded: PropTypes.func.isRequired
  };

  return Uploader;
};

const cloudName = 'johnkueh';
const uploadPreset = 'y2o0243u';

const reducer = (state, action) => {
  const current = state[action.id];
  const { [action.id]: currentId, ...others } = state;

  switch (action.type) {
    case 'UPLOAD_START':
      return {
        ...state,
        ...action.uploads
      };
    case 'SET_PROGRESS':
      return {
        ...state,
        [action.id]: {
          ...current,
          progress: action.progress
        }
      };
    case 'SET_COMPLETED':
      return {
        ...others
      };
    default:
      return state;
  }
};

export default {
  useUpload
};
