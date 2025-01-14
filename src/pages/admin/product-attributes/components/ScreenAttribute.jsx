import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddScreenModal from './AddScreenModal';

const ScreenAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="man_hinh"
      fetchUrl="http://localhost:8080/rest/man_hinh/getAll"
      updateUrl="http://localhost:8080/rest/man_hinh/update"
      deleteUrl="http://localhost:8080/rest/man_hinh/delete"
      addUrl="http://localhost:8080/rest/man_hinh/add"
      attributeType="screen"
      AddModal={AddScreenModal}
    />
  );
};

export default ScreenAttribute; 