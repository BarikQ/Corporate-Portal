import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDataGrid from '@inovua/reactdatagrid-community';

import '@inovua/reactdatagrid-community/index.css';
import styles from './DataGrid.module.scss';

DataGrid.propTypes = {
  className: PropTypes.string,
  handleEdit: PropTypes.func,
  handleSelect: PropTypes.func,
  columns: PropTypes.array,
  data: PropTypes.array,
  editable: PropTypes.bool,
};

const gridStyle = { minHeight: 550 };

function DataGrid({ handleEdit, handleSelect, columns, data, editable, ...props }) {
  const [selected, setSelected] = useState(null);
  const [dataSource, setDataSource] = useState(data);

  const onEditComplete = useCallback(
    ({ value, columnId, rowId }) => {
      const data = [...dataSource];
      data.forEach((target) => {
        if (target.id === rowId) target[columnId] = value;
      });

      setDataSource(data);
      handleEdit(data);
    },
    [dataSource]
  );

  const onSelectionChange = useCallback(
    ({ selected: selectedMap, data }) => {
      const newSelected = Object.keys(selectedMap).map((id) => id);

      setSelected(newSelected);
      handleSelect(newSelected);
    },
    [data]
  );

  return (
    <>
      <div className={styles.hint}>
        You can use <code>click</code>, <code>ctrl/cmd + click</code> or <code>shift + click</code>{' '}
        just like in OS file-system explorers (Finder in macOS or Explorer in Windows)
      </div>
      <ReactDataGrid
        editable
        pagination
        idProperty="id"
        columns={columns}
        dataSource={dataSource}
        style={gridStyle}
        onEditComplete={onEditComplete}
        onSelectionChange={onSelectionChange}
        {...props}
      />
    </>
  );
}

export default DataGrid;
