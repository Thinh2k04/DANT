import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddRamModal from './AddRamModal';

const RamAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="ram"
      fetchUrl="http://localhost:8080/rest/ram/getAll"
      updateUrl="http://localhost:8080/rest/ram/update"
      deleteUrl="http://localhost:8080/rest/ram/delete"
      addUrl="http://localhost:8080/rest/ram/add"
      attributeType="ram"
      AddModal={AddRamModal}
    />
  );
};

export default RamAttribute; 