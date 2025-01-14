import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddGpuModal from './AddGpuModal';

const GpuAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="gpu"
      fetchUrl="http://localhost:8080/rest/gpu/getAll"
      updateUrl="http://localhost:8080/rest/gpu/update"
      deleteUrl="http://localhost:8080/rest/gpu/delete"
      addUrl="http://localhost:8080/rest/gpu/add"
      attributeType="gpu"
      AddModal={AddGpuModal}
    />
  );
};

export default GpuAttribute; 