import { TextWidget } from '@designable/react'
// import { createPolyInput } from './PolyInput'
import { createPolyInput } from '@designable/react-settings-form/esm/components/PolyInput'
import { Button, Select } from 'antd'
import React from 'react'

const buildIn = [
  'url',
  'email',
  'ipv6',
  'ipv4',
  'number',
  'integer',
  'idcard',
  'qq',
  'phone',
  'money',
  'zh',
  'date',
  'zip',
]

const isText = (value: any) => {
  return typeof value === 'string'
}

const isObject = (value: any) => {
  return typeof value === 'object'
}

export const ValidatorInput = ({ onEditRuleClick, ...props }) => {
  return createPolyInput([
    {
      type: 'TEXT',
      icon: 'Text',
      component: (props: any) => {
        if (isObject(props.value)) {
          return null
        }
        return (
          <Select
            {...props}
            options={buildIn.map((d) => ({ label: d, value: d }))}
          />
        )
      },
      checker: isText,
    },
    {
      type: 'Object',
      icon: 'Expression',
      component: (props: any) => {
        return (
          <Button block onClick={onEditRuleClick}>
            <TextWidget token="SettingComponents.ValidatorSetter.edit" />
          </Button>
        )
      },
      checker: isObject,
    },
  ])({ ...props })
}
