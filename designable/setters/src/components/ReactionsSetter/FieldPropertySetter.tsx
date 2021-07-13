import React, { useState } from 'react'
import { TextWidget, usePrefix } from '@designable/react'
import { Menu } from 'antd'
import { MonacoInput } from '@designable/react-settings-form'
import { reduce } from '@formily/shared'

export interface IFieldProperty {
  [key: string]: string
}

export interface IFieldPropertySetterProps {
  value?: IFieldProperty
  onChange?: (value: IFieldProperty) => void
}

const FieldProperties = [
  'display',
  'pattern',
  'title',
  'description',
  'value',
  'initialValue',
  'required',
  'dataSource',
  ['component[0]', 'component'],
  ['component[1]', 'componentProps'],
  ['decorator[0]', 'decorator'],
  ['decorator[1]', 'decoratorProps'],
]

export const FieldPropertySetter: React.FC<IFieldPropertySetterProps> = (
  props
) => {
  const [selectKeys, setSelectKeys] = useState(['display'])
  const prefix = usePrefix('field-property-setter')
  const value = { ...props.value }

  const parseExpression = (expression: string) => {
    if (!expression) return ''
    return String(expression).match(/^\{\{([\s\S]*)\}\}$/)?.[1] || ''
  }

  const filterEmpty = (value: object) => {
    return reduce(
      value,
      (buf, value, key) => {
        if (!value || value === '{{}}') return buf
        buf[key] = value
        return buf
      },
      {}
    )
  }

  return (
    <div className={prefix}>
      <Menu
        mode="vertical"
        style={{
          width: 240,
          height: 200,
          paddingRight: 4,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
        defaultSelectedKeys={selectKeys}
        selectedKeys={selectKeys}
        onSelect={({ selectedKeys }) => {
          setSelectKeys(selectedKeys)
        }}
      >
        {FieldProperties.map((key) => {
          if (Array.isArray(key)) {
            return (
              <Menu.Item key={key[0]}>
                <TextWidget
                  token={`SettingComponents.ReactionsSetter.${key[1]}`}
                />
              </Menu.Item>
            )
          }
          return (
            <Menu.Item key={key}>
              <TextWidget token={`SettingComponents.ReactionsSetter.${key}`} />
            </Menu.Item>
          )
        })}
      </Menu>
      <div className={prefix + '-coder-wrapper'}>
        <div
          className={prefix + '-coder-start'}
        >{`$self.${selectKeys[0]} = {{`}</div>
        <div className={prefix + '-coder'}>
          <MonacoInput
            key={selectKeys[0]}
            language="javascript.expression"
            options={{
              fontSize: 14,
            }}
            value={parseExpression(value[selectKeys[0]])}
            onChange={(expression) => {
              props.onChange?.(
                filterEmpty({
                  ...value,
                  [selectKeys[0]]: `{{${expression}}}`,
                })
              )
            }}
          />
        </div>
        <div className={prefix + '-coder-end'}>{`}}`}</div>
      </div>
    </div>
  )
}
