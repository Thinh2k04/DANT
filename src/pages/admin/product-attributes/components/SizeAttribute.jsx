import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddSizeModal from './AddSizeModal';

const SizeAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="ktlt"
      fetchUrl="http://localhost:8080/rest/ktlt/getAll"
      updateUrl="http://localhost:8080/rest/ktlt/update"
      deleteUrl="http://localhost:8080/rest/ktlt/delete"
      addUrl="http://localhost:8080/rest/ktlt/add"
      attributeType="size"
      AddModal={AddSizeModal}
    />
  );
};

export default SizeAttribute; 