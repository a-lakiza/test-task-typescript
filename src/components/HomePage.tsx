import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, message, Button } from 'antd';
import { RouterProps } from 'react-router';
import formConfigurations from '../data/formConfigurations.json';

import { Contact, Configuration } from '../types';
import { ColumnsType } from 'antd/lib/table/interface';

interface HomePageProps extends RouterProps {}

const HomePage: React.FC<HomePageProps> = (props) => {
  const { history } = props;
  const [contacts, setContacts] = useState<Array<Contact>>([]);

  useEffect(() => {
    let data: Array<Contact> | [] = JSON.parse(localStorage.getItem("contactsStorage") as string) || [];
    setContacts(data);
  }, [])

  const deleteContact = (id: string): void => {
    const filteredContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(filteredContacts);
    localStorage.setItem("contactsStorage", JSON.stringify(filteredContacts))

    message.success('Contact successfully deleted');
  }

  const columns: ColumnsType<object> = formConfigurations.map((conf: Configuration) => {
    return {
      title: conf.label,
      dataIndex: conf.name,
      key: conf.name,
      fixed: 'left',
      render: (text: string) => text || '-'
    }
  })

  columns.push({
    title: 'Action',
    key: 'operation',
    fixed: 'left',
    width: 100,
    render: (text: string, item: any) => {
      return (
        <Popconfirm
          title="Are you sure delete this contact?"
          onConfirm={() => deleteContact(item.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button key={item.id} >
            Delete
          </Button>
        </Popconfirm>
      )
    }
  })

  return (
    <div>
      <Table columns={columns} dataSource={contacts} bordered size="small" />
      <Button onClick={() => history.push('/form')} type="primary">Add new contact</Button>
    </div>
  )
}

export default HomePage;
