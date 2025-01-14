import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddColorModal from './AddColorModal';

const ColorAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="mau_sac"
      fetchUrl="http://localhost:8080/rest/mau_sac/getAll"
      updateUrl="http://localhost:8080/rest/mau_sac/update"
      deleteUrl="http://localhost:8080/rest/mau_sac/delete"
      addUrl="http://localhost:8080/rest/mau_sac/add"
      attributeType="color"
      AddModal={AddColorModal}
    />
  );
};

export default ColorAttribute; 