import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import BoolEditor from '@inovua/reactdatagrid-community/BoolEditor';
import DateEditor from '@inovua/reactdatagrid-community/DateEditor';
import NumericEditor from '@inovua/reactdatagrid-community/NumericEditor';

import { User, Preloader, Form, DataGrid } from 'components';
import { getUserData, getUsers } from 'api';
import { setAlert } from 'store/actions';
import { requestModifiler } from 'constants';

import styles from './Home.module.scss';

const columns = [
  {
    name: 'id',
    header: 'ID',
    maxWidth: 200,
    minWidth: 100,
    type: 'string',
    defaultVisible: false,
    editable: false,
  },
  { name: 'firstName', header: 'First Name', maxWidth: 200, minWidth: 100 },
  { name: 'surname', header: 'Surname', maxWidth: 200, minWidth: 100 },
  { name: 'emailDecoded', header: 'Email', maxWidth: 200, minWidth: 100 },
  { name: 'city', header: 'City', maxWidth: 200, minWidth: 100 },
  { name: 'birthDate', header: 'Birth Date', maxWidth: 200, minWidth: 100 },
  { name: 'technologies', header: 'Stack', maxWidth: 200, minWidth: 100 },
  { name: 'profileImage', header: 'Image URL', maxWidth: 200, minWidth: 100 },
  { name: 'created', header: 'Reg. Date', maxWidth: 200, minWidth: 100, editable: false },
];

function AdminHome() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState(null);
  const [selected, setSelected] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState(null);

  useEffect(async () => {
    try {
      const data = await getUsers(requestModifiler.admin);

      setUsers(
        data.map(
          ({
            _id,
            profileData: { firstName, surname, city, birthDate, technologies, profileImage },
            emailDecoded,
            created,
          }) => {
            return {
              id: _id,
              firstName,
              surname,
              emailDecoded,
              city,
              birthDate,
              technologies: technologies.join(', '),
              profileImage,
              created: new Date(created).toLocaleDateString('en-US'),
            };
          }
        )
      );
      setIsLoading(false);
    } catch (error) {
      dispatch(
        setAlert({
          message: `Error: ${error.message}`,
          type: 'error',
        })
      );
      console.log(error);
      setIsLoading(false);
    }
  }, []);

  const handleEdit = (data) => {
    console.log(data);
    setUsers(data);
  };

  const handleSelect = (selected) => {
    setSelected(selected);
  };

  return (
    <div className={`${styles.admin} page__block`}>
      Hello there
      {users ? (
        <>
          <DataGrid
            data={users}
            columns={columns}
            handleEdit={handleEdit}
            handleSelect={handleSelect}
            editable
            multiSelect
            checkboxColumn
            enableSelection
          />
          <p className={styles.selected}>
            Selected users: {selected == null ? 'none' : JSON.stringify(selected)}.
          </p>
        </>
      ) : isLoading ? (
        <Preloader isLoading />
      ) : (
        <div className="profile__not-found">
          404 <br /> User not found
        </div>
      )}
    </div>
  );
}

export default AdminHome;
