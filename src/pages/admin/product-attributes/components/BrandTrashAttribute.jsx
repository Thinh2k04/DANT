import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddBrandModal from './AddBrandModal';

const BrandTrashAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="thuong-hieu"
      fetchUrl="http://localhost:8080/rest/thuong-hieu/getThungRac"
      updateUrl="http://localhost:8080/rest/thuong-hieu/update"
      deleteUrl="http://localhost:8080/rest/thuong-hieu/delete"
      addUrl="http://localhost:8080/rest/thuong-hieu/add"
      attributeType="brand"
      AddModal={AddBrandModal}
      showTrash={true}
    />
  );
};

export default BrandTrashAttribute; 