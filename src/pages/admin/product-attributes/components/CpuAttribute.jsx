import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddCpuModal from './AddCpuModal';

const CpuAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="cpu"
      fetchUrl="http://localhost:8080/rest/cpu/getAll"
      updateUrl="http://localhost:8080/rest/cpu/update"
      deleteUrl="http://localhost:8080/rest/cpu/delete"
      addUrl="http://localhost:8080/rest/cpu/add"
      attributeType="cpu"
      AddModal={AddCpuModal}
    />
  );
};

export default CpuAttribute; 