import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddSupplierModal from './AddSupplierModal';

const SupplierAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="nguon_nhap"
      fetchUrl="http://localhost:8080/rest/nguon_nhap/getAll"
      updateUrl="http://localhost:8080/rest/nguon_nhap/update"
      deleteUrl="http://localhost:8080/rest/nguon_nhap/delete"
      addUrl="http://localhost:8080/rest/nguon_nhap/add"
      attributeType="supplier"
      AddModal={AddSupplierModal}
    />
  );
};

export default SupplierAttribute; 