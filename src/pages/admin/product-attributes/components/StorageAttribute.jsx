import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddStorageModal from './AddStorageModal';

const StorageAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="o_luu_tru"
      fetchUrl="http://localhost:8080/rest/o_luu_tru/getAll"
      updateUrl="http://localhost:8080/rest/o_luu_tru/update"
      deleteUrl="http://localhost:8080/rest/o_luu_tru/delete"
      addUrl="http://localhost:8080/rest/o_luu_tru/add"
      attributeType="storage"
      AddModal={AddStorageModal}
    />
  );
};

export default StorageAttribute; 