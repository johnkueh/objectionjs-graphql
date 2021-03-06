import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';
import PageLoading from '../components/page-loading';

export const useList = ({ modelName, collectionQuery }) => {
  const { loading, data } = useQuery(collectionQuery);

  const List = ({ onSelect }) => {
    const key = Object.keys(data)[0];

    return (
      <div data-testid={`${modelName}-list`}>
        {data[key].map(({ id, name }) => (
          <div key={id}>
            <a
              data-testid={`${modelName}-link`}
              className="text-gray-800 font-medium rounded w-64 mb-3 bg-white block shadow-lg px-6 py-4"
              onClick={e => {
                e.preventDefault();
                onSelect(id);
              }}
              href={`/workspaces/${id}/edit`}
            >
              {name}
            </a>
          </div>
        ))}
      </div>
    );
  };

  List.propTypes = {
    onSelect: PropTypes.func
  };
  List.defaultProps = {
    onSelect: () => {}
  };

  return {
    List: loading ? PageLoading : List
  };
};

export default {
  useList
};
