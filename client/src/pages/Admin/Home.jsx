/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import BoolEditor from '@inovua/reactdatagrid-community/BoolEditor';
import DateEditor from '@inovua/reactdatagrid-community/DateEditor';
import NumericEditor from '@inovua/reactdatagrid-community/NumericEditor';
import SelectEditor from '@inovua/reactdatagrid-community/SelectEditor';

import { User, Preloader, Form, DataGrid, Prompt, Multiselect } from 'components';
import { deleteUser, getUserData, getUsers } from 'api';
import { setAlert } from 'store/actions';
import { REQUEST_MODIFIER, USER_ROLES } from 'constants';

import styles from './Home.module.scss';
import { AccountSettings, ProfileSettings } from 'pages';
import { STACK_OPTIONS } from 'constants';

function DeleteHandler({ onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className={styles.deleteIcon}>
      <DeleteIcon />
    </button>
  );
}

function EditHandler({ onClick }) {
  return (
    <button onClick={onClick} className={styles.editIcon}>
      <EditIcon />
    </button>
  );
}

function SaveHandler({ onClick }) {
  return (
    <button onClick={onClick} className={styles.saveIcon}>
      <SaveIcon />
    </button>
  );
}

function DeletePromptContent() {
  return (
    <span className={styles.promptText}>
      Are you sure you want to delete this user?
      <br /> <span className={styles.warningText}>This action is irreversible.</span>
    </span>
  );
}

const kekw = {
  placeholder: 'Technologies',
  multiPlaceholder: 'Technology',
  name: 'technologies',
  id: 'technologies',
  type: 'multi',
  value: [],
  options: STACK_OPTIONS,
};

function AdminHome() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState(null);
  const [originalUsers, setOriginalUsers] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState(null);

  const columns = useMemo(
    () => [
      {
        name: 'id',
        header: 'ID',
        maxWidth: 200,
        minWidth: 100,
        type: 'string',
        defaultVisible: false,
        editable: false,
      },
      { name: 'firstName', header: 'First Name', maxWidth: 200, minWidth: 100, editable: false },
      { name: 'surname', header: 'Surname', maxWidth: 200, minWidth: 100, editable: false },
      { name: 'emailDecoded', header: 'Email', maxWidth: 200, minWidth: 100, editable: false },
      {
        name: 'role',
        header: 'Role',
        editor: SelectEditor,
        editorProps: {
          idProperty: 'id',
          dataSource: Object.keys(USER_ROLES).map((key) => ({ id: key, label: key })),
          collapseOnSelect: true,
          clearIcon: null,
        },
      },
      { name: 'city', header: 'City', maxWidth: 200, minWidth: 100, editable: false },
      { name: 'birthDate', header: 'Birth Date', maxWidth: 200, minWidth: 100, editable: false },
      {
        name: 'technologies',
        header: 'Stack',
        maxWidth: 200,
        minWidth: 100,
        editable: false,
      },
      {
        name: 'profileImage',
        header: 'Image URL',
        maxWidth: 200,
        minWidth: 100,
        sortable: false,
        editable: false,
      },
      { name: 'created', header: 'Reg. Date', maxWidth: 200, minWidth: 100, editable: false },
      {
        name: 'password',
        header: 'Password',
        maxWidth: 80,
        editable: false,
        sortable: false,
        showHeader: false,
        textAlign: 'center',
        style: (cellProps) => ({ display: 'flex', justifyContent: 'center' }),
        cellProps: { style: { display: 'flex', justifyContent: 'center' } },
        render: ({ data }) => {
          return (
            <Prompt
              data={data}
              dialogTitle={`Edit ${data.firstName} ${data.surname}`}
              Handler={EditHandler}
              DialogPromptComponent={AccountSettings}
              DialogPromptComponentParams={{ isAdminPage: true, adminData: data }}
              cancelText={'Cancel'}
              isConfirmButton={false}
            />
          );
        },
      },
      {
        name: 'edit',
        header: 'Edit user',
        maxWidth: 120,
        editable: false,
        sortable: false,
        showHeader: false,
        textAlign: 'center',
        style: (cellProps) => ({ display: 'flex', justifyContent: 'center' }),
        cellProps: { style: { display: 'flex', justifyContent: 'center' } },
        render: ({ data }) => {
          return (
            <Prompt
              data={data}
              onConfirm={handleProfileEdit}
              dialogTitle={`Edit ${data.firstName} ${data.surname}`}
              Handler={EditHandler}
              DialogPromptComponent={ProfileSettings}
              DialogPromptComponentParams={{ isAdminPage: true, adminData: data }}
              cancelText={'Cancel'}
              isConfirmButton={false}
            />
          );
        },
      },
      {
        name: 'save',
        header: 'Save',
        maxWidth: 50,
        editable: false,
        sortable: false,
        textAlign: 'center',
        style: (cellProps) => ({ display: 'flex', justifyContent: 'center' }),
        cellProps: { style: { display: 'flex', justifyContent: 'center' } },
        render: (data) => {
          return (
            <Prompt
              data={data}
              onConfirm={handleSave}
              dialogTitle={`Edit ${data.firstName} ${data.surname}`}
              Handler={SaveHandler}
              cancelText={'Cancel'}
              confirmText={'Save'}
            />
          );
        },
      },
      {
        name: 'delete',
        header: 'Delete',
        maxWidth: 80,
        editable: false,
        sortable: false,
        textAlign: 'center',
        style: (cellProps) => ({ display: 'flex', justifyContent: 'center' }),
        cellProps: { style: { display: 'flex', justifyContent: 'center' } },
        render: ({ data }) => {
          return (
            <Prompt
              data={data}
              onConfirm={handleUserDeletion}
              dialogTitle={`Delete ${data.firstName} ${data.surname}?`}
              Handler={DeleteHandler}
              DialogPromptText={DeletePromptContent}
            />
          );
        },
      },
    ],
    [users, handleUserDeletion]
  );

  useEffect(async () => {
    try {
      const data = await getUsers(REQUEST_MODIFIER.admin);
      console.log(data);
      const newUsers = data.map(
        ({
          _id,
          profileData: { firstName, surname, city, birthDate, technologies, profileImage },
          emailDecoded,
          created,
          role,
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
            role,
            password: 'Password',
            delete: 'Delete',
            save: 'Save',
          };
        }
      );

      setUsers(newUsers);
      setOriginalUsers(newUsers);
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

  async function handleUserDeletion(data) {
    try {
      await deleteUser(data.id);
      dispatch(
        setAlert({
          message: 'User was deleted successfully',
          type: 'success',
        })
      );
      setUsers(users.filter((user) => user.id !== data.id));
      setOriginalUsers(users.filter((user) => user.id !== data.id));
    } catch (error) {
      const { response } = error;
      dispatch(
        setAlert({
          message: response ? `${response.status}: ${response.data.message}` : error.message,
          type: 'error',
        })
      );
    }
  }

  async function handleSave(data) {
    console.log('saved');
  }

  const handleProfileEdit = (data) => {
    const editedUsers = users.map((user) => (user.id === data.id ? { ...user, ...data } : user));
    console.log(data, editedUsers);

    setUsers(editedUsers);
    setOriginalUsers(editedUsers);
  };

  const handleNativeEdit = (data) => {
    setUsers(data);
    setOriginalUsers(data);
    console.log('NATIVE EDIT', data);
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
            handleEdit={handleNativeEdit}
            handleSelect={handleSelect}
            multiSelect
            editable
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
