import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddMaterialModal from './AddMaterialModal';

const MaterialAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="chat_lieu"
      fetchUrl="http://localhost:8080/rest/chat_lieu/getAll"
      updateUrl="http://localhost:8080/rest/chat_lieu/update"
      deleteUrl="http://localhost:8080/rest/chat_lieu/delete"
      addUrl="http://localhost:8080/rest/chat_lieu/add"
      attributeType="material"
      AddModal={AddMaterialModal}
    />
  );
};

export default MaterialAttribute; 