import React from 'react'
import { createPolyInput } from './PolyInput'
import { Input, Button, Popover, InputNumber, Select } from 'antd'
import { TextWidget } from '@designable/react'

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

const isNormalText = (value: any) => {
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
      component: (props: any) => (
        <Select
          {...props}
          options={buildIn.map((d) => ({ label: d, value: d }))}
        />
      ),
      checker: isNormalText,
    },
    {
      type: 'EXPRESSION',
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
