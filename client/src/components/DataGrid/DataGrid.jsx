import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDataGrid from '@inovua/reactdatagrid-community';

import '@inovua/reactdatagrid-enterprise/base.css';
import '@inovua/reactdatagrid-enterprise/theme/default-light.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-light.css';
import '@inovua/reactdatagrid-enterprise/theme/amber-dark.css';
import '@inovua/reactdatagrid-enterprise/theme/blue-light.css';
import '@inovua/reactdatagrid-enterprise/theme/blue-dark.css';
import '@inovua/reactdatagrid-enterprise/theme/default-light.css';
import '@inovua/reactdatagrid-enterprise/theme/default-dark.css';
import '@inovua/reactdatagrid-enterprise/theme/green-light.css';
import '@inovua/reactdatagrid-enterprise/theme/green-dark.css';
import '@inovua/reactdatagrid-enterprise/theme/pink-light.css';
import styles from './DataGrid.module.scss';

DataGrid.propTypes = {
  className: PropTypes.string,
  handleEdit: PropTypes.func,
  handleSelect: PropTypes.func,
  columns: PropTypes.array,
  data: PropTypes.array,
};

const gridStyle = { minHeight: 550 };

function DataGrid({ handleEdit, handleSelect, columns, data, ...props }) {
  const [selected, setSelected] = useState(null);
  const [dataSource, setDataSource] = useState(data);

  useEffect(() => {
    setDataSource(data);
  }, [data]);

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
      <ReactDataGrid
        theme={'blue-dark'}
        pagination
        idProperty="id"
        columns={columns}
        dataSource={dataSource}
        style={gridStyle}
        onEditComplete={onEditComplete}
        onSelectionChange={onSelectionChange}
        {...props}
      />
      <div className={styles.hint}>
        You can use <code>click</code>, <code>ctrl/cmd + click</code> or <code>shift + click</code>{' '}
        just like in OS file-system explorers (Finder in macOS or Explorer in Windows)
      </div>
    </>
  );
}

export default DataGrid;
