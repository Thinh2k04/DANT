import React from 'react';
import BaseAttributeComponent from './BaseAttributeComponent';
import AddGraphicsCardModal from './AddGraphicsCardModal';

const GraphicsCardAttribute = () => {
  return (
    <BaseAttributeComponent
      endpoint="card_do_hoa"
      fetchUrl="http://localhost:8080/rest/card_do_hoa/getAll"
      updateUrl="http://localhost:8080/rest/card_do_hoa/update"
      deleteUrl="http://localhost:8080/rest/card_do_hoa/delete"
      addUrl="http://localhost:8080/rest/card_do_hoa/add"
      attributeType="graphicsCard"
      AddModal={AddGraphicsCardModal}
    />
  );
};

export default GraphicsCardAttribute; 