import React, { useState, useEffect } from 'react';
import { Input, Button, DatePicker, InputNumber } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { RouterProps } from 'react-router';

import formConfigurations from '../../data/formConfigurations.json';

import {
  ObjectType,
  FormFields,
  Contact,
  Configuration
} from '../../types/index.d';

import './formPage.css'

interface FormPageProps extends RouterProps {}

const formFields: FormFields = formConfigurations.reduce((acc: ObjectType, conf: Configuration) => {
  acc[conf.name] = {
    required: conf.required,
    value: '',
    error: false,
    errorMessage: conf.required ? conf.errorMessage : null
  }
  return acc;
}, {})


const FormPage: React.FC<FormPageProps> = ({ history }) => {
  const [isValid, setValid] = useState<Boolean>(false);
  const [formValues, setFormValues] = useState<FormFields>(formFields);

  const addContact = (): void => {
    if (isValid) {
      const id: string = uuidv4();
      const newContact: ObjectType = {};
      let data: Array<Contact> | [] = [];

      if (localStorage.getItem("contactsStorage")) {
        data = JSON.parse(localStorage.getItem("contactsStorage") as string);
      };

      for (let field in formValues) {
        newContact[field] = formValues[field].value
      }

      const contacts: Array<Contact> = [...data, {
        id,
        key: id,
        ...newContact
      }];

      localStorage.setItem("contactsStorage", JSON.stringify(contacts));
      history.push('/');
    }
  };

  const checkValid = (): void => {
    const formFieldKeys: string[] = Object.keys(formValues);
    const isFormValid = formFieldKeys.every((field): boolean => {
      if (formValues[field].required) {
        if (!formValues[field].error && !!formValues[field].value) {
          return true
        }
      } else {
        if (!formValues[field].error) {
          return true
        }
      }

      return false
    });

    setValid(isFormValid);
  };

  const handleChangeFormField = (event: React.FormEvent<HTMLInputElement> | string | number | undefined, field: string): void => {
    const eventData = event as React.FormEvent<HTMLInputElement>
    const value = eventData && eventData.currentTarget
      ? eventData.currentTarget.value
      : eventData;

    setFormValues({
      ...formValues,
      [field]: {
        ...formValues[field],
        value,
        error: false
      }
    });
  };

  useEffect(checkValid, [formValues]);

  const handleBlur = (type: string, field: string): void => {
    let isValidField: boolean = false;

    if (type === 'text' || type === 'date') {
      isValidField = !!`${formValues[field].value}`.trim();
    }

    if (type === 'tel') {
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/ig;
      isValidField = phoneRegex.test(formValues[field].value);

      if (formValues[field].value !== '' && !isValidField) {
        return setFormValues({
          ...formValues,
          [field]: {
            ...formValues[field],
            errorMessage: 'Invalid phone number',
            error: true
          }
        })
      } else {
        if (!formValues[field].required) {
          return setFormValues({
            ...formValues,
            [field]: {
              ...formValues[field],
              error: false
            }
          })
        }
      }
    }

    if (!isValidField) {
      return setFormValues({
        ...formValues,
        [field]: {
          ...formValues[field],
          error: true
        }
      })
    }

  }

  return (
    <div>
      {formConfigurations.map(({ label, name, required, type }) => {
        switch (type) {
          case 'date':
            return (
              <div key={name} className="formItem">
                <label htmlFor={name}>{label}</label>
                <DatePicker
                  style={{ width: '250px' }}
                  id={name}
                  onBlur={() => handleBlur(type, name)}
                  onChange={(event, dateString) => handleChangeFormField(dateString, name)}
                />
                {formValues[name].error ? <span className="errorMessage">{formValues[name].errorMessage}</span> : null}
              </div>
            );
          case 'tel':
            return (
              <div key={name} className="formItem">
                <label htmlFor={name}>{label}</label>
                <InputNumber
                  maxLength={11}
                  className="formItemInputNumber"
                  id={name}
                  onBlur={() => handleBlur(type, name)}
                  type={type}
                  onChange={(event) => handleChangeFormField(event, name)}
                />
                {formValues[name].error ? <span className="errorMessage">{formValues[name].errorMessage}</span> : null}
              </div>
            );
          default:
            return (
              <div key={name} className="formItem">
                <label htmlFor={name}>{label}</label>
                <Input
                  id={name}
                  onBlur={() => handleBlur(type, name)}
                  name={name}
                  required={required}
                  onChange={(event) => handleChangeFormField(event, name)}
                  type={type}
                  value={formValues[name].value}
                  maxLength={256}
                />
                {formValues[name].error ? <span className="errorMessage">{formValues[name].errorMessage}</span> : null}
              </div>
            );
        }
      })}
      <Button type="primary" onClick={addContact} disabled={!isValid}>Add contact</Button>
    </div>
  );
};

export default FormPage;