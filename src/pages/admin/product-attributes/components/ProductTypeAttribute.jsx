import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddProductTypeModal from './AddProductTypeModal';

const ProductTypeAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="loai_san_pham"
      fetchUrl="http://localhost:8080/rest/loai_san_pham/getAll"
      updateUrl="http://localhost:8080/rest/loai_san_pham/update"
      deleteUrl="http://localhost:8080/rest/loai_san_pham/delete"
      addUrl="http://localhost:8080/rest/loai_san_pham/add"
      attributeType="productType"
      AddModal={AddProductTypeModal}
    />
  );
};

export default ProductTypeAttribute; 